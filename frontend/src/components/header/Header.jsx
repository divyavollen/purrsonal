import React from "react";
import Logo from "./Logo";

export default function Header() {

    return (
        <header>
            <Logo className="main-logo" />
            <h1 className="home-link">Home</h1>
            <h1 className="logout-link">Logout</h1>
        </header>
    )
}