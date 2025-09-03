import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" replace state={{
            message: "You must log in to continue.",
            from: location
        }} />;
    }

    try {
        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
            return <Navigate to="/login" replace state={{
                message: "You must log in to continue.",
                from: location
            }} />;
        }

        return children;
    } catch (err) {
        return <Navigate to="/login" replace state={{
            message: "You must log in to continue.",
            from: location
        }} />;
    }
}
