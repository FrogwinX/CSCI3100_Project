"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // This would be your actual login implementation
      const success = await login(email, password);

      if (success) {
        router.push("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 w-full max-w-md shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center w-full text-base-content">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="alert alert-error text-error-content">
              <span>{error}</span>
            </div>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">Email</span>
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn btn-primary text-primary-content w-full ${
                loading ? "loading" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
        <div className="divider">OR</div>
        <div className="text-center">
          <p className="text-base-content">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
          <Link
            href="/login/forgot-password"
            className="text-primary hover:underline text-sm"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
