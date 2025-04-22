"use client";

import { useState } from "react";
import { User } from "./User";
import ChangePasswordSection from "@/components/forms/formChangePassword"

export default function ChangePassword({ user }: { user: User }) {

  const [isPasswordInputBoxOpen, setPasswordInputBoxOpen] = useState<boolean>(false);

  const togglePasswordInputBox = (): void => {
    setPasswordInputBoxOpen((prev) => !prev);
  };

  return (
    <div className="card-body p-0 gap-2">
      <div className="flex gap-4 items-center">
        <div className="card-body p-0 gap-2">
          <h3 className="text-xl font-bold">Change Password</h3>
          <p className="text-base-content/70">Strengthen your account by setting a stronger password.</p>
        </div>
        <div>
          <button className={isPasswordInputBoxOpen ? "btn btn-basic" : "btn btn-primary"}  onClick={togglePasswordInputBox}>
            Change Password
          </button>
        </div>
      </div>
      <div className={isPasswordInputBoxOpen ? "" : "hidden"}>
        <ChangePasswordSection/>
      </div>
      <div className="divider my-0"></div>
    </div>
  );
}
