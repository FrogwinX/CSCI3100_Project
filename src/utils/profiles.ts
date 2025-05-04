"use server";

import { getSession } from "@/utils/sessions";

export interface Profile {
  userId: string;
  username: string;
  description: string;
  avatar: string | null;
  updatedAt: string;
  postCount: number;
  commentCount: number;
  followingCount: number;
  followerCount: number;
  likeCount: number;
  dislikeCount: number;
  isUserBlocked: boolean;
  isUserFollowed: boolean;
}

interface ProfileContentResponse {
  message: string;
  data: {
    isSuccess: boolean;
    profile: Profile;
  };
}

interface UpdateProfileResponse {
  message: string;
  data: {
    isSuccess: boolean;
    username: string;
    description: string;
    avatar: string;
  };
}

export async function getProfileContent(userIdTo: string): Promise<Profile | null> {
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

export async function updateProfile(username: string, description: string, avatar: File | null): Promise<void> {
  try {
    const session = await getSession();
    let apiUrl = `https://flowchatbackend.azurewebsites.net/api/Profile/updatePersonalProfile`;

    const requestBody = (username === session.username ?
      {
        userId: session.userId,
        description: description,
      }
      :
      {
        userId: session.userId,
        username: username,
        description: description,
      }
    );

    const formData = new FormData();
    const requestBodyBlob = new Blob([JSON.stringify(requestBody)], { type: "application/json" });
    formData.append("requestBody", requestBodyBlob);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network Error");
    }

    const data: UpdateProfileResponse = await response.json();
    if (!data.data.isSuccess) {
      throw new Error(`${data.message}`);
    }

    const newSession = await getSession();
    newSession.userId = session.userId;
    newSession.username = data.data.username;
    newSession.roles = session.roles;
    newSession.isLoggedIn = true;
    newSession.token = session.token;
    newSession.avatar = data.data.avatar;
    newSession.email = session.email;
    await newSession.save();

  } catch (error) {
    console.error("Error in updating user profile:", error);
  }
}

export async function userInteract(userIdTo: string,
  interaction: "follow" | "unfollow" | "block" | "unblock"
): Promise<boolean | null> {
  try {
    const isRemoveAction = interaction === "unfollow" || interaction === "unblock";
    const session = await getSession();

    let apiUrl = `https://flowchatbackend.azurewebsites.net/api/Profile/${interaction}User`;

    const response = await fetch(apiUrl, {
      method: isRemoveAction ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({
        userIdFrom: session.userId,
        userIdTo: userIdTo,
      }),
    });

    if (!response.ok) {
      throw new Error("Network Error");
    }

    const data = await response.json();
    if (!data.data.isSuccess) {
      throw new Error("Server does not respond successfully");
    }

    return data.data.isSuccess;

  } catch (error) {
    console.error(`Error in ${interaction} interaction api call:`, error);
    return null;
  }
}