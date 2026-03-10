import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../AuthContext";

export default function SettingsSecurity() {
    const { loading: authLoading, loggedIn, userDetails: authUser } = useContext(AuthContext);
    const myUsername = authUser?.username;

    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !loggedIn) {
            navigate("/");
        }
    }, [authLoading, loggedIn, navigate]);

    const [formState, setFormState] = useState({
        oldPassword: "",
        password: "",
        confirmPassword: "",
    });

    const passwordUrl = "https://social-media-site-api.onrender.com/users/me/newpassword"

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
                    },
                    body: JSON.stringify({
                        username: myUsername,
                        oldPassword: formState.oldPassword,
                        password: formState.password,
                        confirmPassword: formState.confirmPassword,
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

        navigate("/");
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
                {errorMessages.length > 0 && (
                    <div>
                        {errorMessages.map((error, index) => (
                            <div key={index}>{error}</div>
                        ))}
                    </div>
                )}

                <form className="flex flex-col gap-3" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-0.5">
                        <label htmlFor="oldPassword">Old Password</label>
                        <input className="bg-neutral-800 rounded-md" type="password" name="oldPassword" id="oldPassword" value={formState.oldPassword} onChange={onChange} required/>
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <label htmlFor="password">New Password</label>
                        <input className="bg-neutral-800 rounded-md" type="password" name="password" id="password" value={formState.password} onChange={onChange} required/>
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input className="bg-neutral-800 rounded-md" type="password" name="confirmPassword" id="confirmPassword" value={formState.confirmPassword} onChange={onChange} required/>
                    </div>

                    <button className="pt-1 pb-1 pr-3 pl-3 rounded-2xl bg-teal-700 hover:bg-teal-600 hover:cursor-pointer" type="submit" disabled={loading}>Change Password</button>

                </form>
            </div>

        </div>
    );
}