"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [serverErrorMessage, setServerErrorMessage] = useState<string>("");
  const [UsernameOrEmail, setUserInput] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    let username = null;
    let email = null;

    if (UsernameOrEmail.includes("@")) {
      email = UsernameOrEmail;
    } else {
      username = UsernameOrEmail;
    }

    if (!UsernameOrEmail) {
      setErrors((prevErrors) => ["Username or email is required.", ...prevErrors]);
      return;
    }

    if (!password) {
      setErrors((prevErrors) => ["Password is required.", ...prevErrors]);
      return;
    }

    try {
      const result = await login(username, email, password);
      setLoading(false);
      if (result.data.isPasswordCorrect && result.data.isAccountActive && result.data.user) {
        router.push("/forum");
      } else {
        setServerErrorMessage(result.message);
        setErrors((prevErrors) => [result.message, ...prevErrors]);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {}
  };

  const clearServerError = () => {
    if (serverErrorMessage) {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== serverErrorMessage));
      setServerErrorMessage("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearServerError();
    setUserInput(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== "Username or email is required."));
    } else {
      setErrors((prevErrors) => ["Username or email is required.", ...prevErrors]);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearServerError();
    setPassword(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== "Password is required."));
    } else {
      setErrors((prevErrors) => ["Password is required.", ...prevErrors]);
    }
  };

  return (
    <form className="card w-fit min-w-sm lg:min-w-lg max-w-xl bg-base-100 shadow-xl" onSubmit={handleLogin}>
      <div className="card-body gap-4">
        <div role="alert" className={`alert alert-error alert-soft ${errors.length ? "" : "invisible"}`}>
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-2xl text-error" />
          <p>
            <span>
              {errors[0] || "\u00A0"}
              <br />
            </span>
          </p>
        </div>

        <h1 className="card-title text-center text-4xl ">Sign In</h1>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content">Username / Email</span>
          </label>
          <input
            type="text"
            placeholder="Username or email"
            value={UsernameOrEmail}
            onChange={handleInputChange}
            className="input input-bordered w-full my-1"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content">Password</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className="input input-bordered w-full my-1"
          />
          <label className="label">
            <Link href="/forgot-password">
              <p className="label-text-alt link link-hover text-info ">Forgot password?</p>
            </Link>
          </label>
        </div>

        <div className="form-control">
          <button
            type="submit"
            className="btn btn-primary w-full"
            onClick={(e) => {
              if (!UsernameOrEmail) {
                e.preventDefault();
                setErrors((prevErrors) => ["Username or email is required.", ...prevErrors]);
                return;
              }
              if (!password) {
                e.preventDefault();
                setErrors((prevErrors) => ["Password is required.", ...prevErrors]);
                return;
              }
            }}
          >
            {loading ? <span className="loading loading-dots loading-md bg-base-content"></span> : "Login"}
          </button>
        </div>
        <div className="form-control mt-2">
          <Link href="/register">
            <button type="button" className="btn btn-secondary w-full bg-base-300 text-base-content border-none">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </form>
  );
}
