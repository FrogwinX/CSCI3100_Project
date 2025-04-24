"use client";
import React, { FormEvent, useState } from "react";
import { faTriangleExclamation, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { resetPasswordByOldPassword } from "@/utils/authentication";
import { useSession } from "@/hooks/useSession";

export default function ChangePasswordSection({ setPasswordInputBoxOpen }: { setPasswordInputBoxOpen: (value: boolean) => void }) {
  const [success, setSuccess] = useState(false);
  const [serverSuccessMessage, setServerSuccessMessage] = useState<string>("");
  const [serverErrorMessage, setServerErrorMessage] = useState<string>("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [passwordFormatError, setPasswordFormatError] = useState(false);

  const { session } = useSession();

  const wait = (s: number) => {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
  };

  const clearForm = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setFailure(false);
    setLoading(true);
    try {
      if (session.email === undefined) {
        throw new Error("user email is undefined");
      }
      const formData = new FormData();
      formData.append("email", session.email)
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);
      const result = await resetPasswordByOldPassword(formData);
      if (result.data.username && result.data.isSuccess) {
        setFailure(false);
        setLoading(false);
        setSuccess(true);
        setServerSuccessMessage(result.message);
        clearForm();
        await wait(3);
        setServerSuccessMessage("");
        setPasswordInputBoxOpen(false);
        setSuccess(false);
        clearServerError();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setServerErrorMessage(result.message);
        setErrors((prevErrors) => [result.message, ...prevErrors]);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setLoading(false);
        setFailure(true);
      }
    } catch { }
  };

  const clearServerError = () => {
    if (serverErrorMessage) {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== serverErrorMessage));
      setServerErrorMessage("");
    }
  };

  const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearServerError();
    const newOldPassword = e.target.value;
    if (!newOldPassword) {
      setErrors((prevErrors) => ["Password is required", ...prevErrors]);
      setOldPassword(newOldPassword);
      return;
    } else {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== "Password is required"));
    }

    setOldPassword(newOldPassword);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearServerError();
    const newNewPassword = e.target.value;
    if (!newNewPassword) {
      setErrors((prevErrors) => ["Password is required", ...prevErrors]);
      setNewPassword(newNewPassword);
      return;
    } else {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== "Password is required"));
    }

    if (newNewPassword.length > 50) {
      setErrors((prevErrors) => ["Password cannot exceed 50 characters", ...prevErrors]);
      return;
    } else {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== "Password cannot exceed 50 characters"));
    }

    setNewPassword(newNewPassword);

    const passwordCriteria = /^(?=.*[A-Za-z])(?=.*\d)(?!.*\s).{8,}$/;
    if (!passwordCriteria.test(newNewPassword)) {
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
    if (newConfirmPassword !== newPassword) {
      setErrors((prevErrors) => ["Passwords do not match", ...prevErrors]);
    } else {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== "Passwords do not match"));
    }
    setConfirmPassword(newConfirmPassword);
  };

  return (
    <div
      className="fixed inset-0 bg-gray-500/20 flex justify-center items-center z-50">
      <div
        className="fixed inset-0"
        onClick={(): void => {
          setPasswordInputBoxOpen(false);
        }}
      >
      </div>

      <form className={`card w-fit min-w-sm lg:min-w-lg max-w-xl bg-base-100 shadow-xl`} onSubmit={handleForgotPassword}>
        <div className={`card-body gap-4"`}>

          <h1 className="card-title text-center text-bg">Change Your Password</h1>

          {success && !errors.length ? (
            <div role="alert" className="alert alert-success alert-soft">
              <FontAwesomeIcon icon={faCheck} className="text-2xl text-success" />
              <p>{serverSuccessMessage}</p>
            </div>
          ) : (
            <div
              role="alert"
              className={`alert alert-error alert-soft ${passwordFormatError || errors.length ? "" : "hidden"}`}
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
          )}

          <div className="divider my-0"></div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">Old Password</span>
            </label>
            <input
              type="password"
              placeholder="Old Password"
              className="input input-bordered w-full my-1"
              value={oldPassword}
              onChange={handleOldPasswordChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">New Password</span>
            </label>
            <input
              type="password"
              placeholder="New Password"
              className="input input-bordered w-full my-1"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">Confirm New Password</span>
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
                if (!oldPassword) {
                  e.preventDefault();
                  setErrors((prevErrors) => ["Old Password is required", ...prevErrors]);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  return;
                }
                if (!newPassword) {
                  e.preventDefault();
                  setErrors((prevErrors) => ["New Password is required", ...prevErrors]);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  return;
                }
                if (!confirmPassword) {
                  e.preventDefault();
                  setErrors((prevErrors) => ["Confirm password is required", ...prevErrors]);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  return;
                }
                if (newPassword !== confirmPassword) {
                  e.preventDefault();
                  setErrors((prevErrors) => ["Passwords do not match", ...prevErrors]);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  return;
                }
              }}
            >
              {loading ? (
                <span className="loading loading-dots loading-md bg-base-content"></span>
              ) : failure ? (
                "Retry"
              ) : (
                "Reset Password"
              )}
            </button>
          </div>

          <div className={`form-control mt-2`}>
            <button
              type="button"
              className="btn btn-secondary w-full bg-base-300 text-base-content border-none"
              onClick={(): void => {
                setPasswordInputBoxOpen(false);
                clearForm();
                setFailure(false);
                setPasswordFormatError(false);
                clearServerError();
                setErrors([]);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
