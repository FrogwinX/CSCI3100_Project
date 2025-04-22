"use client";

import {User} from "./User";

export default function DeleteAccount({ user }: { user: User }) {

  const handleClick = () => {
    const confirmAction = window.confirm("Are you sure you want to delete your account?");
    if (confirmAction) {
      
    } else {

    }
  };

  return (
    <div className="card-body p-0 gap-2">
      <div className="flex gap-4 items-center">
        <div className="card-body p-0 gap-2">
          <h3 className="text-xl text-red-500 font-bold">Delete Account</h3>
          <p className="text-base-content/70">Once you delete your account, you cannot retrieve it. Please be certain.</p>
        </div>
        <div>
          <button className="btn btn-error" onClick={handleClick} >
            Delete Account
          </button>
        </div>
      </div>
      <div className="divider my-0"></div>
    </div>
  );
}
