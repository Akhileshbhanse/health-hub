-- Health & Hygiene Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hygiene tips table
CREATE TABLE IF NOT EXISTS public.tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  content TEXT,
  image_url TEXT,
  author VARCHAR(255),
  is_featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User uploads table
CREATE TABLE IF NOT EXISTS public.uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  description TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendations table
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  category VARCHAR(100),
  priority VARCHAR(50) DEFAULT 'medium',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Storage bucket used by the backend upload endpoint.
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tips_category ON public.tips(category);
CREATE INDEX IF NOT EXISTS idx_tips_featured ON public.tips(is_featured);
CREATE INDEX IF NOT EXISTS idx_uploads_user_id ON public.uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON public.recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_is_read ON public.recommendations(is_read);

-- Storage object access is scoped to the first path segment (the user's id).
CREATE POLICY "Users can view their own stored uploads" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload their own stored uploads" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own stored uploads" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Tips policies (public read)
CREATE POLICY "Anyone can view tips" ON public.tips
  FOR SELECT USING (true);

-- Uploads policies
CREATE POLICY "Users can view their own uploads" ON public.uploads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own uploads" ON public.uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploads" ON public.uploads
  FOR DELETE USING (auth.uid() = user_id);

-- Recommendations policies
CREATE POLICY "Users can view their own recommendations" ON public.recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations" ON public.recommendations
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tips_updated_at BEFORE UPDATE ON public.tips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample hygiene tips
INSERT INTO public.tips (title, description, category, content, is_featured) VALUES
  ('Proper Handwashing Technique', 'Learn the correct way to wash your hands to prevent the spread of germs', 'Personal Hygiene', 'Wet your hands with clean water, apply soap, lather for at least 20 seconds, rinse thoroughly, and dry with a clean towel.', true),
  ('Daily Dental Care', 'Maintain healthy teeth and gums with proper dental hygiene', 'Dental Health', 'Brush twice daily, floss once a day, use mouthwash, and visit your dentist every 6 months.', true),
  ('Food Safety Guidelines', 'Keep your food safe from contamination', 'Food Hygiene', 'Store food at proper temperatures, wash fruits and vegetables, cook meat thoroughly, and avoid cross-contamination.', false),
  ('Clean Water Importance', 'Understanding the role of clean water in hygiene', 'Environmental Health', 'Always use clean, filtered water for drinking and cooking. Ensure water storage containers are clean and covered.', false),
  ('Personal Space Hygiene', 'Keep your living space clean and healthy', 'Home Hygiene', 'Regularly clean surfaces, maintain good ventilation, manage waste properly, and keep your sleeping area clean.', false),
  ('Respiratory Hygiene', 'Protect yourself and others from respiratory infections', 'Health Protection', 'Cover your mouth when coughing or sneezing, use tissues, wash hands frequently, and maintain distance when sick.', true),
  ('Clothing and Laundry', 'Maintain clean clothing for better health', 'Personal Hygiene', 'Wash clothes regularly, dry them properly, iron when needed, and store in clean spaces.', false),
  ('Kitchen Hygiene Basics', 'Essential practices for a hygienic kitchen', 'Food Hygiene', 'Clean countertops daily, sanitize cutting boards, wash dishes properly, and manage food waste effectively.', false);

-- Insert sample recommendations (you can customize these)
-- These will be user-specific once users sign up
