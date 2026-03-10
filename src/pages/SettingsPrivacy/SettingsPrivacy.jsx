import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../AuthContext";

export default function SettingsPrivacy() {
    const { loading: authLoading, loggedIn, userDetails: authUser } = useContext(AuthContext);
    const myUsername = authUser?.username;

    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !loggedIn) {
            navigate("/");
        }
    }, [authLoading, loggedIn, navigate]);

    const [isPrivate, setIsPrivate] = useState(authUser.isPrivate);

    const passwordUrl = "http://localhost:3000/users/me/private"

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const storedToken = localStorage.getItem("token");

            if (storedToken) {
                const response = await fetch(passwordUrl, {
                    method: "put",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    }
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

    const [errorMessages, setErrorMessages] = useState([]);

    const [loading, setLoading] = useState(false);

    const onChange = (event) => {
        const { name, value } = event.target;
        setFormState({...formState, [name]: value})
    }

    return (
        <div>
            <div>

                <form className="flex flex-col gap-3" onSubmit={onSubmit}>
                    <div>Your profile is {isPrivate ? "PRIVATE" : "PUBLIC"}. Click the button below to change this.</div>
                    <button className="pt-1 pb-1 pr-3 pl-3 rounded-2xl bg-teal-700 hover:bg-teal-600 hover:cursor-pointer" type="submit" disabled={loading}>{isPrivate ? "Go public" : "Go private"}</button>

                </form>
            </div>

        </div>
    );
}