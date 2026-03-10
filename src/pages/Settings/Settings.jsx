import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../AuthContext";

import { FaLock, FaRightFromBracket, FaShieldHalved, FaUserLarge } from "react-icons/fa6";

import { Link } from "react-router";

export default function Settings() {
    const { loading: authLoading, loggedIn, userDetails: authUser, logout } = useContext(AuthContext);

    const navigate = useNavigate();    

    useEffect(() => {
        if (!authLoading && !loggedIn) {
            navigate("/");
        }
    }, [authLoading, loggedIn, navigate]);

    return (
        <div>
            <div>
                <Link to="/settings/security" className="flex items-center gap-1 text-xl hover:underline">
                    <FaLock />
                    <div>Security</div>
                </Link>

                <Link to="/settings/privacy" className="flex items-center gap-1 text-xl hover:underline">
                    <FaShieldHalved />
                    <div>Privacy</div>
                </Link>

                <Link to="/settings/profile" className="flex items-center gap-1 text-xl hover:underline">
                    <FaUserLarge />
                    <div>Profile</div>
                </Link>

                <div onClick={() => logout()} className="flex items-center gap-1 text-red-500 text-xl hover:cursor-pointer hover:underline">
                    <FaRightFromBracket />
                    <div>Sign Out</div>
                </div>
            </div>
        </div>
    );
}