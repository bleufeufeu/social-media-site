import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../AuthContext";

import { FaLock, FaLocationDot, FaLink } from "react-icons/fa6";

import Sidebar from "../../components/Sidebar/Sidebar";
import PostsJar from "../../components/PostsJar/PostsJar";


export default function Hashtag() {
    const { loading: authLoading, loggedIn, userDetails: authUser } = useContext(AuthContext);
    const myUsername = authUser?.username;

    const navigate = useNavigate();

    const { hashtagName } = useParams();

    const [loading, setLoading] = useState(false);

    const [hashtagPosts, setHashtagPosts] = useState([]);

    useEffect(() => {
        if (!authLoading && !loggedIn) {
            navigate("/");
        }
    }, [authLoading, loggedIn, navigate]);

    useEffect(() => {
        if (authLoading) return;

        const fetchPosts = async () => {
            setLoading(true);

            const storedToken = localStorage.getItem("token");

            if (storedToken) {
                const response = await fetch(`http://localhost:3000/posts/hashtag/${hashtagName}`, {
                    method: "get",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    }
                });

                if (response.status !== 200 && response.status !== 206) {
                    setLoading(false);
                    return alert("Error");
                }

                setLoading(false);
                const data = await response.json();

                setHashtagPosts(data);
            }
        };

        fetchPosts();
        
    }, [authLoading, hashtagName]);

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <Sidebar />
                    {hashtagPosts &&
                        <>
                            <div>#{hashtagName}</div>
                            <div>{hashtagPosts.length} posts</div>
                            <PostsJar postsList={hashtagPosts} loading={loading}/>
                        </>
                    }
                </div>
            )}
        </>
    );
}