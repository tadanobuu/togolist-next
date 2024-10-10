import { createClient } from '@supabase/supabase-js'
import { Database } from '../../types/supabase'

const supabaseUrl: string = process.env.SUPABASE_URL!
const supabaseKey: string = process.env.SUPABASE_KEY!
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)