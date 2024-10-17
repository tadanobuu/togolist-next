import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

type formDataType = {
    placeName: string,
    address: string,
    startDate: string | null | undefined,
    endDate: string | null | undefined,
    imagePreview: string | null,
    file: File | null,
}
type ChildComponentProps = {
    setFormData: React.Dispatch<React.SetStateAction<formDataType>>;
};

const BackgroundImage = ({setFormData}: ChildComponentProps) => {

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

    return (
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
    )
}

export default BackgroundImage