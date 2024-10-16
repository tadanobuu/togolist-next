'use client';

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog } from "@/components/ui/dialog"
import { getTogos, getUser, addUser, getFirendUser } from "@/lib/supabase/supabaseFunctions";
import { Database } from "@/types/supabase";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from 'next/navigation';
import Footer from "@/components/Footer";
import { createNewUser } from "@/lib/createNewUser";
import Buttons from "@/app/features/components/main/Buttons";
import FilterItems from "@/app/features/components/main/FilterItems";
import ListDisp from "@/app/features/components/main/ListDisp";
import GoogleMapDisp from "@/app/features/components/main/GoogleMapDisp";
import DeleteItemDialog from "@/app/features/components/main/DeleteItemDialog";
import EditFollowIdDialog from "@/app/features/components/main/EditFollowIdDialog";
import EditUsernameDialog from "@/app/features/components/main/EditUsernameDialog";

type Togo = Database['public']['Tables']['togo']['Row'];
type userType = Database['public']['Tables']['users']['Row'];
type newUser = Database['public']['Tables']['users']['Insert'];

export default function TOGOListMain() {

  const [ togos , setTogos ] = useState<Togo[]>([]);
  const [ isLoading , setIsLoading ] = useState<boolean>(false);
  const [ selectedItemId, setSelectedItemId ] = useState<number | null>(null)
  const [ selectedItemImagePath, setSelectedItemImagePath ] = useState<string | null>(null)
  const [ isDialogOpen, setIsDialogOpen ] = useState<boolean>(false)
  const [ user, setUser ] = useState<userType | null>(null)
  const [ isFriendDialogOpen, setIsFriendDialogOpen ] = useState(false)
  const [ followId, setFollowId ] = useState<string>("")
  const [ followUsername, setFollowUsername ] = useState<string | null>("")
  const [ trigger, setTrigger ] = useState<boolean>(false);
  const [ isUsernameDialogOpen, setIsUsernameDialogOpen ] = useState<boolean>(false)
  const [ newUsername, setNewUsername ] = useState<string>("")
  const [ displayList, setDisplayList ] = useState<Togo[]>([])

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: session } = await supabase.auth.getSession();

      if (!session?.session?.user) {
        router.push('/login');
      } else {
        setIsLoading(true)
        const { userData, error } = await getUser(session?.session?.user.id)
        if( error ) return
        if( !userData || userData.length === 0 ){
              const userinfo: newUser = createNewUser(session.session.user.id, "新規ユーザー");
              await addUser(userinfo)
              setTrigger(!trigger)
        } else {
          setUser(userData[0]);

          if(userData[0].follow_id){
            setFollowId(userData[0].follow_id)

            const { data } = await getFirendUser(userData[0])
            if(data){
              setFollowUsername(data.length ? data[0].username : "")
            }
          }

          return userData[0];
        }
      }
    };

    const fetchTogos = async(user: userType) => {
      try{
        if(user){
          const data = await getTogos(user.friend_id , user.follow_id);
          setTogos(data)
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    };

    checkUser().then((user) => user ? fetchTogos(user) : console.log(user));
  },[router,trigger])

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />

      <main className="flex-grow container mx-auto p-4">
        <Buttons 
          setIsFriendDialogOpen={setIsFriendDialogOpen} 
          setNewUsername={setNewUsername} 
          setIsUsernameDialogOpen={setIsUsernameDialogOpen} 
          user={user}
        />

        <FilterItems
          user={user}
          followId={followId}
          followUsername={followUsername}
          setDisplayList={setDisplayList}
          togos={togos}
        />

        <Tabs defaultValue="list" className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">リスト</TabsTrigger>
            <TabsTrigger value="map">マップ</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <ListDisp 
              isLoading={isLoading} 
              displayList={displayList}
              user={user}
              followId={followId}
              followUsername={followUsername}
              setIsDialogOpen={setIsDialogOpen}
              setSelectedItemId={setSelectedItemId}
              setSelectedItemImagePath={setSelectedItemImagePath}
            />
          </TabsContent>
          <TabsContent value="map">
            <GoogleMapDisp />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DeleteItemDialog 
          selectedItemId={selectedItemId}
          selectedItemImagePath={selectedItemImagePath}
          setTogos={setTogos}
          setIsDialogOpen={setIsDialogOpen}
        />
      </Dialog>

      <Dialog open={isFriendDialogOpen} onOpenChange={setIsFriendDialogOpen}>
        <EditFollowIdDialog
          user={user}
          followId={followId}
          setFollowId={setFollowId}
          setIsFriendDialogOpen={setIsFriendDialogOpen}
          setTrigger={setTrigger}
        />
      </Dialog>

      <Dialog open={isUsernameDialogOpen} onOpenChange={setIsUsernameDialogOpen}>
        <EditUsernameDialog
          user={user}
          setUser={setUser}
          setNewUsername={setNewUsername}
          setIsUsernameDialogOpen={setIsUsernameDialogOpen}
          newUsername={newUsername}
        />
      </Dialog>
    </div>
  )
}