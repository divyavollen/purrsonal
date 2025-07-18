import React from 'react';
import { createRoot } from "react-dom/client"
import App from "./App"
import "./main.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const app = createRoot(document.getElementById("app"))

app.render(
    <App />
)