"use client";

import React, { useState } from "react";
import { useAuth} from "@/hooks/useAuth";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const result = await login(username, password);

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

  return (
    <form className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="border-t-20 border-transparent w-full mb-4"></div>
        <h1 className="card-title text-center text-4xl">Sign In</h1>
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text text-lg text-base-content">Username / Email</span>
          </label>
          <input
            type="text"
            placeholder="Username or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-bordered w-full border focus:outline-none focus:border-base-300"
          />
        </div>
        
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text text-lg text-base-content">Password</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full border focus:outline-none focus:border-base-300"
          />
          <label className="label">
            <a href="/forgot-password" className="label-text-alt link link-hover text-info">
              Forgot password?
            </a>
          </label>
        </div>
        <div className="form-control mt-6">
          <button
            type="button"
            onClick={handleLogin}
            className="btn btn-primary w-full"
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
            className="btn btn-secondary w-full bg-base-200 text-base-content border-none"
          >
            Sign Up
          </button>
        </div>
      </div>
    </form>
  );
}