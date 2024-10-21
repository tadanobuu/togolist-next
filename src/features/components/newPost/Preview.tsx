import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import Image from 'next/image'
import { MapPin, User, Clock, CalendarIcon, } from "lucide-react"
import { Label } from "@radix-ui/react-label"
import { Database } from "@/types/supabase"

type props = {
    user: Database['public']['Tables']['users']['Row'] | null;
    formData: {
        placeName: string,
        address: string,
        startDate: string | null | undefined,
        endDate: string | null | undefined,
        imagePreview: string | null,
        file: File | null,
    }
}

const Preview = ({formData, user}: props) => {
    return (
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
                        <Clock className="mr-2 h-4 w-4" /> 2024年01月01日 10:00:00
                    </p>
                    </CardContent>
                </div>
                </div>
            </div>
        </Card>
    )
}

export default Preview