import React from "react";
import logo from '../images/logo.png'; 

export default function Header() {

    return(
        <div className="logo"><img className="logo-img" src={logo} alt="purrsonal-logo"/><span>Purrsonal Tracker</span></div>
    )
}