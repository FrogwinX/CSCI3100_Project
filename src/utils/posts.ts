"use server";

import { getSession } from "@/utils/sessions";

const API_BASE_URL = process.env.API_BASE_URL;

export interface Post {
  postId: string;
  userId: string;
  username: string;
  avatar: string | null;
  isUserBlocked: boolean;
  title: string;
  content: string;
  imageAPIList: string[] | null;
  tagNameList: string[] | null;
  likeCount: number;
  isLiked: boolean;
  dislikeCount: number;
  isDisliked: boolean;
  commentCount: number;
  updatedAt: string;
  commentList: Post[] | null;
}

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
  data: {
    isSuccess: boolean;
  };
}

export async function getAllTags(): Promise<Tag[]> {
  try {
    const session = await getSession();
    const apiUrl = `${API_BASE_URL}/api/Forum/getAllTag`;

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
    filter?: "latest" | "recommended" | "following" | "created";
    excludingPostIdList?: number[];
    count?: number;
    authorUserId?: string;
  } = {}
): Promise<Post[] | null> {
  try {
    const session = await getSession();
    // Build the API URL based on the filter
    let apiUrl = `${API_BASE_URL}/api/Forum/`;
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
      case "created":
        apiUrl = `${API_BASE_URL}/api/Profile/getMyPostPreviewList?`;
        break;
    }

    // Add query parameters
    switch (options.filter) {
      case "created":
        apiUrl += `userIdFrom=${session.userId}`;
        if (options.authorUserId === "0") {
          apiUrl += `&userIdTo=${session.userId}`;
        } else {
          apiUrl += `&userIdTo=${options.authorUserId}`;
        }
        break;
      default:
        apiUrl += `userId=${session.userId}`; // Add userId to the URL
        break;
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

    const data: PostPreviewResponse = await response.json();
    // Map API response to frontend Post interface
    const posts: Post[] = data.data.postPreviewList.map((post) => ({
      postId: post.postId,
      userId: post.userId,
      username: post.username,
      avatar: post.avatar,
      isUserBlocked: post.isUserBlocked,
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

    let apiUrl = `${API_BASE_URL}/api/Forum/searchPost?`;

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

    apiUrl += `&searchNum=${options.count || 10}`;

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
      userId: post.userId,
      username: post.username,
      avatar: post.avatar,
      isUserBlocked: post.isUserBlocked,
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

    const apiUrl = `${API_BASE_URL}/api/Forum/getPostContent?userId=${session.userId}&postId=${postId}`;

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
        userId: post.userId,
        username: post.username,
        avatar: post.avatar,
        isUserBlocked: post.isUserBlocked,
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
      content: content.replace(/\n/g, "<br>"),
      tag: tags.map((tag) => tag.tagName),
      attachTo: 0,
    };
    console.log("content", content);

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

    console.log(images);

    const apiUrl = `${API_BASE_URL}/api/Forum/createPostOrComment`;
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
    console.log("data", data);
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

// Update an existing post with the given data
export async function updatePost(
  postId: string,
  title: string,
  content: string,
  tags: Tag[],
  images: File[],
  existingImages: string[]
): Promise<string | null> {
  try {
    console.log(images, "images", existingImages, "existingImages");
    // Retrieve the current session
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

    // Construct the request body, consistent with createPost
    const requestBody = {
      postId: parseInt(postId, 10), // Post ID to update
      userId, // User ID of the poster
      title, // Updated post title
      content: content.replace(/\n/g, "<br>"),
      tag: tags.map((tag) => tag.tagName), // List of tag names
      attachTo: 0, // Parent post ID (if applicable, set to 0 if not a comment)
      imageAPIList: existingImages, // List of existing image URLs to retain
    };

    // Create FormData for multipart/form-data request
    const formData = new FormData();
    const requestBodyBlob = new Blob([JSON.stringify(requestBody)], { type: "application/json" });
    formData.append("requestBody", requestBodyBlob);

    // If there are new images, append them to imageList
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append("imageList", image);
      });
    } else if (images.length === 0) {
      formData.append("imageList", new Blob([], { type: "application/json" }));
    }

    // API endpoint for updating a post or comment
    const apiUrl = `${API_BASE_URL}/api/Forum/updatePostOrComment`;
    const response = await fetch(apiUrl, {
      method: "PUT", // Use PUT method for updating
      headers: {
        Authorization: `Bearer ${session.token}`, // Authorization token
      },
      body: formData, // FormData containing requestBody and imageList
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
      throw new Error(`Failed to update post, status code: ${response.status}`);
    }

    // Parse the response
    const data: CreatePostResponse = await response.json();
    let updatedPostId: string | null = null;
    let isSuccess: boolean = false;

    // Handle different response formats, consistent with createPost
    if (typeof data.data === "string") {
      // Legacy format: data.data is a string like "48 success: true"
      const dataString = data.data as string;
      const [id, successPart] = dataString.split(" success: ");
      updatedPostId = id;
      isSuccess = successPart === "true";
    } else if (data.data && typeof data.data === "object" && "isSuccess" in data.data) {
      // New format: data.data is an object like { isSuccess: true }
      isSuccess = (data.data as { isSuccess: boolean }).isSuccess;
      if (isSuccess) {
        // Backend did not return postId, use the provided postId
        updatedPostId = postId;
      }
    } else {
      throw new Error("Unexpected response format from backend");
    }

    // Check if the update was successful
    if (!isSuccess) {
      throw new Error(data.message || "Failed to update post");
    }

    // Ensure a post ID is available for navigation
    if (!updatedPostId) {
      throw new Error("Unable to retrieve post ID for navigation");
    }

    return updatedPostId;
  } catch (error) {
    throw error;
  }
}

function parseCommentNumber(str: string) {
  const match = str.match(/^C(\d+)(?:-(\d+))?/);
  if (!match) return [Infinity];
  const main = parseInt(match[1], 10);
  const sub = match[2] ? parseInt(match[2], 10) : 0;
  return [main, sub];
}

// Get comment list for a post
export async function getCommentList(
  postId: string,
  userId: string,
  options: {
    excludingCommentIdList?: number[];
    count?: number;
  } = {}
) {
  const apiUrl = `${API_BASE_URL}/api/Forum/getCommentList?postId=${postId}&userId=${userId}`;
  const session = await getSession();
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch comments");
  const data = await response.json();
  let comments = Array.isArray(data?.data?.commentList) ? data.data.commentList : [];

  // Sort comments by comment number
  comments = comments.slice().sort((a: any, b: any) => {
    const aNum = parseCommentNumber(a.content);
    const bNum = parseCommentNumber(b.content);
    
    // First compare main comment numbers
    if (aNum[0] !== bNum[0]) {
      return aNum[0] - bNum[0];
    }
    
    // If main numbers are equal, compare sub-comment numbers
    if (aNum[1] !== bNum[1]) {
      return aNum[1] - bNum[1];
    }
    
    // If both numbers are equal, sort by timestamp
    return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
  });

  // Apply pagination if options are provided
  if (options.excludingCommentIdList && options.excludingCommentIdList.length > 0) {
    comments = comments.filter((comment: any) => !options.excludingCommentIdList!.includes(Number(comment.postId)));
  }

  if (options.count) {
    comments = comments.slice(0, options.count);
  }

  return comments;
}

// Create a comment for a post
export async function createComment(postId: string, userId: string, content: string) {
  const apiUrl = `${API_BASE_URL}/api/Forum/createPostOrComment`;
  const session = await getSession();
  const requestBody = {
    userId: parseInt(userId, 10),
    title: "", // comments have no title
    content: content.replace(/\n/g, "<br>"),
    tag: [],
    attachTo: parseInt(postId, 10),
  };
  const formData = new FormData();
  const requestBodyBlob = new Blob([JSON.stringify(requestBody)], { type: "application/json" });
  formData.append("requestBody", requestBodyBlob);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
}
