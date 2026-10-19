import { createClient } from '@supabase/supabase-js'
import { config } from './config'

export const publicSupabase = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey,
  { auth: { persistSession: false, autoRefreshToken: false } }
)

export const adminSupabase = createClient(
  config.supabaseUrl,
  config.supabaseServiceRoleKey,
  { auth: { persistSession: false, autoRefreshToken: false } }
)
