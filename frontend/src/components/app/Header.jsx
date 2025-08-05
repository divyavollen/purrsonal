import React from "react";
import Logo from "/src/images/logo.png";
import { useNavigate } from "react-router-dom";
import "../../css/header.css";

export default function Header() {

    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("token");
        navigate('/login');
    }

    return (
        <header>
            <div className="branding">
                <img src={Logo} alt="Purrsonal Logo" className="header-logo" />
                <h1>Purrsonal</h1>
            </div>
            <nav>
                <button onClick={logout} className="logout-link">Logout</button>
            </nav>
        </header>
    );
}