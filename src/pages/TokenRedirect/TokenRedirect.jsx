import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AuthContext } from "../../AuthContext";
import Loading from "../../components/Loading/Loading";

export default function TokenRedirect() {
    const { loading: authLoading, loggedIn, setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!authLoading && loggedIn) {
            navigate("/");
        }
    },[authLoading, loggedIn, navigate]);

    useEffect(() => {
        localStorage.setItem("token", token);
    },[]);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            setToken(token);
            navigate("/");
        }
    }, [token]);

    return (
        <Loading />
    );
}