'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { CalendarIcon, Upload, MapPin, User, Clock } from "lucide-react"
import Image from 'next/image'
import Header from '@/app/features/components/Header'
import { supabase } from '@/lib/supabase/supabaseClient'
import { Database } from "@/types/supabase";
import { normalize } from '@geolonia/normalize-japanese-addresses'
import { addTogo } from '@/lib/supabase/supabaseFunctions'
import { useRouter } from 'next/navigation'
import Footer from '@/app/features/components/Footer'

type Togo = Database['public']['Tables']['togo']["Insert"];
type userType = Database['public']['Tables']['users']['Row'];

export default function NewPostForm() {
    const [formData, setFormData] = useState({
        placeName: '',
        address: '',
        startDate: null as string | null | undefined,
        endDate: null as string | null | undefined,
        imagePreview: null as string | null,
        file: null as File | null,
    })
    const [isSending, setIsSending] = useState<boolean>(false)
    const [ user, setUser ] = useState<userType | null>(null)

    const router = useRouter()

    useEffect(() => {
        const checkUser = async () => {
            const { data: session } = await supabase.auth.getSession();

            if (!session?.session?.user) {
                router.push('/login');
            } else {
                const { data: userData, error } = await supabase
                    .from('users')
                    .select('*') 
                    .eq('id', session?.session?.user.id);  

            if (error) {
                console.error('Error fetching user data:', error);
            } else {
                setUser(userData[0]);
                return userData[0];
            }
            }
        };

        checkUser()
    }, [router])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, imagePreview: reader.result as string , file }))
        }
        reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        if(isSending) return

        event.preventDefault()
        setIsSending(true);

        let imageUrl: null|string = null
        let filePath: null|string = null
        if(formData.file){
            filePath = `${user?.friend_id}/${formData.file.name}`
            const { error } = await supabase.storage.from('togo_image_bucket').upload(filePath, formData.file)

            if(error){
                console.log("Error imageUpload");
            }else{
                const { data } = supabase.storage.from('togo_image_bucket').getPublicUrl(filePath)
                imageUrl = data.publicUrl
            }
        }

        const result = await normalize(formData.address).then(result => result);

        const newTogo: Togo = {
            palceName: formData.placeName,
            address: formData.address,
            prefecture: result.pref,
            lat: result.level ? result.point.lat : null,
            lng: result.level ? result.point.lng : null,
            startDate: formData.startDate ? formData.startDate : null,
            endDate: formData.endDate ? formData.endDate : null,
            imageUrl: imageUrl,
            postDatetime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
            postUserId: user?.friend_id,
            imagePath: filePath
        }

        await addTogo(newTogo)
        router.push('/main')
    }

    return (
        <>
            <header className="bg-primary text-primary-foreground p-4">
                <Header user={user} />
            </header>
            <div className="container mx-auto p-4 max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">新規投稿</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                    <Label htmlFor="placeName">地名（店舗名など）</Label>
                    <Input id="placeName" name="placeName" value={formData.placeName} onChange={handleInputChange} required />
                    </div>
                    
                    <div>
                    <Label htmlFor="address">住所</Label>
                    <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label>開始日</Label>
                        <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!formData.startDate && "text-muted-foreground"}`}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.startDate ? formData.startDate : <span>開始日を選択</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            mode="single"
                            className='bg-neutral-50'
                            onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date?.toLocaleDateString('sv-SE') }))}
                            initialFocus
                            />
                        </PopoverContent>
                        </Popover>
                    </div>
                    
                    <div>
                        <Label>終了日</Label>
                        <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!formData.endDate && "text-muted-foreground"}`}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.endDate ? formData.endDate : <span>終了日を選択</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            mode="single"
                            className='bg-neutral-50'
                            onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date?.toLocaleDateString('sv-SE') }))}
                            initialFocus
                            />
                        </PopoverContent>
                        </Popover>
                    </div>
                    </div>
                    
                    <div>
                    <Label htmlFor="image">背景画像</Label>
                    <div className="mt-1 flex items-center">
                        <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        />
                        <Label
                        htmlFor="image"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                        <Upload className="h-5 w-5 mr-2" />
                        画像をアップロード
                        </Label>
                    </div>
                    </div>

                    {/* プレビューカード */}
                    <Card className="overflow-hidden">
                    <Label htmlFor="preview" className='flex justify-center py-2'>プレビュー</Label>
                    <div className="relative h-64">
                        {formData.imagePreview ? (
                        <Image
                            src={formData.imagePreview}
                            alt="プレビュー"
                            fill={true}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        ) : (
                        <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">画像がアップロードされていません</span>
                        </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                        <div className="relative h-full p-4 flex flex-col justify-between text-white">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{formData.placeName || "地名を入力してください"}</h2>
                            <CardContent className="p-0">
                            <p className="flex items-center text-sm mb-1">
                                <MapPin className="mr-2 h-4 w-4" /> {formData.address || "住所を入力してください"}
                            </p>
                            <p className="flex items-center text-sm mb-1">
                                <CalendarIcon className="mr-2 h-4 w-4" /> 
                                {formData.startDate ? format(formData.startDate, "yyyy年MM月dd日") : ""} - {formData.endDate ? format(formData.endDate, "yyyy年MM月dd日") : ""}
                            </p>
                            <p className="flex items-center text-sm mb-1">
                                <User className="mr-2 h-4 w-4" /> {user?.username}
                            </p>
                            <p className="flex items-center text-sm">
                                <Clock className="mr-2 h-4 w-4" /> {format(new Date(), "yyyy年MM月dd日 HH:mm")}
                            </p>
                            </CardContent>
                        </div>
                        </div>
                    </div>
                    </Card>
                    
                    <Button type="submit" className="w-full hover:bg-black hover:text-white">{isSending ? "投稿中..." : "投稿する"}</Button>
                </form>
            </div>

            <Footer />
        </>
    )
}