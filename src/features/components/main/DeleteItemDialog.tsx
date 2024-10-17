import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { deleteTodo } from "@/lib/supabase/supabaseFunctions"
import { Database } from "@/types/supabase";

type TogoType = Database['public']['Tables']['togo']['Row'];
type ChildComponentProps = {
  selectedItemId: number | null;
  selectedItemImagePath: string | null;
  setTogos: React.Dispatch<React.SetStateAction<TogoType[]>>;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteItemDialog = ({
    selectedItemId, 
    selectedItemImagePath, 
    setTogos, 
    setIsDialogOpen 
  }: ChildComponentProps) => {

  const confirmVisited = async() => {
    if(selectedItemId){
      await deleteTodo(selectedItemId, selectedItemImagePath)
      setTogos(prev => prev.filter(item => item.id !== selectedItemId))
    }
    setIsDialogOpen(false);
  }

    return (
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>訪問済みの確認</DialogTitle>
            <DialogDescription>
              このアイテムを訪問済みとしてリストから削除しますか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 w-full">
            <Button className="hover:bg-slate-200 mb-2 sm:mb-0" variant="outline" onClick={() => setIsDialogOpen(false)}>キャンセル</Button>
            <Button className="border border-red-600 hover:bg-red-200 mb-2 sm:mb-0" variant="destructive" onClick={confirmVisited}>削除</Button>
          </div>
          </DialogFooter>
        </DialogContent>
    )
}

export default DeleteItemDialog