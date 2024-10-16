'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Undo2 } from "lucide-react"
import Header from '@/app/features/components/Header'
import { supabase } from '@/lib/supabase/supabaseClient'
import { Database } from "@/types/supabase";
import { normalize } from '@geolonia/normalize-japanese-addresses'
import { addImage, addTogo, getUser } from '@/lib/supabase/supabaseFunctions'
import { useRouter } from 'next/navigation'
import Footer from '@/app/features/components/Footer'
import Link from "next/link";
import Preview from '@/app/features/components/newPost/Preview'
import BackgroundImage from '@/app/features/components/newPost/BackgroundImage'
import Dateform from '@/app/features/components/newPost/Dateform'
import Addressform from '@/app/features/components/newPost/Addressform'
import PlaceName from '@/app/features/components/newPost/PlaceName'

type Togo = Database['public']['Tables']['togo']["Insert"];
type userType = Database['public']['Tables']['users']['Row'];
type formDataType = {
    placeName: string,
    address: string,
    startDate: string | null | undefined,
    endDate: string | null | undefined,
    imagePreview: string | null,
    file: File | null,
}

export default function NewPostForm() {
    const [formData, setFormData] = useState<formDataType>({
        placeName: '',
        address: '',
        startDate: null,
        endDate: null,
        imagePreview: null,
        file: null,
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
                const { userData } = await getUser(session?.session?.user.id)
                if (userData) {
                    setUser(userData[0]);
                    return userData[0];
                }
            };
        }
        checkUser()
    }, [router])

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        if(isSending) return
        event.preventDefault()
        setIsSending(true);
        const { filePath, imageUrl } = await addImage(formData.file, user)
        const result = await normalize(formData.address);
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
                <div className="mb-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold mb-6">新規投稿</h1>
                    <div className="w-auto justify-around">
                        <Button className="bg-black text-white rounded-xl">
                            <Undo2 className="w-4 h-4 mr-2" />
                            <Link href={"/main"}>
                                メイン画面に戻る
                            </Link>
                        </Button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <PlaceName formData={formData} setFormData={setFormData} />
                    <Addressform formData={formData} setFormData={setFormData} />
                    <Dateform formData={formData} setFormData={setFormData} />
                    <BackgroundImage setFormData={setFormData}/>
                    <Preview formData={formData} user={user} />
                    <Button type="submit" className="w-full hover:bg-black hover:text-white">{isSending ? "投稿中..." : "投稿する"}</Button>
                </form>
            </div>

            <Footer />
        </>
    )
}