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
      const data: PostContentResponse = await response.json();
      console.log("API response:", data); // Log the API response for debugging

      // Check if data, data.data, or data.data.post is null/undefined
      if (!data || !data.data || !data.data.post) {
        console.error("API returned null or invalid data structure");
        return null;
      }

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

export async function createPost(title: string, content: string, tags: Tag[]): Promise<string | null> {
  try {
    const session = await getSession();

    if (!session?.isLoggedIn || !session?.token) {
      throw new Error("用戶未登入或 token 不可用");
    }

    const { cleanContent, images } = extractImagesFromContent(content);

    const requestBody = {
      title,
      content: cleanContent,
      tagIdList: tags.map((tag) => tag.tagId),
    };

    const formData = new FormData();
    formData.append("requestBody", JSON.stringify(requestBody));
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    const apiUrl = "https://flowchatbackend.azurewebsites.net/api/Forum/createPostOrComment";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`創建貼文失敗，狀態碼：${response.status}`);
    }

    const data: CreatePostResponse = await response.json();
    if (!data.data.isSuccess) {
      throw new Error(data.message || "創建貼文失敗");
    }

    return data.data.postId;
  } catch (error) {
    console.error("創建貼文時發生錯誤：", error);
    return null;
  }
}
