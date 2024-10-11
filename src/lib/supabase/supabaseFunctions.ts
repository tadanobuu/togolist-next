import { PostgrestResponse } from '@supabase/supabase-js';
import { supabase } from './supabaseClient'
import { Database } from '@/types/supabase';

type Togo = Database['public']['Tables']['togo']['Row'];

export const getAllTogos = async (): Promise<Togo[]> => {
    const { data , error }: PostgrestResponse<Togo> = await supabase.from("togo").select("*");

    if(error){
        console.log("Error fetch")
        return [];
    }
    return data ?? [];
};

export const addTogo = async (newTogo: Togo) => {
    await supabase.from("togo").insert(newTogo)
}