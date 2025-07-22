import React from "react";
import { Outlet } from "react-router";
import Header from "../app/Header";

export default function HomeLayout() {
    return (
        <>
            <Header />
            <Outlet/>
        </>
    );
}