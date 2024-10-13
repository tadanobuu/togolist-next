import { PostgrestResponse } from '@supabase/supabase-js';
import { supabase } from './supabaseClient'
import { Database } from '@/types/supabase';

type Togo = Database['public']['Tables']['togo']['Row'];
type newTogo = Database['public']['Tables']['togo']['Insert'];
type updateTogo = Database['public']['Tables']['togo']['Update'];

export const getAllTogos = async (): Promise<Togo[]> => {
    const { data , error }: PostgrestResponse<Togo> = await supabase.from("togo").select("*");

    if(error){
        console.log("Error fetch");
        return [];
    }
    return data ?? [];
};

export const addTogo = async (newTogo: newTogo) => {
    const { data, error } = await supabase.from("togo").insert(newTogo)

    if(error){
        console.log("Error add");
    }

    return data;
}

export const updateTodo = async (newTogo: updateTogo) => {
    const { data, error } = await supabase.from('togo').update(newTogo).eq('id', newTogo.id!);
    if (error){
        console.log("Error update");
    }

    return data;
};

export const deleteTodo = async (id: number) => {
    const { data, error } = await supabase.from('togo').delete().eq('id', id);
    if (error){
        console.log("Error delete");
    }

    return data;
};