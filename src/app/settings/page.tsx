import { Metadata } from "next";
import UserInfo from "@/components/settings/UserSection";
import ChangePassword from "@/components/settings/ChangePasswordSection";
import DeleteAccount from "@/components/settings/DeleteAccountSection";
import { getSession } from "@/utils/sessions";

export const metadata: Metadata = {
  title: "Settings | FlowChat",
  description: "Browse the user account settings.",
};

export default async function SettingPage() {


  return (
    <div className="flex h-fit min-h-full w-full gap-x-2 md:px-32">
      {/* Left column - conditionally rendered back button */}
      <div className="hidden lg:flex w-1/6 flex-col items-end pt-4 pr-4 sticky h-fit"></div>

      {/* Middle column - main content */}
      <div className="flex-grow w-full lg:w-4/6">
        <div className="bg-base-100 min-h-full">
          <div className="w-full">
            <div className="card-body p-6 gap-10">
              <label className="label">
                <span className="label-text text-base-content text-2xl">Settings</span>
              </label>
              <UserInfo/>
              <ChangePassword/>
              <DeleteAccount/>
            </div>
          </div>
        </div>
      </div>

      {/* Right column - conditionally rendered action menu */}
      <div className="hidden md:block w-1/6"></div>
    </div>
  );
}
