import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";

export default function Signup() {
    const navigate = useNavigate();

    const [formState, setFormState] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [errorMessages, setErrorMessages] = useState([]);

    const [loading, setLoading] = useState(false);

    const onChange = (event) => {
        const { name, value } = event.target;
        setFormState({...formState, [name]: value})
    }

    const signupUrl = "https://social-media-site-api.onrender.com/signup/"

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const response = await fetch(signupUrl, {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: formState.username,
                password: formState.password,
                confirmPassword: formState.confirmPassword,
            })
        })

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
        
        setLoading(false);

        navigate("/login");
    }

    return (
        <div className="flex justify-center items-center flex-col h-screen">
            <div className="text-3xl font-bold">Signup</div>

            {errorMessages.length > 0 && (
                <div className="bg-red-900/50 border border-red-700 text-red-400 rounded-md px-3 py-2 text-center text-sm">
                    {errorMessages.map((error, index) => (
                        <div key={index}>• {error}</div>
                    ))}
                </div>
            )}

            <form className="flex flex-col gap-3" onSubmit={onSubmit}>

                <div className="flex flex-col gap-0.5">
                    <label htmlFor="username">Username</label>
                    <input className="bg-neutral-800 rounded-md" type="text" name="username" id="username" value={formState.username} onChange={onChange} required/>
                </div>

                <div className="flex flex-col gap-0.5">
                    <label htmlFor="password">Password</label>
                    <input className="bg-neutral-800 rounded-md" type="password" name="password" id="password" value={formState.password} onChange={onChange} required/>
                </div>

                <div className="flex flex-col gap-0.5">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input className="bg-neutral-800 rounded-md" type="password" name="confirmPassword" id="confirmPassword" value={formState.confirmPassword} onChange={onChange} required/>
                </div>

                <button className="pt-1 pb-1 pr-3 pl-3 rounded-2xl bg-teal-700 hover:bg-teal-600 hover:cursor-pointer" type="submit" disabled={loading}>Sign Up</button>

                <div>Already have an account? <Link to="/login" className="text-teal-500 hover:underline">Login</Link></div>
            </form>
        </div>
    )
}