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
import Buttons from "@/features/components/main/Buttons";
import FilterItems from "@/features/components/main/FilterItems";
import ListDisp from "@/features/components/main/ListDisp";
import GoogleMapDisp from "@/features/components/main/GoogleMapDisp";
import DeleteItemDialog from "@/features/components/main/DeleteItemDialog";
import EditFollowIdDialog from "@/features/components/main/EditFollowIdDialog";
import EditUsernameDialog from "@/features/components/main/EditUsernameDialog";

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
  const [ searchText , setSearchText ] = useState<string>("");
  const [ searchUser , setSearchUser ] = useState<string | null>(null);
  const [ searchPregecture , setSearchPregecture ] = useState<string | null>(null);
  const [ searchStartDate , setSearchStartDate ] = useState<Date | undefined>(undefined);
  const [ searchEndDate , setSearchEndDate ] = useState<Date | undefined>(undefined);

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

  let displayList = togos;
  if(searchText) displayList = displayList.filter(item => item.palceName.indexOf(searchText) !== -1);
  if(searchUser && searchUser !== "ALL") displayList = displayList.filter(item => item.postUserId === searchUser)
  if(searchPregecture && searchPregecture !== "ALL") displayList = displayList.filter(item => item.prefecture === searchPregecture )
  if(searchStartDate && searchEndDate){
      displayList = displayList.filter(item => {
      return(
          (!item.startDate || new Date(item.startDate + "T00:00:00") <= searchEndDate) &&
          (!item.endDate || new Date(item.endDate + "T00:00:00") >= searchStartDate)
      )})
  };

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
          setSearchText={setSearchText}
          setSearchUser={setSearchUser}
          setSearchPregecture={setSearchPregecture}
          setSearchStartDate={setSearchStartDate}
          setSearchEndDate={setSearchEndDate}
          searchStartDate={searchStartDate}
          searchEndDate={searchEndDate}
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