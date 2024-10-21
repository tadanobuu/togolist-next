import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type formDataType = {
    placeName: string,
    address: string,
    startDate: string | null | undefined,
    endDate: string | null | undefined,
    imagePreview: string | null,
    file: File | null,
}
type ChildComponentProps = {
    formData: formDataType
    setFormData: React.Dispatch<React.SetStateAction<formDataType>>;
};

const PlaceName = ({ formData, setFormData }: ChildComponentProps) => {

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    return (
        <div>
            <Label htmlFor="placeName">地名（店舗名など）<text className="text-xs text-red-500 ml-2">※必須</text></Label>
            <Input id="placeName" name="placeName" value={formData.placeName} onChange={handleInputChange} required />
        </div>
    )
}

export default PlaceName