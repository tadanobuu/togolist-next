import { PostgrestResponse } from '@supabase/supabase-js';
import { supabase } from './supabaseClient'
import { Database } from '@/types/supabase';

type Togo = Database['public']['Tables']['togo']['Row'];
type newTogo = Database['public']['Tables']['togo']['Insert'];
type updateTogo = Database['public']['Tables']['togo']['Update'];
type userType = Database['public']['Tables']['users']['Row'];
type newUserType = Database['public']['Tables']['users']['Insert'];

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

export const getUser = async(id: string) => {
    const { data: userData, error } = await supabase
        .from('users')
        .select('*') 
        .eq('id', id);  

    if (error) {
        console.error('Error fetching user data:', error);
    }

    return { userData , error } 
}

export const addUser = async(user: newUserType) => {
    const { data, error } = await supabase.from('users').insert(user);

    if (error) {
        console.error('Error inserting user into users table:', error);
    } else {
        console.log('User inserted into users table successfully');
    }

    return { data, error }
}

export const getFirendUser = async(userData: userType) => {
    if(userData.follow_id){
        const { data, error } = await supabase
        .from('users')
        .select('username') 
        .eq('friend_id', userData.follow_id);

        if(error){
            console.log(error)
        }
        
        return { data }
    }
    const data = null
    return { data }
}

export const signinWithPassword = async(email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    
    if (error) {
        if(error.message === "Email not confirmed"){
            console.log("送信された確認メールから登録を行ってください")
        }else{
            console.log("Error signing in:", error.message)
        }
    }
    
    return {error}
}

export const signinWithGoogleOAuth = async() => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'http://localhost:3000/main',
        },
    })

    if (error) {
        console.error('Google login error:', error.message);
    }
}

export const signUp = async(email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    return { data, error }
}

export const updateFirendId = async(user: userType , followId: string) => {
    const { error } = await supabase
        .from('users')
        .update({ follow_id: followId })
        .eq('id', user.id);

    if (error) {
        console.error('Error updating follow_id:', error);
    }

    return{ error }
}

export const updateUsername = async(user: userType , newUsername: string) => {
    const { error } = await supabase
        .from('users')
        .update({ username: newUsername })
        .eq('friend_id', user.friend_id!);

    if(error){
        console.error('Error updating username:', error);
    }

    return { error }
}