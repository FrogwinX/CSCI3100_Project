"use server";

import { getSession } from "@/utils/sessions";
import { Users } from "@/utils/users";
import { match } from "assert";

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
  };
}

interface GetRelationListResponse {
  message: string;
  data: {
    isSuccess: boolean;
    userList: Users[];
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

export async function updateProfile(username: string, description: string): Promise<void> {
  try {
    const session = await getSession();
    let apiUrl = `https://flowchatbackend.azurewebsites.net/api/Profile/updatePersonalProfile`;

    const requestBody = {
      userId: session.userId,
      username: username,
      description: description,
    };

    const formData = new FormData();
    const requestBodyBlob = new Blob([JSON.stringify(requestBody)], { type: "application/json" });
    formData.append("requestBody", requestBodyBlob);

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
      throw new Error("Server does not respond successfully");
    }
  } catch (error) {
    console.error("Error in updating user profile:", error);
  }
}

export async function userInteract(
  userIdTo: string,
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

export async function getUserRelations(options: {
  userIdTo: string;
  relationship: "following" | "followers" | "blocked";
  excludingUserIdList?: number[];
  count?: number;
}): Promise<Users[] | null> {
  try {
    const session = await getSession();

    let apiUrl = `https://flowchatbackend.azurewebsites.net/api/Profile/`;

    switch (options.relationship) {
      case "following":
        apiUrl += `getMyFollowingList?`;
        break;
      case "followers":
        apiUrl += `getMyFollowerList?`;
        break;
      case "blocked":
        apiUrl += `getMyBlockingList?`;
        break;
    }

    // Add query parameters
    apiUrl += `userId=${session.userId}`; // Add userId to the URL
    if (options.excludingUserIdList) {
      while (options.excludingUserIdList.length > 0) {
        apiUrl += `&excludingUserIdList=${options.excludingUserIdList.shift()}`;
      }
    } else {
      //default value = 0
      apiUrl += `&excludingUserIdList=0`;
    }

    apiUrl += `&userNum=${options.count || 10}`;

    // Fetch data from the API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch search users with status ${response.status}`);
      return null;
    }

    const data: GetRelationListResponse = await response.json();

    const users: Users[] = data.data.userList.map((user) => ({
      userId: user.userId,
      username: user.username,
      description: user.description,
      avatar: user.avatar,
      updatedAt: user.updatedAt,
      isUserBlocked: user.isUserBlocked,
      isUserFollowed: user.isUserFollowed,
    }));

    return users;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
}
