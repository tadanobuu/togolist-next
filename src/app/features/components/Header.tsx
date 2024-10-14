import { Button } from "@/components/ui/button"
import { Database } from "@/types/supabase";
import { LogOut } from "lucide-react"

type userType = Database['public']['Tables']['users']['Row'];
type props = {
    user: userType | null
}

const Header = ( {user}: props ) => {
    return (
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center bg-black text-white p-5">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">TOGOリスト</h1>
        <div className="flex items-center space-x-4">
        <span>{user ? user.username : ""}</span>
        <Button variant="secondary" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            ログアウト
        </Button>
        </div>
    </div>
    )
}

export default Header