import React from "react"
import ReactDOM from "react-dom/client"
import Register from "./components/Register"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./components/Login"

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)