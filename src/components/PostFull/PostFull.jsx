import { useState } from "react";
import { FaLock, FaComment, FaRetweet, FaRegStar, FaStar } from "react-icons/fa6";
import { format, formatDistanceToNow } from "date-fns";

export default function PostFull({ postDetails }) {
    const postData = postDetails.data || postDetails;
    const userDetails = postData.User || postData.user;

    const [loading, setLoading] = useState(false);

    const [formState, setFormState] = useState({ message: "" });

    const onChange = (event) => {
        const { name, value } = event.target;
        setFormState({...formState, [name]: value})
    }

    const [isReposted, setIsReposted] = useState(postData.isReposted || false);
    const [isLiked, setIsLiked] = useState(postData.isLiked || false);
    const [repostCount, setRepostCount] = useState(postData._count?.reposts || 0);
    const [likeCount, setLikeCount] = useState(postData._count?.likedBy || 0);

    const [commentsData, setCommentsData] = useState(postData.comments || []);
    const [commentCount, setCommentCount] = useState(postData._count?.comments || 0);

    if (!userDetails) {
        console.error("User details missing from post:", postDetails);
        return null;
    }

    const handleRepost = async (event, postId) => {
        event.preventDefault();

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
                    const data = await response.json();
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
                    const data = await response.json();
                    alert(data.error || "Error: Unknown error");
                } else {
                    setIsLiked(prev => !prev);
                    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
                }
            } catch (error) {
                console.error("Like error:", error);
                alert("Error liking repost");
            } finally {
                setLoading(false);
            }
        }
    }

    const createComment = async (event, postId) => {
        event.preventDefault();

        setLoading(true);

        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            try {
                const response = await fetch(`http://localhost:3000/posts/${postId}/comment`, {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    },
                    body: JSON.stringify({
                        content: formState.message
                    })
                });

                if (response.status !== 201) {
                    const data = await response.json();
                    alert(data.error || "Error: Unknown error");
                } else {
                    setCommentCount(prev => prev + 1);

                    const refetchComments = await fetch(`http://localhost:3000/posts/${postData.id}`, {
                        method: "get",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${storedToken}`
                        }
                    });

                    if (refetchComments.status !== 200 && refetchComments.status !== 206) {
                        setLoading(false);
                        return alert("Error");
                    }

                    const updatedComments = await refetchComments.json();

                    setCommentsData(updatedComments.comments);
                } 
                setFormState({ message: "" });
            } catch (error) {
                console.error("Comment error:", error);
                alert("Error creating comment");
            } finally {
                setLoading(false);
                setFormState({ message: "" });
            }

        }
    }

    return (
        <div className="p-3">
            {postDetails.type === "repost" && (
                <div className="flex items-center gap-1 text-gray-400 ml-10"><FaRetweet /> Reposted by {userDetails.username}</div>
            )}
            <div className="flex gap-3">
                <div>
                    <a href={`/u/${userDetails.username}`}>
                        <img className="w-15 h-15 rounded-full object-cover shrink-0" src={userDetails.profilePic} alt="" />
                    </a>
                </div>
                
                <div>
                    <div className="flex items-center gap-1 text-2xl font-semibold hover:underline">
                        <a href={`/u/${userDetails.username}`}>{userDetails.username}</a>
                        {userDetails.isPrivate && (
                            <FaLock />
                        )}
                    </div>


                    <div className="text-2xl w-100 wrap-break-word">
                        {postData.content}
                    </div>

                    {postData.attachment && 
                        <div><img src={postData.attachment} alt="" /></div>
                    }

                    <div className="text-gray-400">
                        {format(new Date(postData.postedAt), "HH:mm · MMMM dd, yyyy")}
                    </div>

                    <div className="flex gap-2">
                        <div className="flex items-center gap-0.5">
                            <div><FaComment /></div>
                            <div>{commentCount || 0}</div>
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

            <div>
                <div className="text-2xl">Comments ({commentCount})</div>

                <form className="w-full flex flex-col gap-1 mb-2" onSubmit={(event) => createComment(event, postData.id)}>
                    <textarea className="resize-none bg-neutral-800 rounded-md p-2" name="message" id="message" type="text" value={formState.message} onChange={onChange} placeholder="Say something!"/>
                    
                    <div className="flex items-center justify-between">
                        <button className="pt-1 pb-1 pr-3 pl-3 rounded-2xl bg-teal-700 hover:bg-teal-500 hover:cursor-pointer" disabled={loading} type="submit">Post</button>
                    </div>
                </form>

                <div className="flex flex-col gap-3">
                    {commentsData.map((comment) => {
                        return  <div key={comment.id} className="flex gap-3">
                                    <a href={`/u/${comment.User.username}`}>
                                        <img className="w-15 h-15 rounded-full object-cover shrink-0" src={comment.User.profilePic} alt="" />
                                    </a>

                                    <div>
                                        <div className="flex items-center gap-1 text-lg">
                                            <div className="flex items-center font-semibold hover:underline">
                                                <a href={`/u/${comment.User.username}`}>{comment.User.username}</a>
                                                {comment.User.isPrivate && (
                                                    <FaLock />
                                                )}
                                            </div>
                                            <div className="text-gray-400">·</div>
                                            <div className="text-gray-400">
                                                {formatDistanceToNow(new Date(comment.postedAt))} ago
                                            </div>
                                        </div>

                                        <div className="text-lg w-100 wrap-break-word">
                                            {comment.content}
                                        </div>
                                    </div>
                                    
                                </div>
                    })}
                </div>


            </div>
        </div>
    );
}