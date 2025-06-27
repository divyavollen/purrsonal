import React from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

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

  const navigate = useNavigate()

  function login(data) {
    
    fetch("http://localhost:8080/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      }
    ).then(res => {
      if (!res.ok) {
        throw new Error("Login failed");
      }

      return res.json();
    }).then(data => {

      navigate("/home");

    }).catch((error) => {
      console.error("Error:", error);
    });
  }

  return (
    <form
      onSubmit={handleSubmit(data => login(data))}
    >

      <h1>Sign In</h1>

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
