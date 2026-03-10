import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../AuthContext";

import PostFull from "../../components/PostFull/PostFull";
import Loading from "../../components/Loading/Loading";

export default function PostIndividual() {
    const { loading: authLoading, loggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const { postId } = useParams();

    const [loading, setLoading] = useState(true);

    const [postDetails, setPostDetails] = useState(null);


    useEffect(() => {
        if (!authLoading && !loggedIn) {
            navigate("/");
        }
    },[authLoading, loggedIn, navigate]);

    useEffect(() => {
        if (authLoading) return;

        const fetchPost = async () => {
            setLoading(true);

            const storedToken = localStorage.getItem("token");

            if (storedToken) {
                const response = await fetch(`https://social-media-site-api.onrender.com/posts/${postId}`, {
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

                setPostDetails(data);
            }
        };

        fetchPost();
        
    }, [authLoading, postId]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : postDetails ? (
                <div>
                    <PostFull postDetails={postDetails} />
                </div>
            ) : (
                <div>Post not found</div>
            )}
        </>
    );
}