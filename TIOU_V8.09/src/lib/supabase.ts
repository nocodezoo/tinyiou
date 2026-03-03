import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cijsxlylkanxmzkteabg.supabase.co'
const supabaseAnonKey = 'sb_publishable_cOcjpEDxsX7EH-5cm0ByxA_OqbizsX4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
