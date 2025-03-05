"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { OTPInput, SlotProps } from "input-otp";

function Slot(props: SlotProps) {
  return (
    <div
      className={`relative w-7 h-10 text-[2rem]
        flex items-center justify-center
        transition-all duration-300
        focus:outline-none
        focus:border-base-300
        group-hover:border-primary group-focus-within:border-primary
      `}
    >
      <div className="absolute bottom+0 left-0 right-0 text-center text-base-300">
        _
      </div>
      <div className="opacity-100">
        {props.char ?? ""}
      </div>
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
}

function FakeCaret() {
  return (
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-pulse">
      <div className="w-px h-8 bg-primary"></div>
    </div>
  );
}

function FakeDash() {
  return (
    <div className="flex w-10 justify-center items-center">
      <div className="w-3 h-1 rounded-full bg-base-300"></div>
    </div>
  );
}

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const { requestLicenseKey, register, checkUsernameUnique, checkEmailUnique} = useAuth();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await register(username, email, password, licenseKey);

      if (success) {
        router.push("/");
      } else {
        setError("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    if (newUsername.length > 50) {
      setUsernameError("Username cannot exceed 50 characters");
      setUsernameAvailable(false);
      return;
    }
    setUsername(newUsername);
    if (newUsername) {
      const result = await checkUsernameUnique(newUsername);
      if (result.data.isUsernameUnique) {
        setUsernameAvailable(true);
        setUsernameError("");
      } else {
        setUsernameAvailable(false);
        setUsernameError("This username has been used");
      }
    } else {
      setUsernameAvailable(false);
      setUsernameError("This field is required");
    }
  };

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    if (newEmail.length > 100) {
      setEmailError("Email cannot exceed 100 characters");
      setEmailAvailable(false);
      return;
    }
    setEmail(newEmail);

    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormat.test(newEmail)) {
      setEmailAvailable(false);
      setEmailError("Invalid email format");
      return;
    }

    if (newEmail) {
      const result = await checkEmailUnique(newEmail);
      if (result.data.isEmailUnique) {
        setEmailAvailable(true);
        setEmailError("");
      } else {
        setEmailAvailable(false);
        setEmailError("This Email has been used");
      }
    } else {
      setEmailAvailable(false);
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    if (newPassword.length > 50) {
      setPasswordError("Password cannot exceed 50 characters");
      return;
    }
    setPassword(newPassword);

    const passwordCriteria = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordCriteria.test(newPassword)) {
      setPasswordError(
        "Must be at least 8 characters long, including\nAt least one alphabet (a~z, A~Z)\nAt least one numerical character (0~9)"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleSendActivationKey = async () => {
    try {
      await requestLicenseKey(email);
      setEmailSent(true);
      setError("");
    } catch (error) {
      console.error("Error sending activation key:", error);
      setError("Failed to send activation key. Please try again.");
    }
  };

  const handleLicenseKeyChange = (value: string) => {
    const cleanedValue = value.replace(/[\s-]/g, "");
    setLicenseKey(cleanedValue);
    
  };

  return (
    <form className="card w-full max-w-xl bg-base-100 shadow-xl" onSubmit={handleRegister}>
      <div className="card-body">
        <h1 className="card-title text-center text-2xl">Register</h1>
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg text-base-content ">Username</span>
          </label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            className="input input-bordered w-full border focus:outline-none focus:border-base-300"
            required
          />
          
          {usernameAvailable && (
            <p className="text-info mt-2">
              √ This Username is available
            </p>
          )}
          {!usernameAvailable && usernameError && (
            <p className="text-error mt-2">
              {usernameError}
            </p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg text-base-content">Email Address</span>
          </label>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={handleEmailChange}
            className="input input-bordered w-full border focus:outline-none focus:border-base-300"
            required
          />
          {emailAvailable && (
            <p className="text-info mt-2">
              √ This Email is available
            </p>
          )}
          {!emailAvailable && emailError && (
            <p className="text-error mt-2">
              {emailError}
            </p>
          )}
        </div>

        <div className="form-control">
          <button
            type="button"
            onClick={() => {
              if (!email) {
                setEmailError("Email is required to send activation key");
                return;
              }
              const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailFormat.test(email)) {
                setEmailError("Invalid email format");
                return;
              }
              handleSendActivationKey();
            }}
            className="btn btn-secondary w-1/2 bg-base-200 text-base-content border-none"
          >
            Send Activation Key
          </button>
          {email && emailSent && !error && (
            <p className="text-info mt-2">
              √ An email containing activation key has been sent to your registered email
            </p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg text-base-content">Activation Key</span>
          </label>
          <div className="border border-base-300 rounded-lg p-4">
            <OTPInput
              required
              value={licenseKey}
              onChange={handleLicenseKeyChange}
              maxLength={25}
              minLength={16}
              disabled={false}
              containerClassName="group flex items-center has-[:disabled]:opacity-30"
              render={({ slots }) => (
          <>
            <div className="flex">
              {slots.slice(0, 4).map((slot, idx) => (
                <Slot key={idx} {...slot} />
              ))}
            </div>

            <FakeDash />

            <div className="flex">
              {slots.slice(4, 8).map((slot, idx) => (
                <Slot key={idx} {...slot} />
              ))}
            </div>

            <FakeDash />

            <div className="flex">
              {slots.slice(8, 12).map((slot, idx) => (
                <Slot key={idx} {...slot} />
              ))}
            </div>

            <FakeDash />

            <div className="flex">
              {slots.slice(12, 16).map((slot, idx) => (
                <Slot key={idx} {...slot} />
              ))}
            </div>
          </>
              )}
            />
          </div>
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg text-base-content">Password</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full border focus:outline-none focus:border-base-300"
            value={password}
            onChange={handlePasswordChange}
            required
            minLength={8}
          />
          {passwordError && (
            <p className="text-error mt-2 whitespace-pre-line">
              {passwordError}
            </p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg text-base-content">Confirm Password</span>
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            className="input input-bordered w-full border focus:outline-none focus:border-base-300"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (e.target.value !== password) {
                e.target.setCustomValidity("Passwords do not match");
              } else {
                e.target.setCustomValidity("");
              }
            }}
            required
          />
        </div>

        {password !== confirmPassword && (
          <p className="text-error">
            Passwords do not match
          </p>
        )}

        <div className="form-control mt-4">
          <button
            type="submit"
            className={`btn btn-primary text-primary-content w-full ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>

        <div className="form-control mt-2">
          <button
            type="button"
            onClick = {() => window.location.href = "/login"}
            className="btn btn-secondary w-full bg-base-200 text-base-content border-none"
          >
            Back
          </button>
        </div>
      </div>
    </form>
  );
}
