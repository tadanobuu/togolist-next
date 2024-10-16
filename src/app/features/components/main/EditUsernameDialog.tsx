import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { updateUsername } from "@/lib/supabase/supabaseFunctions"
import { Database } from "@/types/supabase";

type userType = Database['public']['Tables']['users']['Row'];
type ChildComponentProps = {
    user: userType | null,
    newUsername: string,
    setUser: React.Dispatch<React.SetStateAction<userType | null>>,
    setNewUsername: React.Dispatch<React.SetStateAction<string>>,
    setIsUsernameDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
};

const EditUsernameDialog = ({
        user,
        setUser,
        setNewUsername,
        setIsUsernameDialogOpen,
        newUsername
    }: ChildComponentProps) => {

    const handleUsernameChange = async() => {
        if(user){
            const { error } = await updateUsername(user, newUsername)
    
            if(!error){
                setUser({ ...user , username : newUsername });
                setNewUsername("");
                setIsUsernameDialogOpen(false);
            }
        }
    }

    return (
        <DialogContent className="bg-white">
            <DialogHeader>
                <DialogTitle>ユーザー名の変更</DialogTitle>
                <DialogDescription>
                    新しいユーザー名を入力してください。
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Input
                type="text"
                placeholder="新しいユーザー名"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                />
            </div>
            <DialogFooter>
                <Button variant="outline" className="hover:bg-slate-200 mb-2 sm:mb-0" onClick={() => setIsUsernameDialogOpen(false)}>キャンセル</Button>
                <Button className="border border-green-600 hover:bg-green-200 mb-2 sm:mb-0" onClick={() => handleUsernameChange()}>変更</Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default EditUsernameDialog