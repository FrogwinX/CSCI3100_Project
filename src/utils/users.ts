"use server";
import { getSession } from "@/utils/sessions";
import { Users } from "@/components/users/UserPreview";

interface UsersPreviewResponse {
  message: string;
  data: {
    isSuccess: boolean;
    userPreviewList: Users[];
  };
}

//to be implemented
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

    apiUrl += `&postNum=${options.count || 10}`;

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
      profileImage: user.profileImage,
    }));

    return users;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
}
