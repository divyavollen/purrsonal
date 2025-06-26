import React from "react"
import ReactDOM from "react-dom/client"
import Register from "./components/Register"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./components/Login"
import Layout from "./components/Layout"

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)