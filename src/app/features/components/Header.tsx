import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/supabaseClient";
import { Database } from "@/types/supabase";
import { LogOut, User } from "lucide-react"
import { useRouter } from 'next/navigation'

type userType = Database['public']['Tables']['users']['Row'];
type props = {
    user: userType | null
}

const Header = ( { user }: props ) => {

    const router = useRouter()

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error("Error signing out:", error.message)
        } else {
            router.push('/login')
        }
    }

    return (
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center bg-black text-white p-5">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">TOGOリスト</h1>
        <div className="flex items-center space-x-4">
        <User className="mr-2 h-4 w-4" /> 
        {user ? user.username : "NO NAME"}
        <Button variant="secondary" size="sm" className="border" onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-2" />
            ログアウト
        </Button>
        </div>
    </div>
    )
}

export default Header