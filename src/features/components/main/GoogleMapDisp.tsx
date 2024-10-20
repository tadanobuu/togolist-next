import { useEffect, useRef } from "react";
import { Database } from "@/types/supabase";

type TogoType = Database['public']['Tables']['togo']['Row'];
type ChildComponentProps = {
    displayList: TogoType[],
};

const GoogleMapDisp = ({ displayList }: ChildComponentProps) => {

    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const googleMapKey: string = process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY!;

        const loadGoogleMapsScript = (callback: () => void) => {
            if (typeof window.google === 'undefined') {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapKey}`;
                script.async = true;
                script.onload = () => callback();
                document.head.appendChild(script);
            } else {
                callback();
            }
            };
        
            // Google Maps を初期化する関数
            const initMap = () => {
            if (!mapRef.current) return;
        
            // マップのオプション
            let latNum = 35.6895;
            let lngNum = 139.6917;
            [...displayList].reverse().forEach((item) => {
                if( item.lat && item.lng ){
                    latNum = item.lat
                    lngNum = item.lng
                    return
                }
            })
            const mapOptions = {
                center: { lat: latNum, lng: lngNum },
                zoom: 10,
            };
        
            // マップを描画
            const map = new window.google.maps.Map(mapRef.current, mapOptions);
        
            // displayList内のlat, lngがnull以外の項目にマーカーを追加
            displayList.forEach((item) => {
                if ( item.lat && item.lng ) {
                    new window.google.maps.Marker({
                        position: { lat: item.lat, lng: item.lng },
                        map: map,
                    });
                }
            });
        };
    
        loadGoogleMapsScript(initMap);
    }, [displayList]);

    return (
        <div className="h-[calc(100vh-20rem)] bg-muted flex items-center justify-center">
            <div className="w-full h-96 rounded-lg shadow-md" ref={mapRef}></div>
        </div>
    )
}

export default GoogleMapDisp