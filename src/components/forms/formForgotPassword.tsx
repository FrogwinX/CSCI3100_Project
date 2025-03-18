"use client";
import React, { FormEvent, useState, useEffect } from "react";
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
        focus:outline-none
        focus:border-base-300
      `}
    >
      <div className="absolute bottom+0 left-0 right-0 text-center text-base-300 text-2xl">__</div>
      <div className="opacity-100 text-2xl">{props.char ?? ""}</div>
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

export default function ForgotPasswordPage() {
  const [serverErrorMessage, setServerErrorMessage] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [AuthCode, setAuthCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [emailSent, setEmailSent] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);

  const [passwordFormatError, setPasswordFormatError] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const router = useRouter();
  const { requestAuthCode, checkEmailUnique, resetPasswordByEmail } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (cooldownSeconds > 0) {
      timer = setInterval(() => {
        setCooldownSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldownSeconds]);

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setFailure(false);
    setLoading(true);
    try {
      const result = await resetPasswordByEmail(email, AuthCode, password);
      if (result.data.username && result.data.isSuccess) {
        setFailure(false);
        setLoading(false);
        router.push("/login");
      } else {
        setServerErrorMessage(result.message);
        setErrors((prevErrors) => [result.message, ...prevErrors]);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setLoading(false);
        setFailure(true);
      }
    } catch {}
  };

  const clearServerError = () => {
    if (serverErrorMessage) {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== serverErrorMessage));
      setServerErrorMessage("");
    }
  };

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    clearServerError();
    const newEmail = e.target.value;
    if (newEmail) {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== "Email is required"));
      if (newEmail.length > 100) {
        setErrors((prevErrors) => ["Email cannot exceed 100 characters", ...prevErrors]);
        setEmailAvailable(false);
        setEmailSent(false);
        return;
      } else {
        setErrors((prevErrors) => prevErrors.filter((error) => error !== "Email cannot exceed 100 characters"));
      }
      setEmail(newEmail);

      const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailFormat.test(newEmail)) {
        setEmailAvailable(false);
        setErrors((prevErrors) => ["Invalid email format", ...prevErrors]);
        setEmailSent(false);
        return;
      } else {
        setErrors((prevErrors) => prevErrors.filter((error) => error !== "Invalid email format"));
      }
      const result = await checkEmailUnique(newEmail);
      if (result.data.isEmailUnique) {
        setEmailAvailable(false);
        setErrors((prevErrors) => ["This Email has not registered", ...prevErrors]);
        setEmailSent(false);
      } else {
        //not unique == email is registered
        setEmailAvailable(true);
        setErrors((prevErrors) => prevErrors.filter((error) => error !== "This Email has not registered"));
      }
    } else {
      //field is empty
      setEmailAvailable(false);
      setErrors((prevErrors) => ["Email is required", ...prevErrors]);
      setEmailSent(false);
      setEmail(newEmail);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearServerError();
    const newPassword = e.target.value;
    if (!newPassword) {
      setErrors((prevErrors) => ["Password is required", ...prevErrors]);
      setPassword(newPassword);
      return;
    } else {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== "Password is required"));
    }

    if (newPassword.length > 50) {
      setErrors((prevErrors) => ["Password cannot exceed 50 characters", ...prevErrors]);
      return;
    } else {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== "Password cannot exceed 50 characters"));
    }

    setPassword(newPassword);

    const passwordCriteria = /^(?=.*[A-Za-z])(?=.*\d)(?!.*\s).{8,}$/;
    if (!passwordCriteria.test(newPassword)) {
      setPasswordFormatError(true);
    } else {
      setPasswordFormatError(false);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearServerError();
    const newConfirmPassword = e.target.value;
    if (!newConfirmPassword) {
      setErrors((prevErrors) => ["Confirm password is required", ...prevErrors]);
      setConfirmPassword(newConfirmPassword);
      return;
    } else {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== "Confirm password is required"));
    }
    if (newConfirmPassword !== password) {
      setErrors((prevErrors) => ["Passwords do not match", ...prevErrors]);
    } else {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== "Passwords do not match"));
    }
    setConfirmPassword(newConfirmPassword);
  };

  const handleSendAuthenticationCode = async () => {
    try {
      console.log("Sending activation key to", email);
      await requestAuthCode(email);
      setEmailSent(true);
      setCooldownSeconds(60);
      console.log("Activation key sent to", email);
      setErrors((prevErrors) =>
        prevErrors.filter((error) => error !== "Failed to send activation key. Please try again.")
      );
    } catch (error) {
      console.error("Error sending activation key:", error);
      setErrors((prevErrors) => ["Failed to send activation key. Please try again.", ...prevErrors]);
    }
  };

  const handleAuthCodeChange = (value: string) => {
    clearServerError();
    if (value.length === 0) {
      setErrors((prevErrors) => ["Authentication code is required", ...prevErrors]);
    } else {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== "Authentication code is required"));
    }
    const cleanedValue = value.replace(/[\s-]/g, "").slice(0, 6);
    setAuthCode(cleanedValue);
  };

  return (
    <form className="card w-full min-w-sm lg:min-w-lg max-w-xl bg-base-100 shadow-xl" onSubmit={handleForgotPassword}>
      <div className="card-body gap-4">
        <div
          role="alert"
          className={`alert alert-error alert-soft ${passwordFormatError || errors.length ? "" : "invisible"}`}
        >
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-2xl text-error" />
          {passwordFormatError ? (
            <p>
              Password must be at least 8 characters, with <br /> At least one alphabet (a~z, A~Z)
              <br /> At least one numerical character (0~9)
            </p>
          ) : (
            <p>{errors[0]}</p>
          )}
        </div>

        <h1 className="card-title text-center text-4xl ">Forgot Password</h1>

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
          {email && emailAvailable && <p className="text-info">√ This Email is available</p>}
        </div>

        <div className="form-control">
          <button
            type="button"
            onClick={() => {
              if (!email) {
                setErrors((prevErrors) => ["Email is required", ...prevErrors]);
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else if (emailAvailable && cooldownSeconds === 0) {
                handleSendAuthenticationCode();
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="btn btn-secondary w-fit bg-base-200 text-base-content border-none"
            disabled={cooldownSeconds > 0}
          >
            Send Authentication Code
          </button>
          {email && emailSent && emailAvailable && cooldownSeconds > 0 && (
            <p className="text-info">
              √ An email containing authentication code has been sent to your registered email, you may resend in{" "}
              {cooldownSeconds}s
            </p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content">Authentication Code</span>
          </label>
          <div className="border border-base-300 rounded-xl w-full max-w-xs my-1">
            <OTPInput
              value={AuthCode}
              onChange={handleAuthCodeChange}
              maxLength={9}
              minLength={6}
              disabled={false}
              containerClassName="flex gap-2"
              render={({ slots }) => (
                <>
                  <div className="flex flex-auto">
                    {slots.slice(0, 3).map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>

                  <FakeDash />

                  <div className="flex flex-auto">
                    {slots.slice(3, 6).map((slot, idx) => (
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
            onChange={handleConfirmPasswordChange}
          />
        </div>

        <div className="form-control">
          <button
            type="submit"
            className={`btn btn-primary text-primary-content w-full `}
            onClick={(e) => {
              if (errors.length) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
              }
              if (!email) {
                e.preventDefault();
                setErrors((prevErrors) => ["Email is required", ...prevErrors]);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
              }
              if (!password) {
                e.preventDefault();
                setErrors((prevErrors) => ["Password is required", ...prevErrors]);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
              }
              if (!confirmPassword) {
                e.preventDefault();
                setErrors((prevErrors) => ["Confirm password is required", ...prevErrors]);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
              }
              if (password !== confirmPassword) {
                e.preventDefault();
                setErrors((prevErrors) => ["Passwords do not match", ...prevErrors]);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
              }
              if (!AuthCode) {
                e.preventDefault();
                setErrors((prevErrors) => ["Authentication code is required", ...prevErrors]);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
              }
            }}
          >
            {loading ? "Resetting Password " : failure ? "Retry" : "Reset Password"}
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
