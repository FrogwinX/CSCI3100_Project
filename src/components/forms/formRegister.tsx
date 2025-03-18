"use client";
import React, { useEffect, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { OTPInput, SlotProps } from "input-otp";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Slot(props: SlotProps) {
  return (
    <div className={`relative w-4 h-10 flex items-center justify-center flex-auto transition-all duration-300`}>
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
  const [success, setSuccess] = useState(false);
  const [sercerSuccessMessage, setServerSuccessMessage] = useState<string>("");
  const [serverErrorMessage, setServerErrorMessage] = useState<string>("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [loading, setLoading] = useState(false);
  // Using the same error implementation as formLogin.tsx
  const [failure, setFailure] = useState(false);
  const [passwordFormatError, setPasswordFormatError] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [emailSent, setEmailSent] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const router = useRouter();
  const { requestLicenseKey, register, checkUsernameUnique, checkEmailUnique } = useAuth();

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

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setFailure(false);
    setLoading(true);
    try {
      const result = await register(username, email, password, licenseKey);
      if (result.data.user && result.data.isSuccess) {
        setServerSuccessMessage(result.message);
        setFailure(false);
        setLoading(false);
        setSuccess(true);
      } else {
        setSuccess(false);
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

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    clearServerError();
    const newUsername = e.target.value;
    if (newUsername.length > 50) {
      setErrors((prevErrors) => ["Username cannot exceed 50 characters", ...prevErrors]);
      setUsernameAvailable(false);
      return;
    } else {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== "Username cannot exceed 50 characters"));
    }

    if (newUsername.includes("@") || newUsername.includes(" ") || newUsername.includes(":")) {
      setErrors((prevErrors) => ["Username cannot contain the symbol :, @ or space", ...prevErrors]);
      setUsernameAvailable(false);
      setUsername(newUsername);
      return;
    } else {
      setErrors((prevErrors) =>
        prevErrors.filter((error) => error !== "Username cannot contain the symbol :, @ or space")
      );
    }

    setUsername(newUsername);
    if (newUsername) {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== "Username is required"));
      const result = await checkUsernameUnique(newUsername);
      if (result.data.isUsernameUnique) {
        setUsernameAvailable(true);
        setErrors((prevErrors) => prevErrors.filter((error) => error !== "This username has been used"));
      } else {
        setUsernameAvailable(false);
        setErrors((prevErrors) => ["This username has been used", ...prevErrors]);
      }
    } else {
      setUsernameAvailable(false);
      setErrors((prevErrors) => ["Username is required", ...prevErrors]);
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
        setEmailAvailable(true);
        setErrors((prevErrors) => prevErrors.filter((error) => error !== "This Email has been used"));
      } else {
        setEmailAvailable(false);
        setErrors((prevErrors) => ["This Email has been used", ...prevErrors]);
        setEmailSent(false);
      }
    } else {
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

  const handleSendActivationKey = async () => {
    try {
      console.log("Sending activation key to", email);
      await requestLicenseKey(email);
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

  const handleLicenseKeyChange = (value: string) => {
    clearServerError();
    if (value.length === 0) {
      setErrors((prevErrors) => ["Licence key is required", ...prevErrors]);
    } else {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== "Licence key is required"));
    }
    const cleanedValue = value.replace(/[\s-]/g, "").slice(0, 16);
    setLicenseKey(cleanedValue);
  };

  return (
    <form className="card w-fit min-w-sm lg:min-w-lg max-w-xl bg-base-100 shadow-xl" onSubmit={handleRegister}>
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

        <h1 className="card-title text-center text-4xl ">Register</h1>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content">Username</span>
          </label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            className="input input-bordered w-full my-1"
          />
          {username && usernameAvailable && <p className="text-info">√ This Username is available</p>}
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
                handleSendActivationKey();
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="btn btn-secondary w-fit bg-base-200 text-base-content border-none"
            disabled={cooldownSeconds > 0}
          >
            Send Activation Key
          </button>
          {email && emailSent && emailAvailable && cooldownSeconds > 0 && (
            <p className="text-info">
              √ An email containing activation key has been sent to your provided email, you may resend in{" "}
              {cooldownSeconds}s
            </p>
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
          {/* {passwordFormatError && <p className="text-error">{passwordFormatError}</p>} */}
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
              if (!username) {
                e.preventDefault();
                setErrors((prevErrors) => ["Username is required", ...prevErrors]);
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
              if (!licenseKey) {
                e.preventDefault();
                setErrors((prevErrors) => ["Licence key is required", ...prevErrors]);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
              }
            }}
          >
            {loading ? "Creating Account" : failure ? "Retry" : "Create Account"}
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
