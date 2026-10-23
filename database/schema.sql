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
  file_path TEXT,
  file_type VARCHAR(100),
  file_size INTEGER,
  description TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.uploads
  ADD COLUMN IF NOT EXISTS file_path TEXT;

ALTER TABLE public.uploads
  ADD COLUMN IF NOT EXISTS storage_path TEXT;

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
  ('The 20-Second Scientific Handwashing Rule', 'Learn the exact technique endorsed by the WHO to eliminate 99.8% of daily surface germs', 'Personal Hygiene', 'Wet hands with clean water, apply soap, lather for at least 20 seconds, scrub between fingers, thumbs, under nails, and dry with a clean single-use towel.', true),
  ('Precision Dental Hygiene: Beyond Just Brushing', 'Maintain healthy teeth and gums with proper dental and tongue hygiene', 'Dental Health', 'Brush twice daily with fluoride toothpaste, do not rinse immediately after spitting, floss once a day, and scrape your tongue to eliminate volatile sulfur compounds.', true),
  ('Kitchen Cross-Contamination & Cutting Boards', 'Keep your food preparation areas safe from dangerous foodborne pathogens', 'Food Hygiene', 'Use dedicated cutting boards for raw meats and produce, never rinse raw poultry under running taps, and disinfect sponges every 48 hours.', true),
  ('Clean Drinking Water & Reusable Bottle Hygiene', 'Understanding clean water standards and daily bottle sanitization', 'Environmental Health', 'Wash reusable bottles and silicone valves daily with hot soapy water. Keep filtered water pitchers refrigerated to prevent microbial biofilms.', false),
  ('Sleep Space & Bedding Microbiology Hygiene', 'Keep your living and sleeping space clean and healthy', 'Home Hygiene', 'Wash pillowcases every 3-4 days and bedsheets weekly at 60C (140F) to eliminate accumulated dust mites, sebum, and shed skin cells.', false),
  ('Respiratory Hygiene & Public Transit Etiquette', 'Protect yourself and others from seasonal viral infections', 'Health Protection', 'Cover coughs and sneezes with the crook of your elbow, carry a 60%+ alcohol hand sanitizer, and avoid touching facial mucus membranes.', true),
  ('Smartphone & Personal Tech Sanitization Protocol', 'Safely disinfect the devices you touch thousands of times daily', 'Personal Hygiene', 'Wipe device screens daily with 70% isopropyl alcohol wipes. Avoid using phones in bathrooms where aerosolized plumes settle.', true),
  ('Indoor Air Quality & Cross-Ventilation Hygiene', 'Reduce indoor CO2 buildup, volatile organic compounds, and allergens', 'Environmental Health', 'Open opposing windows for 10-15 minutes twice daily to create cross-ventilation. Use HEPA air purifiers and maintain 40-50% relative humidity.', false),
  ('Post-Workout Gym Gear & Skin Barrier Protection', 'Prevent skin infections and folliculitis after intense exercise', 'Health Protection', 'Shower within 20 minutes of exercising, wash workout gear after every session, and use barrier towels on communal fitness equipment.', false),
  ('Bathroom Surface & High-Touch Disinfection', 'The science of disinfectant dwell times on household surfaces', 'Home Hygiene', 'Allow disinfectants to remain visibly wet for their recommended 3-10 minute contact time. Close toilet lids before flushing to suppress bacterial aerosols.', false),
  ('Produce Washing: Removing Pesticides and Soil Bacteria', 'Effective soaking and washing methods for fresh fruits and vegetables', 'Food Hygiene', 'Rinse all produce under running water—even melons and citrus before cutting. Soak leafy greens in diluted white vinegar or baking soda solutions.', true),
  ('Nail Care & Subungual Microbe Management', 'Eliminate the primary reservoir for skin-to-mouth pathogens', 'Personal Hygiene', 'Keep nails neatly trimmed and scrub underneath with a dedicated nail brush after food prep or gardening. Disinfect clippers after use.', false),
  ('Safe Food Storage Temperatures & Refrigerator Zones', 'Keep perishables out of the dangerous bacterial growth zone', 'Food Hygiene', 'Maintain refrigerators at 38F (3.3C) or lower. Store raw meats on bottom shelves and do not keep dairy in warm door shelves.', true),
  ('Contact Lens Care & Ocular Infection Prevention', 'Prevent serious cornea infections with strict lens hygiene habits', 'Personal Hygiene', 'Never expose lenses or cases to tap water. Replace cases every 3 months and dry them upside down after cleaning.', false),
  ('Ergonomic & Screen Hygiene for Digital Workers', 'Protect vision, posture, and circadian cycles during daily screen use', 'Health Protection', 'Follow the 20-20-20 rule to rest eye muscles, position displays at arm length, and reduce blue light exposure 2 hours before bed.', false);

-- Insert sample recommendations (you can customize these)
-- These will be user-specific once users sign up
