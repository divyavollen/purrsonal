import React from "react";
import logoImg from '/src/images/logo.png';

export default function Logo({ className }) {

    return (
        <div className={className}>
            <img className="logo-img" src={logoImg} alt="purrsonal-logo" />
            <span>Purrsonal Tracker</span>
        </div>
    )
}