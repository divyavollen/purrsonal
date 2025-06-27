import React from "react";
import { Outlet } from "react-router-dom";
import Logo from "/src/components/header/Logo";

import "/src/css/auth.css"

export default function RegisterLayout() {

    return (
        <>
            <Logo className="register-logo" />
            <Outlet />
        </>
    )
}