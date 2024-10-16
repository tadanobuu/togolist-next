import { Database } from "@/types/supabase";

type newUserType = Database['public']['Tables']['users']['Insert'];

export const createNewUser = (id: string , username: string) => {

    const newUser: newUserType = {
        id,
        username: username,
        friend_id: Math.random().toString(36).substring(2, 10),
        follow_id: null,
    }

    return newUser;
}