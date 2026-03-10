import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../AuthContext";

import { FaLock, FaLocationDot, FaLink } from "react-icons/fa6";

import PostCard from "../PostCard/PostCard";

export default function PostsJar({ postsList, loading }) {
    
    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>                    
                    {postsList && postsList.length > 0 ? (
                        <div>
                            {postsList.map((post) => {
                                return <PostCard postDetails={post} key={post.type === 'repost' ? `repost-${post.datetime}-${post.data?.id || post.id}` : post.data?.id || post.id} />
                            })}
                        </div>
                    ) : (
                        <p></p>
                    )}
                </>
            )}
        </>
    );
}