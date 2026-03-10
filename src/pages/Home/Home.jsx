import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../AuthContext";

import Login from "../Login/Login";
import Compose from "../../components/Compose/Compose";
import PostsJar from "../../components/PostsJar/PostsJar";

import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";

export default function Home() {
    const { loading: authLoading, loggedIn, userDetails, logout } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const [followingPosts, setFollowingPosts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !loggedIn) {
            navigate("/");
        }
    },[authLoading, loggedIn, navigate]);

    useEffect(() => {
        if (authLoading) return;

        const fetchFollowingPosts = async () => {
            setLoading(true);

            const storedToken = localStorage.getItem("token");

            if (storedToken) {
                const response = await fetch(`https://social-media-site-api.onrender.com/posts/following`, {
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

                setFollowingPosts(data);
            }
        };

        fetchFollowingPosts();
        
    }, [authLoading, loggedIn]);

    return (
        <>
            {authLoading ? (
                <Loading />
            ) : loggedIn ? (
                <div>
                    <Compose />
                    {followingPosts.combinedPosts &&
                        <PostsJar postsList={followingPosts.combinedPosts} loading={loading}/>
                    }
                </div>
            ) : (
                <Login></Login>
            )}
        </>
    );
}