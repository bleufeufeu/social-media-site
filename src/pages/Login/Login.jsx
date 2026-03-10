import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../AuthContext";
import { Link } from "react-router";
import { FaGithub } from "react-icons/fa6";

export default function Login() {
    const { loading: authLoading, loggedIn, login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && loggedIn) {
            navigate("/");
        }
    },[authLoading, loggedIn, navigate]);

    const [formState, setFormState] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const [errorMessages, setErrorMessages] = useState("");

    const onChange = (event) => {
        const { name, value } = event.target;
        setFormState({...formState, [name]: value})
    }

    const loginUrl = "http://localhost:3000/login"

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const response = await fetch(loginUrl, {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: formState.username,
                password: formState.password,
            })
        })

        const data = await response.json();

        if (response.status !== 200) {
            setLoading(false);
            if (data.error) {
                setErrorMessages(data.error);
                console.log(errorMessages);
            } else {
                alert("Error: " + (data.error || "Unknown error"));
            }
            return;
        }

        login(data.user, data.token);

        navigate("/");
    }

    return (
        <div className="flex justify-center items-center flex-col h-screen">
            <div className="text-3xl font-bold">Login</div>

            {errorMessages && (
                <div className="bg-red-900/50 border border-red-700 text-red-400 rounded-md px-3 py-2 text-center text-sm">
                    {errorMessages}
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

                <button className="pt-1 pb-1 pr-3 pl-3 rounded-2xl bg-teal-700 hover:bg-teal-600 hover:cursor-pointer" type="submit" disabled={loading}>Login</button>

                <a className="flex justify-center items-center gap-1 pt-1 pb-1 pr-3 pl-3 rounded-2xl bg-neutral-700 hover:bg-neutral-600 hover:cursor-pointer" href="http://localhost:3000/login/github"><FaGithub /> Login with GitHub</a>
                <div>Don't have an account? <Link to="/signup" className="text-teal-500 hover:underline">Sign up</Link></div>
            </form>
        </div>
    )
}