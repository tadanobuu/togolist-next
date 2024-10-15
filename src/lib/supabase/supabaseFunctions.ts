import { PostgrestResponse } from '@supabase/supabase-js';
import { supabase } from './supabaseClient'
import { Database } from '@/types/supabase';

type Togo = Database['public']['Tables']['togo']['Row'];
type newTogo = Database['public']['Tables']['togo']['Insert'];
type updateTogo = Database['public']['Tables']['togo']['Update'];
type userType = Database['public']['Tables']['users']['Row'];

export const getTogos = async (userId: userType['friend_id'], followId: userType['follow_id']): Promise<Togo[]> => {
    const { data , error }: PostgrestResponse<Togo> = await supabase
        .from("togo")
        .select("*")
        .or(`postUserId.eq.${userId},postUserId.eq.${followId}`)
        .order('postDatetime', { ascending: false });

    if(error){
        console.log(error);
        return [];
    }
    return data ?? [];
};

export const addTogo = async (newTogo: newTogo) => {
    const { data, error } = await supabase.from("togo").upsert(newTogo).select()

    if(error){
        console.log(error);
    }

    return data;
}

export const updateTodo = async (newTogo: updateTogo) => {
    const { data, error } = await supabase.from('togo').update(newTogo).eq('id', newTogo.id!);
    if (error){
        console.log(error);
    }

    return data;
};

export const deleteTodo = async (id: number, imagePath: string | null) => {
    const { data, error } = await supabase.from('togo').delete().eq('id', id);
    if (error){
        console.log(error);
    }

    if(imagePath){
        const { error } = await supabase.storage.from("togo_image_bucket").remove([imagePath]);

        if(error){
            console.log(error)
        }
    }

    return data;
};