import { Textarea } from "@/components/ui/textarea"
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

const Addressform = ({ formData, setFormData }: ChildComponentProps) => {

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div>
            <Label htmlFor="address">住所</Label>
            <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} required />
        </div>
    )
}

export default Addressform