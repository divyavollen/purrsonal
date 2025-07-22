import React from "react";
import Logo from "/src/images/logo.png";
import { NavLink } from "react-router";
import "../../css/header.css";

export default function Header() {

    function logout() {
        localStorage.removeItem("token");
    }

    return (
        <header>
            <div className="branding">
                <img src={Logo} alt="Purrsonal Logo" className="header-logo" />
                <h1>Purrsonal</h1>
            </div>
            <nav>
                <NavLink to="/login" onClick={logout}>Logout</NavLink>
            </nav>
        </header>
    );
}