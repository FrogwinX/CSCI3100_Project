"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [UsernameOrEmail, setUserInput] = useState("");
  const [UsernameOrEmailError, setUsernameOrEmailError] = useState("");
  const [UsernameOrEmailAvailable, setUsernameOrEmailAvailable] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [PasswordAvailable, setPasswordAvailable] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    let username = null;
    let email = null;

    if (UsernameOrEmail.includes("@")) {
      email = UsernameOrEmail;
    } else {
      username = UsernameOrEmail;
    }

    try {
      const result = await login(username, email, password);

      if (!result.data.isPasswordCorrect || !result.data.isAccountActive) {
        setError("Invalid username or password.");
        return;
      }

      console.log("Login successful", result.data.user);
      
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Error logging in:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    if (e.target.value) {
      setUsernameOrEmailAvailable(true);
      setUsernameOrEmailError("");
    } else {
      setUsernameOrEmailAvailable(false);
      setUsernameOrEmailError("Username or email is required.");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value) {
      setPasswordAvailable(true);
      setPasswordError("");
    } else {
      setPasswordAvailable(false);
      setPasswordError("Password is required.");
    }
  };

  return (
    <form className="card w-full max-w-md bg-base-100 shadow-xl" onSubmit={handleLogin}>
      <div className="card-body">
        <div className="border-t-10 border-transparent w-full"></div>
        <h1 className="card-title text-center text-3xl">Sign In</h1>
        <div className="form-control ">
          <label className="label">
            <span className="label-text text-lg text-base-content mb-1">Username / Email</span>
          </label>
          <input
            type="text"
            placeholder="Username or email"
            value={UsernameOrEmail}
            onChange={handleInputChange}
            className="input input-bordered w-full border focus:outline-none focus:border-base-300"
          />
          {!UsernameOrEmailAvailable && UsernameOrEmailError && (
            <p className="text-red-500 mt-2">{UsernameOrEmailError}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg text-base-content mb-1">Password</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className="input input-bordered w-full border focus:outline-none focus:border-base-300"
          />
          {!PasswordAvailable && passwordError && (
            <p className="text-red-500 mt-2">{passwordError}</p>
          )}
          <label className="label">
            <a href="/forgot-password" className="label-text-alt link link-hover text-info">
              Forgot password?
            </a>
          </label>
        </div>

        <div className="form-control mt-2">
          <button
            type="submit"
            className="btn btn-primary w-full"
            onClick={(e) => {
              if (!UsernameOrEmail || !password) {
                  e.preventDefault();
                  setUsernameOrEmailError("Username or email is required.");
                  setPasswordError("Password is required.");
                  return;
              }
            }}
          >
            Login
          </button>
          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </div>
        <div className="form-control mt-2">
          <button
            type="button"
            onClick = {() => window.location.href = "/register"}
            className="btn btn-secondary w-full bg-base-300 text-base-content border-none"
          >
            Sign Up
          </button>
        </div>
      </div>
    </form>
  );
}