import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../AuthContext";

import { FaLock } from "react-icons/fa6";

import Loading from "../../components/Loading/Loading";

export default function Users() {
    const { loading: authLoading, loggedIn, userDetails } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [usersList, setUsersList] = useState([]);

    const [incomingList, setIncomingList] = useState([]);

    const [activeTab, setActiveTab] = useState("users");

    useEffect(() => {
        if (!authLoading && !loggedIn) {
            navigate("/");
        }
    },[authLoading, loggedIn, navigate]);

    const usersUrl = "https://social-media-site-api.onrender.com/users/all"
    const incomingUrl = "https://social-media-site-api.onrender.com/follow/incoming"

    useEffect(() => {
        if (authLoading) return;

        const fetchUsersList = async () => {
            setLoading(true);

            const storedToken = localStorage.getItem("token");

            if (storedToken) {
                const response = await fetch(usersUrl, {
                    method: "get",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    }
                });

                if (response.status !== 200) {
                    setLoading(false);
                    return alert("Error");
                }

                setLoading(false);
                const data = await response.json();

                setUsersList(data);
            }
        };

        fetchUsersList();
        
    }, [authLoading]);

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

    const sendFollowRequest = async (event, recipientId) => {
        event.preventDefault();

        setLoading(true);

        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            const response = await fetch(`https://social-media-site-api.onrender.com/follow/${recipientId}/new`, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                }
            });

            if (response.status !== 201) {
                setLoading(false);
                if (data.error) {
                    alert(data.error);
                } else {
                    alert("Error: " + (data.error || "Unknown error"));
                }
                return;
            }

            setLoading(false);
        }

        window.location.reload();
    }

    const acceptIncoming = async (event, senderId) => {
        event.preventDefault();

        setLoading(true);

        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            const response = await fetch(`https://social-media-site-api.onrender.com/follow/${senderId}/accept`, {
                method: "put",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                }
            });

            if (response.status !== 201) {
                setLoading(false);
                if (data.error) {
                    alert(data.error);
                } else {
                    alert("Error: " + (data.error || "Unknown error"));
                }
                return;
            }

            setLoading(false);
        }

        window.location.reload();
    }

    const denyIncoming = async (event, senderId) => {
        event.preventDefault();

        setLoading(true);

        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            const response = await fetch(`https://social-media-site-api.onrender.com/follow/${senderId}/deny`, {
                method: "put",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                }
            });

            if (response.status !== 201) {
                setLoading(false);
                if (data.error) {
                    alert(data.error);
                } else {
                    alert("Error: " + (data.error || "Unknown error"));
                }
                return;
            }

            setLoading(false);
        }

        window.location.reload();
    }

    return (
        <>
            {authLoading ? (
                <Loading />
            ) : (
                <div>
                    <div className="flex flex-col w-full">
                        <div className="flex w-full text-xl items-center justify-evenly">
                            <div className={`w-fit px-1 text-center hover:cursor-pointer ${activeTab === 'users' ? 'font-bold border-b-4 border-teal-700' : ''}`} onClick={() => setActiveTab("users")}>Users</div>
                            <div className={`flex w-fit px-1 text-center hover:cursor-pointer ${activeTab === 'incoming' ? 'font-bold border-b-4 border-teal-700' : ''}`} onClick={() => setActiveTab("incoming")}>
                                <div>Incoming</div>
                                {incomingList.length > 0 && <div className="w-3 h-3 bg-teal-700 rounded-full"></div>}
                            </div>
                        </div>

                        {activeTab === "users" && usersList.map((user) => (
                            <div key={user.id} className="flex gap-2 p-2 hover:bg-neutral-700">
                                <div className="shrink-0">
                                    <a href={`/u/${user.username}`}><img className="w-15 h-15 rounded-full object-cover shrink-0" src={user.profilePic} alt="" /></a>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex justify-between w-full">
                                        <div className="flex items-center gap-1 text-xl font-medium hover:underline">
                                            <a href={`/u/${user.username}`}>{user.username}</a>
                                            {user.isPrivate && (
                                                <FaLock />
                                            )}
                                        </div>
                                        <button className="pt-1 pb-1 pr-3 pl-3 rounded-2xl bg-teal-700 hover:bg-teal-500 hover:cursor-pointer" onClick={(event) => sendFollowRequest(event, user.id)}>
                                            {!user.isFollowing && !user.isPending && (
                                                <div>Follow</div>
                                            )}

                                            {!user.isFollowing && user.isPending && (
                                                <div>Pending</div>
                                            )}
                                            
                                            {user.isFollowing && (
                                                <div>Following</div>
                                            )}
                                        </button>
                                    </div>

                                    <div>{user.bio}</div>
                                </div>
                            </div>
                        ))}

                        {activeTab === "incoming" && incomingList.map((user) => (
                            <div key={user.id} className="flex gap-2 p-2 hover:bg-neutral-700">
                                <div className="shrink-0">
                                    <a href={`/u/${user.username}`}><img className="w-15 h-15 rounded-full object-cover shrink-0" src={user.profilePic} alt="" /></a>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex justify-between w-full">
                                        <div className="flex items-center gap-1 text-xl hover:underline">
                                            <a href={`/u/${user.username}`}>{user.username}</a>
                                            {user.isPrivate && (
                                                <FaLock />
                                            )}
                                        </div>
                                        
                                        <div className="flex gap-1">
                                            <button className="pt-1 pb-1 pr-3 pl-3 rounded-2xl bg-teal-700 hover:bg-teal-500 hover:cursor-pointer" onClick={(event) => acceptIncoming(event, user.id)}>
                                                Accept
                                            </button>
                                            <button className="pt-1 pb-1 pr-3 pl-3 rounded-2xl bg-red-700 hover:bg-red-500 hover:cursor-pointer" onClick={(event) => denyIncoming(event, user.id)}>
                                                Reject
                                            </button>
                                        </div>
                                    </div>

                                    <div>{user.bio}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}