"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { OTPInput, SlotProps } from "input-otp";

function Slot(props: SlotProps) {
  return (
    <div
      className={`relative w-10 h-10
        flex items-center justify-center flex-auto
        transition-all duration-300
        focus:outline-none
        focus:border-base-300
      `}
    >
      <div className="absolute bottom+0 left-0 right-0 text-center text-base-300 text-2xl">
        __
      </div>
      <div className="opacity-100">{props.char ?? ""}</div>
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
}

function FakeCaret() {
  return (
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-pulse">
      <div className="w-px h-4 bg-primary"></div>
    </div>
  );
}

function FakeDash() {
  return (
    <div className="flex justify-center items-center mx-1">
      <div className="w-4 h-1 rounded-full bg-neutral-400"></div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [AuthCode, setAuthCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const { requestAuthCode, checkEmailUnique, resetPasswordByEmail } = useAuth();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await resetPasswordByEmail(email, AuthCode, password);

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

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    if (newEmail) {
      if (newEmail.length > 100) {
        setEmailError("Email cannot exceed 100 characters");
        setEmailAvailable(false);
        return;
      }
      setEmail(newEmail);

      const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (newEmail && !emailFormat.test(newEmail)) {
        setEmailAvailable(false);
        setEmailError("Invalid email format");
        return;
      } else {
        setEmailError("This Email is unregistered");
      }
      const result = await checkEmailUnique(newEmail);
      if (result.data.isEmailUnique) {
        setEmailAvailable(false);
        setEmailError("This Email is unregistered");
      } else {
        setEmailAvailable(true);
        setEmailError("");
      }
    } else {
      setEmailAvailable(false);
      setEmailError("This field is required");
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
      await requestAuthCode(email);
      setEmailSent(true);
      setError("");
    } catch (error) {
      console.error("Error sending activation key:", error);
      setError("Failed to send activation key. Please try again.");
    }
  };

  const handleAuthCodeChange = (value: string) => {
    const cleanedValue = value.replace(/[\s-]/g, "").slice(0, 6);
    setAuthCode(cleanedValue);
  };

  return (
    <form
      className="card w-full max-w-xl bg-base-100 shadow-xl"
      onSubmit={handleRegister}
    >
      <div className="card-body gap-2">
        <h1 className="card-title text-center text-4xl pt-12">
          Forgot Password
        </h1>
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content">Email Address</span>
          </label>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={handleEmailChange}
            className="input input-bordered w-full border focus:outline-none focus:border-base-300"
          />

          {emailError && <p className="text-error mt-2">{emailError}</p>}
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
              if (!emailAvailable) {
                setEmailError("This Email is unregistered");
                return;
              }
              handleSendActivationKey();
            }}
            className="btn btn-secondary w-fit bg-base-200 text-base-content border-none"
          >
            Send Authentication Code
          </button>
          {email && emailAvailable && emailSent && !emailError && (
            <p className="text-info mt-2">
              √ An email containing authentication code has been sent to your
              registered email
            </p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content">
              Authentication Code
            </span>
          </label>
        </div>

        <div className="pl-4 inline-block border border-base-300 rounded-xl w-full max-w-xs ">
          <OTPInput
            value={AuthCode}
            onChange={handleAuthCodeChange}
            maxLength={9}
            minLength={6}
            disabled={false}
            containerClassName="group flex gap-2"
            render={({ slots }) => (
              <>
                <div className="flex flex-row ">
                  {slots.slice(0, 3).map((slot, idx) => (
                    <Slot key={idx} {...slot} />
                  ))}
                </div>

                <FakeDash />

                <div className="flex flex-row">
                  {slots.slice(3, 6).map((slot, idx) => (
                    <Slot key={idx} {...slot} />
                  ))}
                </div>
              </>
            )}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content">Password</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full border focus:outline-none focus:border-base-300"
            value={password}
            onChange={handlePasswordChange}
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
            <span className="label-text text-base-content">
              Confirm Password
            </span>
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            className="input input-bordered w-full border focus:outline-none focus:border-base-300"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </div>

        {confirmPassword && password !== confirmPassword && (
          <p className="text-error">Passwords do not match</p>
        )}

        <div className="form-control mt-4">
          <button
            type="submit"
            className={`btn btn-primary text-primary-content w-full ${
              loading ? "loading" : ""
            }`}
            disabled={loading}
            onClick={(e) => {
              if (!email || !password || !confirmPassword || !AuthCode) {
                e.preventDefault();
                setEmailError("Email is required.");
                setPasswordError("Password is required.");
                return;
              }
              if (emailError || passwordError || password !== confirmPassword) {
                e.preventDefault();
                return;
              }
            }}
          >
            {loading ? "Reseting Password..." : "Reset Password"}
          </button>
        </div>

        <div className="form-control mt-2">
          <button
            type="button"
            onClick={() => (window.location.href = "/login")}
            className="btn btn-secondary w-full bg-base-200 text-base-content border-none"
          >
            Back
          </button>
        </div>
      </div>
    </form>
  );
}
