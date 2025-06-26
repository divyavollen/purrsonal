import React from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import "../style.css"

export default function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      username: "testuser",
      password: "Test@1234"
    }
  });

  function login(data) {

    console.log(JSON.stringify(data));
    fetch("http://localhost:8080/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((res) => {
      if (!res.ok) {
        throw new Error("Login failed");
      }
      return res.json();
    }).then((result) => {
      console.log("Login successful:", result);
    }).then((result) => {
      console.log("Login successful:", result);
      if (result.token) {
        localStorage.setItem('authToken', result.token);
      }
    }).catch((error) => {
      console.error("Error:", error);
    });
  }

  return (
    <form
      onSubmit={handleSubmit(data => login(data))}
    >
      <label>Username</label>
      <input {...register("username", {
        required: "Username is required"
      })} />
      {errors.password && <p>{errors.username.message}</p>}

      <label>Password</label>
      <input type="password"
        {...register("password", {
          required: true, minLength: 8, maxLength: 20
        })}
      />
      {errors.password && <p>{errors.password.message}</p>}

      <input type="submit" value="Login" />
      <div className="login-link">
        <span>Don't have an account?</span> <Link to="/register">Sign up</Link>
      </div>
    </form>
  );
}
