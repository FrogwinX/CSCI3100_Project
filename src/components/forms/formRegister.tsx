"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { OTPInput, SlotProps } from "input-otp";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Slot(props: SlotProps) {
  return (
    <div
      className={`relative w-4 h-10
        flex items-center justify-center flex-auto
        transition-all duration-300
      `}
    >
      <div className="absolute bottom+0 left-0 right-0 text-center text-base-300 text-2xl">_</div>
      <div className="opacity-100">{props.char ?? ""}</div>
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
}

function FakeCaret() {
  return (
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-pulse">
      <div className="w-px h-4 bg-base-content"></div>
    </div>
  );
}

function FakeDash() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-3 h-0.5 rounded-full bg-base-content opacity-40"></div>
    </div>
  );
}

export default function RegisterForm() {
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
  const { requestLicenseKey, register, checkUsernameUnique, checkEmailUnique } = useAuth();

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
    if (newUsername.includes("@")) {
      setUsernameError("Username cannot contain the symbol '@'");
      setUsernameAvailable(false);
      setUsername(newUsername);
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
    if (newEmail) {
      if (newEmail.length > 100) {
        setEmailError("Email cannot exceed 100 characters");
        setEmailAvailable(false);
        setEmailSent(false);
        return;
      }
      setEmail(newEmail);

      const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (newEmail && !emailFormat.test(newEmail)) {
        setEmailAvailable(false);
        setEmailError("Invalid email format");
        setEmailSent(false);
        return;
      }
      const result = await checkEmailUnique(newEmail);
      if (result.data.isEmailUnique) {
        setEmailAvailable(true);
        setEmailError("");
      } else {
        setEmailAvailable(false);
        setEmailError("This Email has been used");
        setEmailSent(false);
      }
    } else {
      setEmailAvailable(false);
      setEmailError("This field is required");
      setEmailSent(false);
      setEmail(newEmail);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    if (!newPassword) {
      setPasswordError("This field is required");
      setPassword(newPassword);
      return;
    }
    if (newPassword.length > 50) {
      setPasswordError("Password cannot exceed 50 characters");
      return;
    }
    setPassword(newPassword);

    const passwordCriteria = /^(?=.*[A-Za-z])(?=.*\d)(?!.*\s).{8,}$/;
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
    const cleanedValue = value.replace(/[\s-]/g, "").slice(0, 16);
    setLicenseKey(cleanedValue);
  };

  return (
    <form className="card w-fit min-w-sm lg:min-w-lg max-w-xl bg-base-100 shadow-xl" onSubmit={handleRegister}>
      <div className="card-body gap-4">
        {(error || usernameError || emailError || passwordError) && (
          <div role="alert" className="p-4 mt-12 alert alert-error alert-soft">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-2xl text-error" />
            <p>
              {
                <span>
                  {usernameError}
                  <br />
                </span>
              }
              {
                <span>
                  {emailError}
                  <br />
                </span>
              }
              {
                <span>
                  {error}
                  <br />
                </span>
              }
              {<span>{passwordError}</span>}
            </p>
          </div>
        )}

        <h1 className="card-title text-center text-4xl ">Register</h1>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content ">Username</span>
          </label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            className="input input-bordered w-full my-1"
          />

          {username && usernameAvailable && <p className="text-info">√ This Username is available</p>}
          {!usernameAvailable && usernameError && <p className="text-error">{usernameError}</p>}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content">Email Address</span>
          </label>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={handleEmailChange}
            className="input input-bordered w-full my-1"
          />
          {emailAvailable && <p className="text-info">√ This Email is available</p>}
          {!emailAvailable && emailError && <p className="text-error">{emailError}</p>}
        </div>
        <div className="form-control">
          <button
            type="button"
            onClick={() => {
              if (!email) {
                setEmailError("Email is required to send activation key");
                setEmailSent(false);
                return;
              }
              const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailFormat.test(email)) {
                setEmailError("Invalid email format");
                setEmailSent(false);
                return;
              }
              handleSendActivationKey();
            }}
            className="btn btn-secondary w-fit bg-base-200 text-base-content border-none"
          >
            Send Activation Key
          </button>
          {email && emailSent && !emailError && emailAvailable && (
            <p className="text-info">√ An email containing activation key has been sent to your registered email</p>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content">Activation Key</span>
          </label>
          <div className="border border-base-300 rounded-xl w-full px-2 my-1">
            <OTPInput
              value={licenseKey}
              onChange={handleLicenseKeyChange}
              maxLength={25}
              minLength={16}
              disabled={false}
              containerClassName="flex gap-2"
              render={({ slots }) => (
                <>
                  <div className="flex flex-auto">
                    {slots.slice(0, 4).map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>

                  <FakeDash />

                  <div className="flex flex-auto">
                    {slots.slice(4, 8).map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>

                  <FakeDash />

                  <div className="flex flex-auto">
                    {slots.slice(8, 12).map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>

                  <FakeDash />

                  <div className="flex flex-auto">
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
            <span className="label-text text-base-content">Password</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full my-1"
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError && <p className="text-error whitespace-pre-line">{passwordError}</p>}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content">Confirm Password</span>
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            className="input input-bordered w-full my-1"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (password && e.target.value !== password) {
                <p className="text-error">Passwords do not match</p>;
              }
            }}
          />
          {confirmPassword && password !== confirmPassword && <p className="text-error">Passwords do not match</p>}
        </div>
        <div className="form-control ">
          <button
            type="submit"
            className={`btn btn-primary text-primary-content w-full ${loading ? "loading" : ""}`}
            disabled={loading}
            onClick={(e) => {
              if (!username || !email || !password || !confirmPassword || !licenseKey) {
                e.preventDefault();
                setUsernameError("Username is required.");
                setEmailError("Email is required.");
                setError("Confirm Password is required.");
                setError("Activation Key is required.");
                return;
              }
              if (usernameError || emailError || passwordError || password !== confirmPassword) {
                e.preventDefault();
                return;
              }
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
        <div className="form-control">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-secondary w-full bg-base-200 text-base-content border-none"
          >
            Back
          </button>
        </div>
      </div>
    </form>
  );
}
