import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../AuthContext";

import { FaHouseChimney, FaUsers, FaHeart, FaUserTie, FaGears } from "react-icons/fa6";


export default function Sidebar() {

    const { loading: authLoading, userDetails } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [incomingList, setIncomingList] = useState([]);

    const incomingUrl = "https://social-media-site-api.onrender.com/follow/incoming"

    useEffect(() => {
            if (authLoading) return;
    
            const fetchIncomingList = async () => {
                setLoading(true);
    
                const storedToken = localStorage.getItem("token");
    
                if (storedToken) {
                    const response = await fetch(incomingUrl, {
                        method: "get",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${storedToken}`
                        }
                    });
    
                    if (response.status !== 201) {
                        setLoading(false);
                        return alert("Error");
                    }
    
                    setLoading(false);
                    const data = await response.json();
    
                    setIncomingList(data);
                }
            };
    
            fetchIncomingList();
            
        }, [authLoading]);
    

    return (
        <div className="h-full w-fit flex flex-col">
            <a href="/">
                <div className="flex items-center gap-1.5 text-2xl p-3 rounded-3xl hover:bg-neutral-700">
                    <FaHouseChimney className="w-6 shrink-0" />
                    <div>Home</div>
                </div>
            </a>

            <a href="/users">
                <div className="flex items-center gap-1.5 text-2xl p-3 rounded-3xl hover:bg-neutral-700">
                    <FaUsers className="w-6 shrink-0" />
                    <div>Users</div>
                    {incomingList.length > 0 && <div className="w-3 h-3 bg-teal-700 rounded-full"></div>}
                </div>
            </a>

            <a href={`/u/${userDetails.username}`}>
                <div className="flex items-center gap-1.5 text-2xl p-3 rounded-3xl hover:bg-neutral-700">
                    <FaUserTie className="w-6 shrink-0" />
                    <div>Profile</div>
                </div>
            </a>

            <a href="/settings">
                <div className="flex items-center gap-1.5 text-2xl p-3 rounded-3xl hover:bg-neutral-700">
                    <FaGears className="w-6 shrink-0" />
                    <div>Settings</div>
                </div>
            </a>
        </div>            
    )
}