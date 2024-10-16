'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarIcon, MapPin, Clock, User, PlusCircle, UserPlus, Settings } from "lucide-react"
import Image from "next/image";
import Link from "next/link";
import { getTogos, deleteTodo, getUser, addUser, getFirendUser, updateFirendId, updateUsername } from "@/lib/supabase/supabaseFunctions";
import { Database } from "@/types/supabase";
import Header from "@/app/features/components/Header";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from 'next/navigation';
import { prefectures } from "@/lib/prefectures";
import Footer from "@/app/features/components/Footer";
import { createNewUser } from "@/lib/createNewUser";

type Togo = Database['public']['Tables']['togo']['Row'];
type userType = Database['public']['Tables']['users']['Row'];
type newUser = Database['public']['Tables']['users']['Insert'];

export default function TOGOListMain() {

  const [ togos , setTogos ] = useState<Togo[]>([]);
  const [ isLoading , setIsLoading ] = useState<boolean>(false);
  const [ inputText , setInputText ] = useState<string>("");
  const [ searchText , setSearchText ] = useState<string>("");
  const [ searchUser , setSearchUser ] = useState<string | null>(null);
  const [ searchPregecture , setSearchPregecture ] = useState<string | null>(null);
  const [ searchStartDate , setSearchStartDate ] = useState<Date | undefined>(undefined);
  const [ searchEndDate , setSearchEndDate ] = useState<Date | undefined>(undefined);
  const [ selectedItemId, setSelectedItemId ] = useState<number | null>(null)
  const [ selectedItemImagePath, setSelectedItemImagePath ] = useState<string | null>(null)
  const [ isDialogOpen, setIsDialogOpen ] = useState<boolean>(false)
  const [ user, setUser ] = useState<userType | null>(null)
  const [ isFriendDialogOpen, setIsFriendDialogOpen ] = useState(false)
  const [ followId, setFollowId ] = useState<string>("")
  const [ followUsername, setFollowUsername] = useState<string | null>("")
  const [ trigger, setTrigger ] = useState<boolean>(false);
  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState<boolean>(false)
  const [ newUsername, setNewUsername ] = useState<string>("")


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

  const startDateChange = (value: Date | undefined) => {
    setSearchStartDate(value)

    if(!searchEndDate || !value || searchEndDate < value){
      setSearchEndDate(value)
    }
  }

  const endDateChange = (value: Date | undefined) => {
    setSearchEndDate(value)

    if(!searchStartDate || !value || searchStartDate > value){
      setSearchStartDate(value)
    }
  }

  const dialogOpen = (id: number, imagePath: string | null) => {
    setSelectedItemId(id)
    setSelectedItemImagePath(imagePath)
    setIsDialogOpen(true)
  }

  const confirmVisited = async() => {
    if(selectedItemId){
      await deleteTodo(selectedItemId, selectedItemImagePath)
      setTogos(togos.filter(item => item.id !== selectedItemId))
    }
    setIsDialogOpen(false);
  }

  const handleFriendRegister = () => {
    setIsFriendDialogOpen(true)
  }

  const cancelFollow = () => {
    if(user) setFollowId(user.follow_id ? user.follow_id : "")
    setIsFriendDialogOpen(false)
  }

  const handleFollow = async() => {
    if(user){
      const { error } = await updateFirendId(user, followId)
      if(!error) {
        setTrigger(!trigger)
      }
    }
    setIsFriendDialogOpen(false)
  }

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

  const handleUsernameEdit = () => {
    if(user){
      setNewUsername(user.username!);
      setIsUsernameDialogOpen(true);
    }
  }

  // 検索条件に対してフィルター
  let displayList = togos;
  if(searchText){
    displayList = displayList.filter(item => item.palceName.indexOf(searchText) !== -1)
  };
  if(searchUser && searchUser !== "ALL"){
    displayList = displayList.filter(item => item.postUserId === searchUser)
  };
  if(searchPregecture && searchPregecture !== "ALL"){
    displayList = displayList.filter(item => item.prefecture === searchPregecture )
  };
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

        <div className="mb-4 space-y-2">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Input 
              type="text"
              placeholder="地名で検索"
              className="flex-grow"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <Button 
              className="bg-black text-white rounded-xl"
              onClick={() => setSearchText(inputText)}
            >検索</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            <Select onValueChange={(value: string) => setSearchUser(value)}>
              <SelectTrigger>
                <SelectValue placeholder="投稿者" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-50">
                <SelectItem value="ALL">全ての投稿者</SelectItem>
                <SelectItem value={user?.friend_id ? user?.friend_id : "a"}>{user?.username}</SelectItem>
                <SelectItem value={followId ? followId : "a"}>{followUsername}</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value: string) => setSearchPregecture(value)}>
              <SelectTrigger>
                <SelectValue placeholder="都道府県" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-50">
                <SelectItem value="ALL">全ての都道府県</SelectItem>
                {prefectures.map(prefecture => {
                  return <SelectItem key={prefecture} value={prefecture}>{prefecture}</SelectItem>
                })}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchStartDate ? <span>{searchStartDate.toLocaleDateString('sv-SE')}</span> : <span>開始日</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  className="bg-neutral-50"
                  initialFocus
                  onSelect={(value) => startDateChange(value)}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchEndDate ? <span>{searchEndDate.toLocaleDateString('sv-SE')}</span> : <span>終了日</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar 
                  mode="single"
                  className="bg-neutral-50"
                  initialFocus
                  onSelect={(value) => endDateChange(value)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Tabs defaultValue="list" className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">リスト</TabsTrigger>
            <TabsTrigger value="map">マップ</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <div className="gap-y-4 grid lg:grid-cols-2 lg:gap-x-4">
              { isLoading ? <h3 className="font-bold">loading...</h3> :
                displayList.map((item: Togo) => (
                  <Card key={item.id} className="overflow-hidden rounded-2xl">
                    <div className="relative h-64">
                      {item.imageUrl ? 
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill={true}
                        className="absolute inset-0 w-full h-full object-cover"
                        aria-hidden="true"
                      /> :
                      <></>}
                      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                      <div className="relative h-full p-6 flex flex-col justify-between text-white">
                        <div>
                          <CardTitle className="text-2xl mb-2">{item.palceName}</CardTitle>
                          <CardContent className="p-0">
                            <p className="flex items-center text-sm mb-1">
                              <MapPin className="mr-2 h-4 w-4" /> {item.address}
                            </p>
                            <p className="flex items-center text-sm mb-1">
                              <CalendarIcon className="mr-2 h-4 w-4" /> {item.startDate} - {item.endDate}
                            </p>
                            <p className="flex items-center text-sm mb-1">
                              <User className="mr-2 h-4 w-4" /> 
                              {item.postUserId === user?.friend_id ? 
                                user.username : 
                                item.postUserId === followId ?
                                  followUsername : 
                                  ""
                              }
                            </p>
                            <p className="flex items-center text-sm">
                              <Clock className="mr-2 h-4 w-4" /> 
                              {item.postDatetime ?
                                item.postDatetime.toLocaleString().replace("T"," ").replace(".", "").slice(0, -3) :
                                ""
                              }
                            </p>
                          </CardContent>
                        </div>
                        {
                          item.postUserId === user?.friend_id ?
                          <CardFooter className="p-0 border absolute bottom-6 right-8 hover:bg-blue-300">
                            <Button variant="destructive" onClick={() => dialogOpen(item.id, item.imagePath)}>訪問済み</Button>
                          </CardFooter>
                          :
                          <></>
                        }
                      </div>
                    </div>
                  </Card>
                ))
              }
            </div>
          </TabsContent>
          <TabsContent value="map">
            <div className="h-[calc(100vh-20rem)] bg-muted flex items-center justify-center">
              <p className="text-lg font-semibold">ここにGoogleマップが表示されます</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
      </Dialog>

      <Dialog open={isFriendDialogOpen} onOpenChange={setIsFriendDialogOpen}>
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
      </Dialog>

      <Dialog open={isUsernameDialogOpen} onOpenChange={setIsUsernameDialogOpen}>
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
      </Dialog>
    </div>
  )
}