import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../AuthContext";

export default function SettingsProfile() {
    const { loading: authLoading, loggedIn, userDetails: authUser } = useContext(AuthContext);
    const myUsername = authUser?.username;

    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !loggedIn) {
            navigate("/");
        }
    }, [authLoading, loggedIn, navigate]);

    const [file, setFile] = useState(null);

    const [formState, setFormState] = useState({
        bio: "",
        location: "",
        website: "",
    });

    useEffect(() => {
    if (!authLoading && authUser) {
            setFormState({
                bio: authUser.bio || "",
                location: authUser.location || "",
                website: authUser.website || "",
            });
        }
    }, [authLoading, authUser]);

    const [loading, setLoading] = useState(false);

    const onChange = (event) => {
        const { name, value } = event.target;
        setFormState({...formState, [name]: value})
    }

    const updateUrl = "http://localhost:3000/users/me/details"

    const onSubmit = async (event) => {
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

                const response = await fetch(updateUrl, {
                    method: "put",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    },
                    body: JSON.stringify({
                        profilePic: fileUrl,
                        bio: formState.bio,
                        location: formState.location,
                        website: formState.website,
                    })
                });

                const data = await response.json();

                if (response.status !== 201) {
                    setLoading(false);
                    if (data.errors) {
                        setErrorMessages(data.errors.map(error => error.msg))
                    } else {
                        alert("Error: " + (data.error || "Unknown error"));
                    }
                    return;
                }
            }
        
        setLoading(false);

        navigate(`/u/${myUsername}`);
    }

    return (
        <div>
            <div>

                <form className="flex flex-col gap-3" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-3">
                        <label htmlFor="profilePic">Profile Picture</label>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <label htmlFor="bio">Bio</label>
                        <textarea className="bg-neutral-800 rounded-md" name="bio" id="bio" value={formState.bio} onChange={onChange} />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <label htmlFor="location">Location</label>
                        <input className="bg-neutral-800 rounded-md" type="text" name="location" id="location" value={formState.location} onChange={onChange} />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <label htmlFor="website">Website</label>
                        <input className="bg-neutral-800 rounded-md" type="text" name="website" id="website" value={formState.website} onChange={onChange} />
                    </div>

                    <button className="pt-1 pb-1 pr-3 pl-3 rounded-2xl bg-teal-700 hover:bg-teal-600 hover:cursor-pointer" type="submit" disabled={loading}>Update</button>

                </form>
            </div>

        </div>
    );
}