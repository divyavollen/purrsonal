import React from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom";

import "../style.css"

export default function Register() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            username: "testuser",
            email: "test@example.com",
            password: "Test@1234"
        }
    });

    const password = watch("password", "");

    const hasUpperAndLower = /(?=.*[a-z])(?=.*[A-Z])/.test(password);
    const hasNumberOrSymbol = /(?=.*[\d@$!%*?&])/.test(password);
    const isLongEnough = password.length >= 8;
    const isShortEnough = password.length <= 64;

    const isPasswordValid = hasUpperAndLower && hasNumberOrSymbol && isLongEnough && isShortEnough;

    function registerUser(data) {
        console.log(JSON.stringify(data))

        fetch("http://localhost:8080/api/auth/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        ).then((res) => {
            if (!res.ok) {
                throw new Error("Registration failed");
            }
            return res.json();
        }).then((result) => {
            console.log("Registration successful:", result);
        }).catch((error) => {
            console.error("Error:", error);
        });
    }

    return (
        <form
            onSubmit={handleSubmit(data => registerUser(data))}
        >
            <label>Username</label>
            <input type="text" placeholder="johndoe"
                {...register("username", {
                    required: "Username is required",
                    minLength: {
                        value: 5,
                        message: "Must be at least 5 characters",
                    },
                    maxLength: {
                        value: 64,
                        message: "Must be under 64 characters",
                    },
                    pattern: {
                        value: /^[a-zA-Z0-9._-]+$/,
                        message: "Only letters, numbers, dots, underscores, and hyphens allowed",
                    }
                })} />
            {errors.username && <p>{errors.username.message}</p>}

            <label>Email</label>
            <input type="email" placeholder="johndoe@example.com"
                {...register("email", {
                    required: "Email is required",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                    },
                })} />
            {errors.email && <p>{errors.email.message}</p>}

            <label>Password</label>
            <input type="password" placeholder="Must be at least 8 characters"
                {...register("password", {
                    required: "Password is required",
                })}
            />
            {password && !isPasswordValid && (
                <div className="password-criteria">
                    <strong>Your password needs to:</strong>
                    <ul>
                        <li className={hasUpperAndLower ? "valid" : "invalid"}>
                            {hasUpperAndLower ? "✔" : "✖"} Include both uppercase and lowercase letters
                        </li>
                        <li className={hasNumberOrSymbol ? "valid" : "invalid"}>
                            {hasNumberOrSymbol ? "✔" : "✖"} Include a number or symbol
                        </li>
                        <li className={isLongEnough && isShortEnough ? "valid" : "invalid"}>
                            {isLongEnough && isShortEnough ? "✔" : "✖"} Be 8–64 characters long
                        </li>
                    </ul>
                </div>
            )}
            {errors.password && <p>{errors.password.message}</p>}

            <input type="submit" value="Register" />

            <Link to="/login">Login</Link>
        </form>
    );
}
