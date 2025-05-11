import { notFound } from "next/navigation";
import { cache } from "react";
import { Metadata } from "next";
import { getProfileContent } from "@/utils/profiles";
import UserInfo from "@/components/profiles/UserSection";
import PostCommentTab from "@/components/profiles/PostCommentTab";
import UserRelationsTab from "@/components/profiles/UserRelationsTab";

// Define valid relation sections
const validRelationSections = ["following", "followers", "blocked"] as const;
type UserRelationType = (typeof validRelationSections)[number];

export const metadata: Metadata = {
  title: `Profile | FlowChat`,
  description: "Browse the user profile information.",
};

const getUserProfile = cache((userId: string) => {
  return getProfileContent(userId);
});

type PageURLParams = {
  userId: string;
  profileSection?: string[];
};

export default async function ProfileSectionPage(props: {
  params: Promise<PageURLParams>;
}) {
  const params = await props.params;
  const { userId, profileSection } = params;
  const section = profileSection?.[0];

  const userProfile = await getUserProfile(userId);

  // Decide which section to show based on the URL
  let sectionContent;

  if (section && validRelationSections.includes(section as UserRelationType)) {
    sectionContent = <UserRelationsTab userId={userId} Section={section as UserRelationType} />;
  } else if (!section && userProfile) {
    // Default to showing the user's profile and posts/comments if no section is specified
    sectionContent = (
      <>
        <UserInfo profile={userProfile} />
        <PostCommentTab profile={userProfile} userIdTo={userId} />
      </>
    );
  } else {
    notFound();
  }

  return <>{sectionContent}</>;
}
