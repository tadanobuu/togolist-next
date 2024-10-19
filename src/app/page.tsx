import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


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

    useEffect(() => {
        pageChenge();
    },[]);

    return (
        <h2>ページ遷移中</h2>
    )
}

export default Page