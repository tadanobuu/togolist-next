import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { updateFirendId } from "@/lib/supabase/supabaseFunctions"
import { Database } from "@/types/supabase";

type userType = Database['public']['Tables']['users']['Row'];
type ChildComponentProps = {
    user: userType | null;
    followId: string;
    setFollowId: React.Dispatch<React.SetStateAction<string>>;
    setIsFriendDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditFollowIdDialog = ({
        user, 
        followId, 
        setFollowId, 
        setIsFriendDialogOpen, 
        setTrigger
    }:ChildComponentProps) => {

    const cancelFollow = () => {
        if(user) setFollowId(user.follow_id ? user.follow_id : "")
            setIsFriendDialogOpen(false)
        }
    
    const handleFollow = async() => {
        if(user){
            const { error } = await updateFirendId(user, followId)
            if(!error) {
                setTrigger(prev => !prev)
            }
        }
        setIsFriendDialogOpen(false)
    }

    return (
        <DialogContent className="bg-white">
            <DialogHeader>
                <DialogTitle>フォロー管理</DialogTitle>
                <DialogDescription>
                <div>フォローしたいユーザーのフレンドIDを入力してください。</div>
                <div>※1人まで登録可能です。</div>
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Input
                type="text"
                placeholder="フレンドID"
                value={followId}
                onChange={(e) => setFollowId(e.target.value)}
                />
            </div>
            <div>
                あなたのフレンドID: {user?.friend_id}
            </div>
            <DialogFooter>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 w-full">
                    <Button className="hover:bg-slate-200 mb-2 sm:mb-0" variant="outline" onClick={() => cancelFollow()}>キャンセル</Button>
                    <Button className="border border-blue-600 hover:bg-blue-200 mb-2 sm:mb-0" onClick={() => handleFollow()}>フォロー</Button>
                </div>
            </DialogFooter>
        </DialogContent>
    )
}

export default EditFollowIdDialog