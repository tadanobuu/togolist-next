'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MapPin, Clock, User, PlusCircle } from "lucide-react"
import Image from "next/image";
import Link from "next/link";
import { getAllTogos } from "@/lib/supabase/supabaseFunctions";
import { Database } from "@/types/supabase";
import Header from "@/app/features/components/Header";

type Togo = Database['public']['Tables']['togo']['Row'];

export default function TOGOListMain() {

  const [ togos , setTogos ] = useState<Togo[]>([]);
  const [ isLoading , setIsLoading ] = useState<boolean>(false);
  const [ inputText , setInputText ] = useState<string>("");
  const [ searchText , setSearchText ] = useState<string>("");
  const [ searchUser , setSearchUser ] = useState<string | null>(null);
  const [ searchPregecture , setSearchPregecture ] = useState<string | null>(null);
  const [ searchStartDate , setSearchStartDate ] = useState<Date | undefined>(undefined);
  const [ searchEndDate , setSearchEndDate ] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchTogos = async() => {
      try{
        setIsLoading(true)
        const data = await getAllTogos();
        setTogos(data)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    fetchTogos();
  },[])

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
      <header className="bg-primary text-primary-foreground p-4">
        <Header />
      </header>

      <main className="flex-grow container mx-auto p-4">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">リスト一覧</h2>
          <Button className="bg-black text-white rounded-xl">
            <PlusCircle className="w-4 h-4 mr-2" />
            <Link href={"/newPost"}>
              新規投稿
            </Link>
          </Button>
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
              <SelectContent>
                <SelectItem value="ALL">全ての投稿者</SelectItem>
                <SelectItem value="user1">ユーザー1</SelectItem>
                <SelectItem value="user2">ユーザー2</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value: string) => setSearchPregecture(value)}>
              <SelectTrigger>
                <SelectValue placeholder="都道府県" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全ての都道府県</SelectItem>
                <SelectItem value="tokyo">東京都</SelectItem>
                <SelectItem value="osaka">大阪府</SelectItem>
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
                  <Card key={item.id} className="overflow-hidden">
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
                              <User className="mr-2 h-4 w-4" /> ユーザー{item.postUserId}
                            </p>
                            <p className="flex items-center text-sm">
                              <Clock className="mr-2 h-4 w-4" /> 
                              {item.postDatetime ? item.postDatetime.toLocaleString().replace("T"," ") : ""}
                            </p>
                          </CardContent>
                        </div>
                        <CardFooter className="p-0 border absolute bottom-6 right-8 hover:bg-blue-300">
                          <Button variant="destructive">訪問済み</Button>
                        </CardFooter>
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

      <footer className="bg-muted text-muted-foreground p-4 text-center">
        <p>&copy; 2023 TOGOリスト. All rights reserved.</p>
      </footer>
    </div>
  )
}