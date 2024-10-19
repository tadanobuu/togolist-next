'use client';

import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";

const Page = () => {

    const router = useRouter();

    const pageChenge = async() => {
        const { data: session } = await supabase.auth.getSession();
    
        if (!session?.session?.user) {
            router.push('/login');
        } else {
            router.push('/main');
        }
    }

    pageChenge();

    return (
        <h2>ページ遷移中</h2>
    )
}

export default Page