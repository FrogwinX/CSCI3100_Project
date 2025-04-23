"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/settings/ConfirmDeleteAccountDialog"

export default function DeleteAccount() {

  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

  return (
    <div className="card-body p-0 gap-2">
      <div className="flex gap-4 items-center">
        <div className="card-body p-0 gap-2">
          <h3 className="text-xl text-red-500 font-bold">Delete Account</h3>
          <p className="text-base-content/70">Once you delete your account, you cannot retrieve it. Please be certain.</p>
        </div>
        <div>
          <button
            className="btn btn-error"
            onClick={(): void => {
              setConfirmDialogOpen(true);
            }}>
            Delete Account
          </button>
          <div className={isConfirmDialogOpen ? "" : "hidden"}>
            <ConfirmDialog setConfirmDialogOpen={setConfirmDialogOpen}/>
          </div>
        </div>
      </div>
      <div className="divider my-0"></div>
    </div>
  );
}
