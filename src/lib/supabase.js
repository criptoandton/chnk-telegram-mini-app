import { createClient } from '@supabase/supabase-js'

// Anon-ключ виден в браузере — безопасность держит RLS на стороне Supabase.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url, key, { auth: { persistSession: false } })
export const hasConfig = Boolean(url && key && !String(key).includes('...'))
