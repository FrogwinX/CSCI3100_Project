"use client";

// Placeholder Register Page
export default function RegisterPage() {
  return (
    <fieldset className="fieldset w-xs bg-base-100 border border-base-300 p-4 rounded-box">
      <legend className="fieldset-legend">Register</legend>

      <label className="fieldset-label">Email</label>
      <input type="email" className="input" placeholder="Email" />

      <label className="fieldset-label">Password</label>
      <input type="password" className="input" placeholder="Password" />

      <button className="btn btn-neutral mt-4">Sign Up</button>
    </fieldset>
  );
}
