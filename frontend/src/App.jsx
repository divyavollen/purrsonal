import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Home from "./components/app/Home";
import HomeLayout from "./components/layout/HomeLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                <Route path="/" element={
                    <ProtectedRoute>
                        <HomeLayout />
                    </ProtectedRoute>
                }>

                    <Route index element={
                        <Home />
                    } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}