import { supabase } from './supabaseClient'
import { Database } from '@/types/supabase';

type Togo = Database['public']['Tables']['togo']['Row'];

export const getAllTogos = async () => {
    const togos = await supabase.from("togo").select("");
    return togos;
};

export const addTogo = async (newTogo: Togo) => {
    await supabase.from("togo").insert(newTogo)
}