import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../AuthContext";

import { FaLock, FaLocationDot, FaLink } from "react-icons/fa6";

import Loading from "../../components/Loading/Loading";
import PostsJar from "../../components/PostsJar/PostsJar";


export default function UserIndividual() {
    const { loading: authLoading, loggedIn, userDetails: authUser } = useContext(AuthContext);
    const myUsername = authUser?.username;

    const navigate = useNavigate();

    const { userId } = useParams();

    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingLikes, setLoadingLikes] = useState(true);

    const loading = loadingUser || loadingLikes;

    const [userDetails, setUserDetails] = useState(null);

    const [userLikes, setUserLikes] = useState(null);

    const [activeTab, setActiveTab] = useState("posts");


    useEffect(() => {
        if (!authLoading && !loggedIn) {
            navigate("/");
        }
    }, [authLoading, loggedIn, navigate]);

    useEffect(() => {
        if (authLoading) return;

        const fetchUser = async () => {
            setLoadingUser(true);

            const storedToken = localStorage.getItem("token");

            if (storedToken) {
                const response = await fetch(`https://social-media-site-api.onrender.com/users/${userId}/posts`, {
                    method: "get",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    }
                });

                if (response.status !== 200 && response.status !== 206) {
                    setLoadingUser(false);
                    return alert("Error");
                }

                setLoadingUser(false);
                const data = await response.json();

                setUserDetails(data);
            }
        };

        fetchUser();
        
    }, [authLoading, userId]);

    useEffect(() => {
        if (authLoading) return;

        const fetchLikes = async () => {
            setLoadingLikes(true);

            const storedToken = localStorage.getItem("token");

            if (storedToken) {
                const response = await fetch(`https://social-media-site-api.onrender.com/users/${userId}/likes`, {
                    method: "get",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    }
                });

                if (response.status !== 200 && response.status !== 206) {
                    setLoadingLikes(false);
                    return alert("Error");
                }

                setLoadingLikes(false);
                const data = await response.json();

                setUserLikes(data.likes);
            }
        };

        fetchLikes();
        
    }, [authLoading, userId]);

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
                const data = response.json();
                if (data.error) {
                    alert(data.error);
                } else {
                    alert("Error: " + (data.error || "Unknown error"));
                }
                return;
            }

            setLoading(false);
        }
    }

    const handleBlock = async (event) => {
        event.preventDefault();

        setLoading(true);

        const storedToken = localStorage.getItem("token");

        if (myUsername === userId) return;

        if (storedToken) {
            const response = await fetch(`https://social-media-site-api.onrender.com/users/${userId}/block`, {
                method: "put",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                }
            });

            if (response.status !== 201) {
                setLoading(false);
                const data = response.json();
                if (data.error) {
                    alert(data.error);
                } else {
                    alert("Error: " + (data.error || "Unknown error"));
                }
                return;
            }

            setLoading(false);
            window.location.reload();
        }
    }

    return (
        <>
            {loading ? (
                <Loading />
            ) : userDetails ? (
                <div>
                    <div className="flex flex-col">
                        <div>
                            <img className="w-25  h-25 rounded-full object-cover shrink-0" src={userDetails.profilePic} alt="" />
                        </div>

                        <div className="flex items-center gap-2 text-3xl font-semibold">
                            <div className="flex gap-1">
                                <div>{userDetails.username}</div>
                                {userDetails.isPrivate && (
                                    <FaLock />
                                )}
                            </div>
                            
                            {myUsername !== userDetails.username && userDetails.haveBeenBlocked !== true &&
                                <div className="flex gap-1">
                                    <button className="pt-1 pb-1 pr-3 pl-3 text-xl rounded-2xl bg-teal-700 hover:bg-teal-500 hover:cursor-pointer" onClick={(event) => sendFollowRequest(event, userDetails.id)}>
                                        {!userDetails.isFollowing && !userDetails.isPending && (
                                            <div>Follow</div>
                                        )}

                                        {!userDetails.isFollowing && userDetails.isPending && (
                                            <div>Pending</div>
                                        )}
                                        
                                        {userDetails.isFollowing && (
                                            <div>Following</div>
                                        )}
                                    </button>

                                    <button className="pt-1 pb-1 pr-3 pl-3 text-xl rounded-2xl bg-red-700 hover:bg-red-500 hover:cursor-pointer" onClick={(event) => handleBlock(event)}>
                                        {!userDetails.isBlocked && (
                                            <div>Block</div>
                                        )}

                                        {userDetails.isBlocked && (
                                            <div>Unblock</div>
                                        )}
                                    </button>
                                </div>
                            }
                        </div>

                        <div className="">{userDetails.bio}</div>

                        <div className="flex items-center gap-3">
                            {userDetails.location && 
                            <div className="flex items-center gap-0.5">
                                <FaLocationDot />
                                <div>{userDetails.location}</div>
                            </div>}
                            {userDetails.website && 
                            <div className="flex items-center gap-0.5">
                                <FaLink />
                                <a  className="text-teal-500 hover:underline" href={`https://${userDetails.website}`} target="_blank" rel="noopener noreferrer">{userDetails.website}</a>
                            </div>}
                        </div>

                        <div className="flex w-full text-xl items-center justify-evenly">
                            <div className={`text-center w-fit px-1 hover:cursor-pointer ${activeTab === 'posts' ? 'font-bold border-b-4 border-teal-700' : ''}`} onClick={() => setActiveTab("posts")}>Posts</div>
                            <div className={`text-center w-fit px-1 hover:cursor-pointer ${activeTab === 'likes' ? 'font-bold border-b-4 border-teal-700' : ''}`} onClick={() => setActiveTab("likes")}>Likes</div>
                        </div>
                        
                        {userDetails.isBlocked &&
                            <div>This user is blocked. To view their posts, unblock them.</div>
                        }

                        {!userDetails.isBlocked &&
                            <PostsJar postsList={activeTab === "posts" ? userDetails.combinedPosts : userLikes} loading={loading}/>
                        }

                        {userDetails.haveBeenBlocked === true &&
                            <div>You cannot view this user's posts.</div>
                        }
                    </div>
                </div>
            ) : (
                <div>User not found</div>
            )}
        </>
    );
}