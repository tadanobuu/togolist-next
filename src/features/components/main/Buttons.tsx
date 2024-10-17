import { Button } from "@/components/ui/button"
import { Database } from "@/types/supabase";
import { PlusCircle, UserPlus, Settings } from "lucide-react"
import Link from "next/link";

type userType = Database['public']['Tables']['users']['Row'];
type ChildComponentProps = {
    setIsFriendDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setNewUsername: React.Dispatch<React.SetStateAction<string>>;
    setIsUsernameDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user: userType | null
};

const Buttons = ({setIsFriendDialogOpen, setNewUsername, setIsUsernameDialogOpen, user}: ChildComponentProps) => {

    const handleFriendRegister = () => {
        setIsFriendDialogOpen(true)
    }
    
    const handleUsernameEdit = () => {
        if(user){
            setNewUsername(user.username!);
            setIsUsernameDialogOpen(true);
        }
    }

    return (
        <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold hidden sm:inline">リスト一覧</h2>
            <div className="flex flex-row w-full sm:w-auto justify-around sm:space-x-2">
                <Button onClick={handleUsernameEdit} className="bg-black text-white rounded-xl">
                    <Settings className="w-4 h-4 mr-0 sm:mr-2" />
                    名前変更
                </Button>
                <Button onClick={handleFriendRegister} className="bg-black text-white rounded-xl">
                    <UserPlus className="w-4 h-4 mr-0 sm:mr-2" />
                    フォロー管理
                </Button>
                <Button className="bg-black text-white rounded-xl">
                    <PlusCircle className="w-4 h-4 mr-1 sm:mr-2" />
                    <Link href={"/newPost"}>
                        新規投稿
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default Buttons