import { createClient } from '@supabase/supabase-js'
import { Database } from '../../types/supabase'

const supabaseUrl: string = "https://zyuekgrvgrilgtfagjge.supabase.co"
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_KEY!
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)