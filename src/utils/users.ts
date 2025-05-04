"use server";
import { getSession } from "@/utils/sessions";

export interface Users {
  userId: number;
  username: string;
  description: string;
  avatar: string | null;
  updatedAt: string;
  isUserBlocked: boolean;
  isUserFollowed: boolean;
}

interface UsersPreviewResponse {
  message: string;
  data: {
    isSuccess: boolean;
    userPreviewList: Users[];
  };
}

// Sample API call:
//https://flowchatbackend.azurewebsites.net/api/Forum/searchUser?
// userId=1&
// keyword=c&
// excludingUserIdList=3&
// excludingUserIdList=5&
// searchNum=10
export async function getSearchUser(
  options: {
    keyword?: string;
    excludingUserIdList?: number[];
    count?: number;
  } = {}
): Promise<Users[] | null> {
  try {
    const session = await getSession();

    let apiUrl = `https://flowchatbackend.azurewebsites.net/api/Forum/searchUser?`;
    // Add query parameters
    apiUrl += `userId=${session.userId}`; // Add userId to the URL
    apiUrl += `&keyword=${options.keyword}`; // Add keyword to the URL
    if (options.excludingUserIdList) {
      while (options.excludingUserIdList.length > 0) {
        //add all excludingPostIds to the URL
        apiUrl += `&excludingUserIdList=${options.excludingUserIdList.shift()}`;
      }
    } else {
      //default value = 0
      apiUrl += `&excludingUserIdList=0`;
    }

    apiUrl += `&searchNum=${options.count || 10}`;

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

    const data: UsersPreviewResponse = await response.json();

    const users: Users[] = data.data.userPreviewList.map((user) => ({
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

export async function followUser(userIdTo: number): Promise<boolean> {
  try {
    const session = await getSession();

    const response = await fetch("https://flowchatbackend.azurewebsites.net/api/Profile/followUser", {
      method: "POST",
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
      console.error(`Failed to follow user with status ${response.status}`);
      return false;
    }

    const data = await response.json();
    if (!data.isSuccess) {
      console.error(`Failed to follow user: ${data.message}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error following user:", error);
    return false;
  }
}

export async function unfollowUser(userIdTo: number): Promise<boolean> {
  try {
    const session = await getSession();

    const response = await fetch("https://flowchatbackend.azurewebsites.net/api/Profile/unfollowUser", {
      method: "DELETE",
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
      console.error(`Failed to unfollow user with status ${response.status}`);
      return false;
    }

    const data = await response.json();
    if (!data.isSuccess) {
      console.error(`Failed to unfollow user: ${data.message}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return false;
  }
}
