"use server";

import { getSession } from "@/utils/sessions";

export interface Profile {
  userId: string;
  username: string;
  description: string;
  avatar: string | null;
  updatedAt: string;
  postCount: string;
  commentCount: string;
  followingCount: string;
  followerCount: string;
  likeCount: string;
  dislikeCount: string
  isUserBlocked: boolean;
}

interface ProfileContentResponse {
  message: string;
  data: {
    isSuccess: boolean;
    profile: Profile;
  };
}

export async function getProfileContent(userIdTo : string): Promise<Profile | null> {
  try {
    const session = await getSession();
    let apiUrl = `https://flowchatbackend.azurewebsites.net/api/Profile/getProfileContent?userIdFrom=${session.userId}`;

    if (userIdTo === "0") {
      apiUrl += `&userIdTo=${session.userId}`;
    } else {
      apiUrl += `&userIdTo=${userIdTo}`;
    }
    
    const response = await fetch(apiUrl, {
      headers: {
        method: "GET",
        Authorization: `Bearer ${session.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network Error");
    }

    const data: ProfileContentResponse = await response.json();
    if (!data.data.isSuccess) {
      throw new Error("Server does not respond successfully");
    }

    return data.data.profile;

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}