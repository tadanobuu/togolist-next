import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Database } from "@/types/supabase";
import { CalendarIcon, MapPin, Clock, User } from "lucide-react"
import Image from "next/image";

type userType = Database['public']['Tables']['users']['Row'];
type TogoType = Database['public']['Tables']['togo']['Row'];
type ChildComponentProps = {
    isLoading: boolean,
    displayList: TogoType[],
    user: userType | null,
    followId: string,
    followUsername: string | null,
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedItemId: React.Dispatch<React.SetStateAction<number | null>>;
    setSelectedItemImagePath: React.Dispatch<React.SetStateAction<string | null>>;
};

const ListDisp = ({ 
        isLoading, 
        displayList, 
        user, 
        followId, 
        followUsername, 
        setIsDialogOpen, 
        setSelectedItemId, 
        setSelectedItemImagePath, 
    }: ChildComponentProps) => {

    const dialogOpen = (id: number, imagePath: string | null) => {
        setSelectedItemId(id)
        setSelectedItemImagePath(imagePath)
        setIsDialogOpen(true)
    }

    return (
        <div className="gap-y-4 grid lg:grid-cols-2 lg:gap-x-4">
        { isLoading ? <h3 className="font-bold">loading...</h3> :
            displayList.map((item: TogoType) => {
                let dateTime = item.postDatetime ? item.postDatetime.toLocaleString().replace("T"," ").replace(".", "").slice(0, -3) : "";
                if(dateTime.length === 18){
                    dateTime += "0";
                }
                return (
                    <Card key={item.id} className="overflow-hidden rounded-2xl">
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
                                <User className="mr-2 h-4 w-4" /> 
                                {item.postUserId === user?.friend_id ? 
                                user.username : 
                                item.postUserId === followId ?
                                    followUsername : 
                                    ""
                                }
                            </p>
                            <p className="flex items-center text-sm">
                                <Clock className="mr-2 h-4 w-4" /> 
                                {dateTime}
                            </p>
                            </CardContent>
                        </div>
                        {
                            item.postUserId === user?.friend_id ?
                            <CardFooter className="p-0 border absolute bottom-6 right-8 hover:bg-blue-300">
                            <Button variant="destructive" onClick={() => dialogOpen(item.id, item.imagePath)}>訪問済み</Button>
                            </CardFooter>
                            :
                            <></>
                        }
                        </div>
                    </div>
                    </Card>
            )})
        }
        </div>
    )
}

export default ListDisp