import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { prefectures } from "@/lib/prefectures";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarIcon } from "lucide-react"
import { Database } from "@/types/supabase";

type userType = Database['public']['Tables']['users']['Row'];
type TogoType = Database['public']['Tables']['togo']['Row'];
type ChildComponentProps = {
    user: userType | null,
    followId: string,
    followUsername: string | null,
    setDisplayList: React.Dispatch<React.SetStateAction<TogoType[]>>,
    togos: TogoType[],
};

const FilterItems = ({ user, followId, followUsername, setDisplayList, togos }: ChildComponentProps) => {

    const [ inputText , setInputText ] = useState<string>("");
    const [ searchText , setSearchText ] = useState<string>("");
    const [ searchUser , setSearchUser ] = useState<string | null>(null);
    const [ searchPregecture , setSearchPregecture ] = useState<string | null>(null);
    const [ searchStartDate , setSearchStartDate ] = useState<Date | undefined>(undefined);
    const [ searchEndDate , setSearchEndDate ] = useState<Date | undefined>(undefined);

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
    
    let displayList = togos;
    if(searchText) displayList = displayList.filter(item => item.palceName.indexOf(searchText) !== -1);
    if(searchUser && searchUser !== "ALL") displayList = displayList.filter(item => item.postUserId === searchUser)
    if(searchPregecture && searchPregecture !== "ALL") displayList = displayList.filter(item => item.prefecture === searchPregecture )
    if(searchStartDate && searchEndDate){
        displayList = displayList.filter(item => {
        return(
            (!item.startDate || new Date(item.startDate + "T00:00:00") <= searchEndDate) &&
            (!item.endDate || new Date(item.endDate + "T00:00:00") >= searchStartDate)
        )})
    };
    setDisplayList(displayList)

    return (
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
    )
}

export default FilterItems