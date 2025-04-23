"use client";

import { useSession } from "@/hooks/useSession";
import { deleteAccount, login, logout } from "@/utils/authentication";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clear } from "console";

export default function ConfirmDialog({ setConfirmDialogOpen }: { setConfirmDialogOpen: (value: boolean) => void }) {

  const [loading, setLoading] = useState<boolean>(false);
  const [UsernameOrEmail, setUserInput] = useState("");
  const [password, setPassword] = useState("");
  const [isAccountDeleted, setAccountDeleted] = useState(false);
  const [isPasswordCorrect, setPasswordCorrect] = useState(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const { session, refresh } = useSession();

  const router = useRouter();

  const wait = (s: number) => {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
  };

  const clearForm = () => {
    setUserInput("");
    setPassword("");
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData();

    if (UsernameOrEmail.includes("@")) {
      formData.append("email", UsernameOrEmail);
    } else {
      formData.append("username", UsernameOrEmail);
    }

    formData.append("password", password);

    try {
      const result = await deleteAccount(formData);
      setLoading(false);
      if (result.data.isSuccess) {
        setPasswordCorrect(true);
        setAccountDeleted(true);
        logout();
        await wait(5);
        router.replace("/login");
        await refresh();
      } else {
        setPasswordCorrect(false);
        setPassword("");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch { }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    if ((e.target.value === session.username || e.target.value === session.email) && password) {
      setIsSubmitDisabled(false)
    } else {
      setIsSubmitDisabled(true)
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value && (UsernameOrEmail === session.username || UsernameOrEmail === session.email)) {
      setIsSubmitDisabled(false)
    } else {
      setIsSubmitDisabled(true)
    }
  };


  return (
    <div
      className="fixed inset-0 bg-gray-500/20 flex justify-center items-center z-50">
      <div
        className="fixed inset-0"
        onClick={(): void => {
          setConfirmDialogOpen(false);
          clearForm();
        }}
      >
      </div>
      <form className={`card w-fit min-w-sm lg:min-w-lg max-w-xl bg-base-100 shadow-xl`} onSubmit={handleLogin}>
        <div className={`card-body gap-4"`}>

          <h1 className="card-title text-center text-bg">{isAccountDeleted? 'Your Account has been deleted':'Delete Your Account'}</h1>

          <div role="alert" className={`alert alert-error alert-soft`}>
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-2xl" />
            <span className="label-text text-base-content text-red-500 font-bold"> You CANNOT undo this operation. </span>
          </div>

          <div className="card-body p-0 gap-4">
            <p className="text-base-content">
              We will immediately delete your account, meaning that you cannot use FlowChat services with this account afterward.
            </p>
            <p className="text-base-content">
              However, all your posts, comments, chat records and user profile will still be anonymously visible to other users.
            </p>
            <p className={`text-base-content ${isAccountDeleted? 'hidden':''}`}>
              Please input your login information to confirm to delete your account.
            </p>
          </div>

          <div className="divider my-0"></div>

          <div className={`form-control ${isAccountDeleted? 'hidden':''}`}>
            <label className="label">
              <span className="label-text text-base-content">Username / Email</span>
            </label>
            <input
              type="input"
              placeholder="Username or email"
              value={UsernameOrEmail}
              onChange={handleInputChange}
              className="input input-bordered w-full my-1"
            />
          </div>

          <div className={`form-control ${isAccountDeleted? 'hidden':''}`}>
            <label className="label">
              <span className={`label-text text-base-content ${isPasswordCorrect? '' : 'text-red-500 font-bold'}`}>Password</span>
            </label>
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="input input-bordered w-full my-1"
            />

            {isPasswordCorrect? '' : 
            <label className="label">
              <span className="label-text text-base-content text-sm text-red-500 font-bold">** Password is incorrect</span>
            </label>
            }
            
          </div>

          <div className={`form-control ${isAccountDeleted? 'hidden' : ''}`}>
            <button
              type="submit"
              className="btn btn-error w-full"
              disabled={isSubmitDisabled}
            >
              {loading ? <span className="loading loading-dots loading-md bg-base-content"></span> : "Delete Account"}
            </button>
          </div>

          <div className={`form-control mt-2 ${isAccountDeleted? 'hidden' : ''}`}>
            <button
              type="button"
              className="btn btn-secondary w-full bg-base-300 text-base-content border-none"
              onClick={(): void => {
                setConfirmDialogOpen(false);
                clearForm();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

