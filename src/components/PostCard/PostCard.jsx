import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaComment, FaRetweet, FaRegStar, FaStar } from "react-icons/fa6";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

export default function PostCard({ postDetails }) {
    const postData = postDetails.data || postDetails;
    const userDetails = postData.User || postData.user;

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [isReposted, setIsReposted] = useState(postDetails.isReposted || false);
    const [isLiked, setIsLiked] = useState(postDetails.isLiked || false);
    const [repostCount, setRepostCount] = useState(postData._count?.reposts || 0);
    const [likeCount, setLikeCount] = useState(postData._count?.likedBy || 0);

    if (!userDetails) {
        console.error("User details missing from post:", postDetails);
        return null;
    }

    const goToProfile = (event) => {
        event.preventDefault();
        event.stopPropagation()
        navigate(`/u/${userDetails.username}`);
    };

    const handleRepost = async (event, postId) => {
        event.preventDefault();
        event.stopPropagation()

        setLoading(true);

        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            try {
                const response = await fetch(`http://localhost:3000/posts/${postId}/repost`, {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    },
                });

                if (response.status !== 201) {
                    const data = await response.json(); // Fix: await the json()
                    alert(data.error || "Error: Unknown error");
                } else {
                    setIsReposted(prev => !prev);
                    setRepostCount(prev => isReposted ? prev - 1 : prev + 1);
                }
            } catch (error) {
                console.error("Repost error:", error);
                alert("Error creating repost");
            } finally {
                setLoading(false);
            }
        }
    }

    const handleLike = async (event, postId) => {
        event.preventDefault();
        event.stopPropagation()

        setLoading(true);

        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            try {
                const response = await fetch(`http://localhost:3000/posts/${postId}/like`, {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    },
                });

                if (response.status !== 201) {
                    const data = await response.json(); // Fix: await the json()
                    alert(data.error || "Error: Unknown error");
                } else {
                    setIsLiked(prev => !prev);
                    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
                }
            } catch (error) {
                console.error("Repost error:", error);
                alert("Error creating repost");
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <Link to={`/p/${postData.id}`}>
            <div className="p-3 hover:bg-neutral-700">
                {postDetails.type === "repost" && (
                    <div className="flex items-center gap-1 text-gray-400 ml-10"><FaRetweet /> Reposted by {postDetails.repostedBy.username}</div>
                )}
                <div className="flex gap-3">
                    <div>
                        <div onClick={(event) => goToProfile(event)}>
                            <img className="w-15 h-15 rounded-full object-cover shrink-0" src={userDetails.profilePic} alt="" />
                        </div>
                    </div>
                    
                    <div>
                        <div className="flex items-center gap-1 text-xl">
                            <div className="flex items-center gap-1 text-xl font-semibold hover:underline">
                                <div onClick={(event) => goToProfile(event)}>{userDetails.username}</div>
                                {userDetails.isPrivate && (
                                    <FaLock />
                                )}
                            </div>

                            <div className="text-gray-400">·</div>

                            <div className="text-gray-400">
                                {formatDistanceToNow(new Date(postData.postedAt))} ago
                            </div>
                        </div>

                        <div className="text-xl w-100 wrap-break-word">
                            {postData.content}
                        </div>

                        {postData.attachment && 
                            <div className="w-100"><img src={postData.attachment} alt="" /></div>
                        }

                        <div className="flex gap-2">
                            <div className="flex items-center gap-0.5">
                                <div><FaComment /></div>
                                <div>{postData._count?.comments || 0}</div>
                            </div>

                            <div className={`flex items-center gap-0.5 hover:text-green-400 ${isReposted ? 'text-green-400' : ''}`} onClick={(event) => handleRepost(event, postData.id)}>
                                <div className="cursor-pointer">
                                    <FaRetweet />
                                </div>
                                <div>{repostCount}</div>
                            </div>

                            <div className={`flex items-center gap-0.5 hover:text-yellow-500 ${isLiked ? 'text-yellow-500' : ''}`} onClick={(event) => handleLike(event, postData.id)}>
                                <div className="cursor-pointer">
                                    {!isLiked ? (
                                        <FaRegStar />
                                    ) : (
                                        <FaStar />
                                    )}
                                </div>
                                <div>{likeCount}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}