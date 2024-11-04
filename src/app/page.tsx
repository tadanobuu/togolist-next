'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const Page = () => {

    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter();

    useEffect(() => {
        const pageChenge = async() => {
            const { data: session } = await supabase.auth.getSession();
        
            if (!session?.session?.user) {
                router.push('/login');
            } else {
                router.push('/main');
            }
            setIsLoading(false);
        }
        
        pageChenge()
    },[router]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="mt-4 text-lg font-medium text-gray-600">認証状態を確認中...</p>
            </div>
        )
    }
    
    return <></>
}

export default Page