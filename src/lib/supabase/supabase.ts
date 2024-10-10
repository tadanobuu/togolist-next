import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zyuekgrvgrilgtfagjge.supabase.co'
const supabaseKey: string = process.env.SUPABASE_KEY!
export const supabase = createClient(supabaseUrl, supabaseKey)