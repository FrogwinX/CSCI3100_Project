"use client";

import { useState } from "react";
import ChangePasswordSection from "@/components/forms/formChangePassword"

export default function ChangePassword() {

  const [isPasswordInputBoxOpen, setPasswordInputBoxOpen] = useState<boolean>(false);

  return (
    <div className="card-body p-0 gap-2">
      <div className="flex gap-4 items-center">
        <div className="card-body p-0 gap-2">
          <h3 className="text-xl font-bold">Change Password</h3>
          <p className="text-base-content/70">Strengthen your account by setting a stronger password.</p>
        </div>
        <div>
          <button
            className={isPasswordInputBoxOpen ? "btn btn-basic" : "btn btn-primary"}
            onClick={(): void => {
              setPasswordInputBoxOpen((prev) => !prev);
            }}>
            Change Password
          </button>
        </div>
      </div>
      <div className={isPasswordInputBoxOpen ? "" : "hidden"}>
        <ChangePasswordSection />
      </div>
      <div className="divider my-0"></div>
    </div>
  );
}
