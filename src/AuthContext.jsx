import { useState, useEffect, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);

    const [loggedIn, setLoggedIn] = useState(false);
    const [userDetails, setUserDetails] = useState({
        id: "",
        username: "",
        profilePic: "",
        bio: "",
        location: "",
        website: "",
    });

    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            fetch("https://social-media-site-api.onrender.com/users/me", {
                headers: { "Authorization": `Bearer ${storedToken}` }
            })
            .then(response => {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    setUserDetails({
                        id: "",
                        username: "",
                        profilePic: "",
                        bio: "",
                        location: "",
                        website: "",
                        isPrivate: false
                    })
                    setLoading(false);
                    return;
                }
                return response.json();
            })
            .then(data => {
                setLoggedIn(true);
                setUserDetails({
                    id: data.id,
                    username: data.username,
                    profilePic: data.profilePic,
                    bio: data.bio,
                    location: data.location,
                    website: data.website,
                    isPrivate: data.isPrivate
                });
            })
            .catch(error => console.error("Error getting user:", error))
            .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = (userDetails, token) => {
        localStorage.setItem("token", token);
        setLoggedIn(true);
        setUserDetails({
            id: userDetails.id,
            username: userDetails.username,
        });
    }

    const logout = () => {
        localStorage.removeItem("token");
        setLoggedIn(false);
        setUserDetails({
            id: "",
            username: ""
        });
    }

    return (
        <AuthContext.Provider
        value={{
            loading,
            loggedIn,
            userDetails,
            token,
            setToken,
            login,
            logout,
        }}
        >
        {children}
        </AuthContext.Provider>
    );
};