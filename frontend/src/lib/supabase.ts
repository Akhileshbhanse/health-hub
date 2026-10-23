import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Tip = {
  id: string
  title: string
  description: string
  category: string
  content?: string
  image_url?: string
  author?: string
  is_featured: boolean
  views: number
  created_at: string
  updated_at: string
}

export type Upload = {
  id: string
  user_id: string
  file_name: string
  file_url: string
  file_path: string
  storage_path: string | null
  file_type?: string
  file_size?: number
  description?: string
  uploaded_at: string
}

export type Recommendation = {
  id: string
  user_id: string
  content: string
  category?: string
  priority: 'low' | 'medium' | 'high'
  is_read: boolean
  created_at: string
}
