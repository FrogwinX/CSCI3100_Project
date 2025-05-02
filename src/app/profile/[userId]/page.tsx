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
    <div className="flex h-fit min-h-full w-full">
      {/* Left column */}
      <div className="hidden lg:flex w-1/6"></div>

      {/* Middle column - main content */}
      <div className="flex flex-grow flex-col w-full lg:w-4/6 bg-base-100 min-h-full px-8 py-4">
        <UserInfo profile={userProfile} />
        <PostCommentTab profile={userProfile} userIdTo={params.userId} />
      </div>

      {/* Right column */}
      <div className="hidden lg:flex w-1/6"></div>
    </div>
  );
}
