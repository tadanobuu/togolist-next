import { createClient } from '@supabase/supabase-js'
import { Database } from '../../types/supabase'

console.log("Supabase URL: ", process.env.NEXT_PUBLIC_SUPABASE_URL);

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!;
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)