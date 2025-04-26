import { Metadata } from "next";
import UserInfo from "@/components/profiles/UserSection";
import { getProfileContent } from "@/utils/profiles";
import { cache } from "react";
import { notFound } from "next/navigation";
import PostCommentTab from "@/components/profiles/PostCommentTab";

type Params = Promise<{ userId: string }>;

export const metadata: Metadata = {
  title: `Profile | FlowChat`,
  description: "Browse the user profile information.",
};

export default async function profilePage(props: { params: Params }) {
  const params = await props.params;
  const getUserProfile = cache(() => {
    return getProfileContent(params.userId);
  });

  const userProfile = await getUserProfile();
  if (userProfile === null) {
    notFound();
  }

  return (
    <div className="flex h-fit min-h-full w-full gap-x-2 md:px-32">
      {/* Left column - conditionally rendered back button */}
      <div className="hidden lg:flex w-1/6 flex-col items-end pt-4 pr-4 sticky h-fit"></div>

      {/* Middle column - main content */}
      <div className="flex-grow w-full lg:w-4/6">
        <div className="bg-base-100 min-h-full">
          <div className="w-full">
            <div className="card-body p-6 gap-10">
              {/* <label className="label">
                <span className="label-text text-base-content text-4xl">My Profile</span>
              </label> */}
              <UserInfo profile={userProfile}/>
              <PostCommentTab profile={userProfile} userIdTo={params.userId}/>
            </div>
          </div>
        </div>
      </div>

      {/* Right column - conditionally rendered action menu */}
      <div className="hidden md:block w-1/6"></div>
    </div>
  );
}
