import React from "react";
import { Form, FloatingLabel, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "../../css/auth.css";
import Logo from "/src/images/logo.png";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm();

    React.useEffect(() => {
        if (location.state?.message) {
            setError("global", {
                type: "manual",
                message: location.state.message,
            });
        }
    }, [location.state, setError]);

    const onLoginSuccess = () => {
        
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
    };

    const onSubmit = formData => {
        console.log(formData);

        fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        }).then(async response => {
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                localStorage.setItem("token", data.token);
                onLoginSuccess();
            } else {
                console.error("Registration failed:", data.errors);
                data.errors.forEach(({ field, message }) => {
                    setError(field, { type: "server", message });
                    console.error(`Error in field ${field}: ${message}`);
                });
                throw new Error("Registration failed");
            }
        });
    }

    return (

        <div className="auth-wrapper">
            <Form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="auth-header">
                    <img src={Logo} alt="Purrsonal Logo" className="auth-logo" />
                </div>
                <h2>Sign In</h2>
                {errors.global && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {errors.global.message}
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                            onClick={() => clearErrors("global")}
                        ></button>
                    </div>
                )}
                <FloatingLabel controlId="username" label="Username" className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Username"
                        {...register("username", {
                            required: "Username is required.",
                            minLength: {
                                value: 4,
                                message: "Username must be at least 4 characters.",
                            },
                            maxLength: {
                                value: 20,
                                message: "Username must be at most 20 characters.",
                            },
                            pattern: {
                                value: /^[a-zA-Z](?:[a-zA-Z0-9]|[_-](?![_-]))*[a-zA-Z0-9]$/i,
                                message: "Username must start with a letter, end with a letter or digit, and may include underscores or hyphens",
                            }
                        })}
                        isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.username?.message}
                    </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel controlId="password" label="Password" className="mb-3">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        {...register("password", {
                            required: "Password is required.",
                            minLength: {
                                value: 12,
                                message: "Password must be at least 12 characters.",
                            },
                            maxLength: {
                                value: 264,
                                message: "Password must be at most 264 characters.",
                            },
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/,
                                message: "Password must include uppercase, lowercase, a number, and a special character (!@#$%^&*)",
                            }
                        })}
                        isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.password?.message}
                    </Form.Control.Feedback>
                </FloatingLabel>

                <Button type="submit" variant="primary" className="w-100 register-btn">
                    Login
                </Button>

                <p className="auth-footer-text">
                    Don"t have an account? <a href="/register">Sign Up</a>
                </p>
            </Form>
        </div>
    );
}