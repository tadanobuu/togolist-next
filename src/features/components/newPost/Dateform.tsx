import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@radix-ui/react-label"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

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

const Dateform = ({ formData, setFormData }: ChildComponentProps) => {
    return (
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
    )
}

export default Dateform