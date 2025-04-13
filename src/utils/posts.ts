"use server";

import { Post } from "@/components/posts/PostPreview";
import { getSession } from "@/utils/sessions";
// import { count } from "console";
// import exp from "constants";

// API response type for getPost
interface PostPreviewResponse {
  message: string;
  data: {
    isSuccess: boolean;
    postPreviewList: Post[];
  };
}

interface PostContentResponse {
  message: string;
  data: {
    isSuccess: boolean;
    post: Post;
  };
}

export interface Tag {
  tagId: string;
  tagName: string;
}

interface TagResponse {
  message: string;
  data: {
    isSuccess: boolean;
    tagList: Tag[];
  };
}

interface CreatePostResponse {
  message: string;
  data: any;
}

function base64ToFile(base64String: string, fileName: string): File {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
}

function extractImagesFromContent(content: string): { cleanContent: string; images: File[] } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const imgElements = doc.querySelectorAll("img");
  const images: File[] = [];
  let cleanContent = content;

  imgElements.forEach((img, index) => {
    const src = img.getAttribute("src") || "";
    if (src.startsWith("data:image")) {
      const fileName = `image-${index + 1}.png`;
      const file = base64ToFile(src, fileName);
      images.push(file);
      cleanContent = cleanContent.replace(src, fileName);
    }
  });

  return { cleanContent, images };
}

export async function getAllTags(): Promise<Tag[]> {
  try {
    const session = await getSession();
    const apiUrl = `https://flowchatbackend.azurewebsites.net/api/Forum/getAllTag`;

    // Fetch data from the API
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    // If API call fails, use mock data
    if (!response.ok) {
      console.log(`Mock tags are returned due to API request failed with status ${response.status}`);
      return [];
    }

    const data: TagResponse = await response.json();

    return data.data.tagList;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

// sample API call
// https://flowchatbackend.azurewebsites.net/api/Forum/
// getLatestPostPreviewList?
// userId=1
// &excludingPostIdList=1
// &excludingPostIdList=34
// &postNum=5
export async function getPosts(
  options: {
    filter?: "latest" | "recommended" | "following";
    excludingPostIdList?: number[];
    count?: number;
  } = {}
): Promise<Post[] | null> {
  try {
    const session = await getSession();
    // Build the API URL based on the filter
    let apiUrl = "https://flowchatbackend.azurewebsites.net/api/Forum/";
    switch (options.filter) {
      case "latest":
        apiUrl += `getLatestPostPreviewList?`;
        break;
      case "recommended":
        apiUrl += "getRecommendedPostPreviewList?";
        break;
      case "following":
        apiUrl += "getFollowingPostPreviewList?";
        break;
    }

    // Add query parameters
    apiUrl += `userId=${session.userId}`; // Add userId to the URL

    if (options.excludingPostIdList) {
      while (options.excludingPostIdList.length > 0) {
        //add all excludingPostIds to the URL
        apiUrl += `&excludingPostIdList=${options.excludingPostIdList.shift()}`;
      }
    } else {
      //default value = 0
      apiUrl += `&excludingPostIdList=0`;
    }

    apiUrl += `&postNum=${options.count || 10}`;

    // Fetch data from the API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    const data: PostPreviewResponse = await response.json();
    // Map API response to frontend Post interface
    const posts: Post[] = data.data.postPreviewList.map((post) => ({
      postId: post.postId,
      username: post.username,
      title: post.title,
      content: post.content,
      imageAPIList: post.imageAPIList,
      tagNameList: post.tagNameList,
      likeCount: post.likeCount,
      isLiked: post.isLiked,
      dislikeCount: post.dislikeCount,
      isDisliked: post.isDisliked,
      commentCount: post.commentCount,
      updatedAt: post.updatedAt,
      commentList: post.commentList,
    }));

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Sample API call:
// https://flowchatbackend.azurewebsites.net/api/Forum/
// searchPost?
// userId=1&
// keyword=prog&
// excludingPostIdList=23&
// excludingPostIdList=24&
// searchNum=10
export async function getSearchPosts(
  options: {
    keyword?: string;
    tagIdList?: number[];
    excludingPostIdList?: number[];
    count?: number;
  } = {}
): Promise<Post[] | null> {
  try {
    const session = await getSession();

    let apiUrl = `https://flowchatbackend.azurewebsites.net/api/Forum/searchPost?`;

    // Add query parameters
    apiUrl += `userId=${session.userId}`; // Add userId to the URL

    // Add keyword if provided
    if (options.keyword) {
      apiUrl += `&keyword=${options.keyword}`;
    }

    if (options.excludingPostIdList) {
      const idList = [...options.excludingPostIdList]; // Create a copy to prevent mutation
      idList.forEach((id) => {
        apiUrl += `&excludingPostIdList=${id}`;
      });
    } else {
      //default value = 0
      apiUrl += `&excludingPostIdList=0`;
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
      console.error(`Failed to fetch search posts with status ${response.status}`);
      return null;
    }

    const data: PostPreviewResponse = await response.json();

    // Map API response to frontend Post interface
    const posts: Post[] = data.data.postPreviewList.map((post) => ({
      postId: post.postId,
      username: post.username,
      title: post.title,
      content: post.content,
      imageAPIList: post.imageAPIList,
      tagNameList: post.tagNameList,
      likeCount: post.likeCount,
      isLiked: post.isLiked,
      dislikeCount: post.dislikeCount,
      isDisliked: post.isDisliked,
      commentCount: post.commentCount,
      updatedAt: post.updatedAt,
      commentList: post.commentList,
    }));

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
}

export async function getPostById(postId: string): Promise<Post | null> {
  try {
    const session = await getSession();

    const apiUrl = `https://flowchatbackend.azurewebsites.net/api/Forum/getPostContent?userId=${session.userId}&postId=${postId}`;

    // Fetch data from the API
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    try {
      const json = await response.json();
      const data: PostContentResponse = json;
      const post = data.data.post;
      return {
        postId: post.postId,
        username: post.username,
        title: post.title,
        content: post.content,
        imageAPIList: post.imageAPIList,
        tagNameList: post.tagNameList,
        likeCount: post.likeCount,
        isLiked: post.isLiked,
        dislikeCount: post.dislikeCount,
        isDisliked: post.isDisliked,
        commentCount: post.commentCount,
        updatedAt: post.updatedAt,
        commentList: post.commentList,
      };
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

interface CreatePostResponse {
  message: string;
  data: any; // Can be a string or an object depending on backend response
}

// Create a new post with the given title, content, tags, and images
export async function createPost(title: string, content: string, tags: Tag[], images: File[]): Promise<string | null> {
  try {
    const session = await getSession();

    // Validate session
    if (!session?.isLoggedIn || !session?.token) {
      throw new Error("User is not logged in or token is unavailable");
    }

    // Validate userId
    const userId = parseInt(session.userId?.toString() || "0", 10);
    if (isNaN(userId)) {
      throw new Error("Invalid userId");
    }

    // Construct request body for the backend
    const requestBody = {
      userId,
      title,
      content: content.replace(/<[^>]+>/g, ""), // Remove HTML tags from content
      tag: tags.map((tag) => tag.tagName),
      attachTo: 0,
    };

    // Create FormData for multipart/form-data request
    const formData = new FormData();
    const requestBodyBlob = new Blob([JSON.stringify(requestBody)], { type: "application/json" });
    formData.append("requestBody", requestBodyBlob);

    // Append images to imageList if any
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append("imageList", image);
      });
    }

    const apiUrl = "https://flowchatbackend.azurewebsites.net/api/Forum/createPostOrComment";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
      body: formData,
    });

    // Check response status
    if (!response.ok) {
      if (response.status === 415) {
        throw new Error("Unsupported media type, please check request format");
      }
      if (response.status === 401) {
        throw new Error("Authentication failed, please log in again");
      }
      if (response.status === 500) {
        throw new Error("Server error, please contact the administrator");
      }
      throw new Error(`Failed to create post, status code: ${response.status}`);
    }

    // Parse response
    const data: CreatePostResponse = await response.json();
    let postId: string | null = null;
    let isSuccess: boolean = false;

    // Handle different response formats
    if (typeof data.data === "string") {
      // Legacy format: data.data is a string like "48 success: true"
      const dataString = data.data as string;
      const [id, successPart] = dataString.split(" success: ");
      postId = id;
      isSuccess = successPart === "true";
    } else if (data.data && typeof data.data === "object" && "isSuccess" in data.data) {
      // New format: data.data is an object like { isSuccess: true }
      isSuccess = (data.data as { isSuccess: boolean }).isSuccess;
      if (isSuccess) {
        // Backend did not return postId, fetch the latest post
        const latestPosts = await getPosts({ filter: "latest", count: 1 });
        if (!latestPosts || latestPosts.length === 0) {
          throw new Error("Unable to fetch the latest post for navigation");
        }
        postId = latestPosts[0].postId;
      }
    } else {
      throw new Error("Unexpected response format from backend");
    }

    if (!isSuccess) {
      throw new Error(data.message || "Failed to create post");
    }

    if (!postId) {
      throw new Error("Unable to retrieve post ID for navigation");
    }

    return postId;
  } catch (error) {
    throw error;
  }
}

export async function updatePost(
  postId: string,
  title: string,
  content: string,
  tags: Tag[],
  images: File[],
  existingImages: string[]
): Promise<string | null> {
  try {
    const session = await getSession();

    // 驗證 session
    if (!session?.isLoggedIn || !session?.token) {
      throw new Error("User is not logged in or token is unavailable");
    }

    // 驗證 userId
    const userId = parseInt(session.userId?.toString() || "0", 10);
    if (isNaN(userId)) {
      throw new Error("Invalid userId");
    }

    // 構造 requestBody，與 createPost 保持一致
    const requestBody = {
      postId: parseInt(postId, 10),
      userId,
      title,
      content: content.replace(/<[^>]+>/g, ""), // 移除 HTML 標籤
      tag: tags.map((tag) => tag.tagName),
      attachTo: 0, // 如果需要更新父貼文 ID，這裡可以設置
      imageAPIList: existingImages, // 傳遞現有圖片的 URL
    };

    // 創建 FormData 用於 multipart/form-data 請求
    const formData = new FormData();
    const requestBodyBlob = new Blob([JSON.stringify(requestBody)], { type: "application/json" });
    formData.append("requestBody", requestBodyBlob);

    // 如果有新圖片，添加到 imageList
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append("imageList", image);
      });
    }

    const apiUrl = "https://flowchatbackend.azurewebsites.net/api/Forum/updatePostOrComment"; // 更新為正確的 API 端點
    const response = await fetch(apiUrl, {
      method: "PUT", // 使用 PUT 方法進行更新
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
      body: formData,
    });

    // 檢查響應狀態
    if (!response.ok) {
      if (response.status === 415) {
        throw new Error("Unsupported media type, please check request format");
      }
      if (response.status === 401) {
        throw new Error("Authentication failed, please log in again");
      }
      if (response.status === 500) {
        throw new Error("Server error, please contact the administrator");
      }
      throw new Error(`Failed to update post, status code: ${response.status}`);
    }

    // 解析響應
    const data: CreatePostResponse = await response.json();
    let updatedPostId: string | null = null;
    let isSuccess: boolean = false;

    // 處理不同的響應格式，與 createPost 一致
    if (typeof data.data === "string") {
      // 舊格式：data.data 是字符串，例如 "48 success: true"
      const dataString = data.data as string;
      const [id, successPart] = dataString.split(" success: ");
      updatedPostId = id;
      isSuccess = successPart === "true";
    } else if (data.data && typeof data.data === "object" && "isSuccess" in data.data) {
      // 新格式：data.data 是物件，例如 { isSuccess: true }
      isSuccess = (data.data as { isSuccess: boolean }).isSuccess;
      if (isSuccess) {
        // 後端未返回 postId，使用傳入的 postId
        updatedPostId = postId;
      }
    } else {
      throw new Error("Unexpected response format from backend");
    }

    if (!isSuccess) {
      throw new Error(data.message || "Failed to update post");
    }

    if (!updatedPostId) {
      throw new Error("Unable to retrieve post ID for navigation");
    }

    return updatedPostId;
  } catch (error) {
    throw error;
  }
}