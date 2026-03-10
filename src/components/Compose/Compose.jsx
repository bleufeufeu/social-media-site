import { useState, useContext } from "react";
import { AuthContext } from "../../AuthContext";

import { FaPaperclip } from "react-icons/fa6";
import { TbGif } from "react-icons/tb";


export default function Compose() {

    const { userDetails } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [formState, setFormState] = useState({ message: "" });
    const [file, setFile] = useState(null);

    const onChange = (event) => {
        const { name, value } = event.target;
        setFormState({...formState, [name]: value})
    }

    const createPost = async (event) => {
        event.preventDefault();

        setLoading(true);

        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            let fileUrl = "";

            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                const uploadRes = await fetch(`http://localhost:3000/upload`, {
                    method: "post",
                    headers: {
                        'Authorization': `Bearer ${storedToken}`
                    },
                    body: formData
                });

                const uploadData = await uploadRes.json();
                fileUrl = uploadData.url;
            }

            const response = await fetch(`http://localhost:3000/posts/new`, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                },
                body: JSON.stringify({
                    content: formState.message,
                    ...(file && { attachment: fileUrl })                    
                })
            });

            const data = await response.json();

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
            setFormState({ message: "" });

        }
    }

    return (
        <>
            <form className="w-full flex flex-col gap-1" onSubmit={createPost}>
                <textarea className="resize-none bg-neutral-800 rounded-md p-2" name="message" id="message" type="text" value={formState.message} onChange={onChange} placeholder="Say something!"/>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                        <label className="flex p-2 rounded-2xl hover:bg-neutral-600 cursor-pointer">
                            <FaPaperclip />
                            <input
                                className="hidden"
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </label>

                        {file && (
                            <span className="text-neutral-400 text-sm">{file.name}</span>
                        )}
                    </div>
                    <button className="pt-1 pb-1 pr-3 pl-3 rounded-2xl bg-teal-700 hover:bg-teal-500 hover:cursor-pointer" disabled={loading} type="submit">Post</button>
                </div>
            </form>
        </>            
    )
}