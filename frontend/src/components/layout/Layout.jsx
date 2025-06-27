import React from "react";
import { Outlet } from "react-router-dom";
import Header from "/src/components/header/Header"

import "/src/css/header.css"
import "/src/css/main.css"

export default function Layout() {

    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    )
}