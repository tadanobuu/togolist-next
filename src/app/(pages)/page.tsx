'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MapPin, Clock, User, PlusCircle, LogOut } from "lucide-react"
import Image from "next/image";
import Link from "next/link";

export default function TOGOListMain() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center bg-black text-white p-5">
          <h1 className="text-2xl font-bold mb-2 sm:mb-0">TOGOリスト</h1>
          <div className="flex items-center space-x-4">
            <span>ユーザー名</span>
            <Button variant="secondary" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </Button>
          </div>
        </div>
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
            <Input type="text" placeholder="地名で検索" className="flex-grow" />
            <Button className="bg-black text-white rounded-xl">検索</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="投稿者" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全ての投稿者</SelectItem>
                <SelectItem value="user1">ユーザー1</SelectItem>
                <SelectItem value="user2">ユーザー2</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="都道府県" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全ての都道府県</SelectItem>
                <SelectItem value="tokyo">東京都</SelectItem>
                <SelectItem value="osaka">大阪府</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>開始日</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" initialFocus />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>終了日</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" initialFocus />
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
              {[
                { id: 1, name: "東京タワー", image: "/placeholder.svg?height=300&width=400" },
                { id: 2, name: "スカイツリー", image: "/placeholder.svg?height=300&width=400" },
                { id: 3, name: "渋谷スクランブル交差点", image: "/placeholder.svg?height=300&width=400" }
              ].map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative h-64">
                    <Image
                      src={item.image}
                      alt=""
                      fill={true}
                      className="absolute inset-0 w-full h-full object-cover"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    <div className="relative h-full p-6 flex flex-col justify-between text-white">
                      <div>
                        <CardTitle className="text-2xl mb-2">{item.name}</CardTitle>
                        <CardContent className="p-0">
                          <p className="flex items-center text-sm mb-1">
                            <MapPin className="mr-2 h-4 w-4" /> 東京都〇〇区××町1-2-3
                          </p>
                          <p className="flex items-center text-sm mb-1">
                            <CalendarIcon className="mr-2 h-4 w-4" /> 2023年7月1日 - 2023年7月31日
                          </p>
                          <p className="flex items-center text-sm mb-1">
                            <User className="mr-2 h-4 w-4" /> ユーザー{item.id}
                          </p>
                          <p className="flex items-center text-sm">
                            <Clock className="mr-2 h-4 w-4" /> 2023年6月15日 12:00
                          </p>
                        </CardContent>
                      </div>
                      <CardFooter className="p-0 border absolute bottom-6 right-8 hover:bg-blue-300">
                        <Button variant="destructive">訪問済み</Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
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