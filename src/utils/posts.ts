import { Post } from "@/components/posts/PostPreview";
import { cookies } from "next/headers";

type PostsOptions = {
  filter?: "latest" | "recommended" | "following";
  offset?: number;
  count?: number;
};

interface UserAuth {
  userId?: string;
  token?: string;
}

// API response type for getPost
interface PostPreviewResponse {
  message: string;
  data: {
    isSuccess: boolean;
    posts: Post[];
  };
}

interface PostContentResponse {
  message: string;
  data: {
    isSuccess: boolean;
    post: Post;
  };
}

export async function getUserAuthFromCookies(): Promise<UserAuth> {
  try {
    // Get user info from client-accessible cookie
    const userInfoCookie = (await cookies()).get("user");
    let userId = undefined;

    if (userInfoCookie?.value) {
      try {
        const userInfo = JSON.parse(userInfoCookie.value);
        userId = userInfo.id;
      } catch (e) {
        console.error("Error parsing user info cookie");
      }
    }

    // Get token from HttpOnly cookie
    const tokenCookie = (await cookies()).get("auth_token");
    const token = tokenCookie?.value;

    return { userId, token };
  } catch (error) {
    console.error("Error getting user auth from cookies:", error);
    return {};
  }
}

// TO BE DELETED, FOR DEVELOPMENT PURPOSES ONLY
function getMockPosts(options: PostsOptions = {}): Post[] {
  // Create an array of mock posts
  const mockPosts: Post[] = Array.from({ length: 10 }, (_, i) => ({
    postId: `mock-post-${i + 1}`,
    username: `user${i + 1}`,
    title: `Mock Post #${i + 1}: This is a sample post title for development`,
    description: `This is a mock post description for development purposes. It contains enough text to demonstrate how the post will look in the UI. This post was generated as a fallback when the API is unavailable. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl ultricies nisl.`,
    image: i % 3 === 0 ? "https://picsum.photos/400/300?random=" + i : null,
    tag: `mock,development,tag${i}`,
    likeCount: Math.floor(Math.random() * 100),
    dislikeCount: Math.floor(Math.random() * 20),
    commentCount: Math.floor(Math.random() * 50),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 12 * 60 * 60 * 1000)).toISOString(),
    comments: [],
  }));

  // Apply filtering based on options
  let filteredPosts = [...mockPosts];

  // Sort posts by date (newest first)
  filteredPosts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  // Apply offset and count
  const start = options.offset || 0;
  const end = start + (options.count || 10);

  return filteredPosts.slice(start, end);
}

export async function getPosts(options: PostsOptions = {}): Promise<Post[]> {
  try {
    const { userId, token } = await getUserAuthFromCookies();
    // Build the API URL based on the filter
    let apiUrl = "https://flowchatbackend.azurewebsites.net/api/Forum/";
    switch (options.filter) {
      case "latest":
        apiUrl += "getLatestList?";
        break;
      case "recommended":
        apiUrl += "getRecommendedList?";
        break;
      case "following":
        apiUrl += "getFollowingList?";
        break;
    }

    // Add query parameters
    apiUrl += `userid=${userId}&postNumOffset=${options.offset || 0}&postNum=${options.count || 10}`;

    // Fetch data from the API
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log(`Mock posts are returned due to API request failed with status ${response.status}`);
      return getMockPosts(options);
    }

    const data: PostPreviewResponse = await response.json();

    if (!data.data.isSuccess || !data.data.posts) {
      console.log(`API returned isSuccess: false or missing post data`);
      return getMockPosts(options);
    }

    // Map API response to frontend Post interface
    const posts: Post[] = data.data.posts.map((post) => ({
      postId: post.postId,
      username: post.username,
      title: post.title,
      description: post.description,
      image: post.image,
      tag: post.tag,
      likeCount: post.likeCount,
      dislikeCount: post.dislikeCount,
      commentCount: post.commentCount,
      updatedAt: post.updatedAt,
      comments: [],
    }));

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// TO BE DELETED, FOR DEVELOPMENT PURPOSES ONLY
function getMockPostById(postId: string): Post | null {
  // Generate a single mock post
  const mockPost: Post = {
    postId: postId,
    username: "John Doe",
    title: `Mock Post #${postId}: Detailed View`,
    description: `This is a detailed mock post for development. It contains a longer description to simulate a real post's content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl ultricies nisl. Suspendisse potenti. Sed vel est eget nisi bibendum commodo. Donec auctor, nunc id ultricies ultricies, nunc nisl ultricies nunc, id ultricies nunc nisl id nunc.\n\nParagraph 2: More detailed content goes here with formatting and structure to test the UI rendering.`,
    image: "https://picsum.photos/800/600?random=" + postId,
    tag: "mock,development,detailed",
    likeCount: Math.floor(Math.random() * 100),
    dislikeCount: Math.floor(Math.random() * 20),
    commentCount: 3,
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString(),
    comments: [
      {
        postId: `${postId}-comment-1`,
        username: "Alice",
        title: "First Comment",
        description: "This is the first mock comment.",
        image: null,
        tag: "comment,development",
        likeCount: Math.floor(Math.random() * 20),
        dislikeCount: Math.floor(Math.random() * 5),
        commentCount: 0,
        updatedAt: new Date(Date.now() - Math.floor(Math.random() * 12 * 60 * 60 * 1000)).toISOString(),
        comments: [],
      },
      {
        postId: `${postId}-comment-2`,
        username: "Bob",
        title: "Second Comment",
        description: "This is the second mock comment with more details.",
        image: null,
        tag: "comment,development",
        likeCount: Math.floor(Math.random() * 20),
        dislikeCount: Math.floor(Math.random() * 5),
        commentCount: 0,
        updatedAt: new Date(Date.now() - Math.floor(Math.random() * 60 * 60 * 1000)).toISOString(),
        comments: [],
      },
    ],
  };

  return mockPost;
}

export async function getPostById(postId: string): Promise<Post | null> {
  try {
    const { token } = await getUserAuthFromCookies();

    // Build the API URL for a single post with comments
    const apiUrl = `https://flowchatbackend.azurewebsites.net/api/Forum/getPostContent?postId=${postId}`;

    // Prepare headers
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Fetch data from the API
    const response = await fetch(apiUrl, {
      headers,
      cache: "no-store",
    });

    // If API call fails, use mock data
    if (!response.ok) {
      console.log(`Mock post detail is returned due to API request failed with status ${response.status}`);
      return getMockPostById(postId);
    }

    const data: PostContentResponse = await response.json();

    if (!data.data.isSuccess || !data.data.post) {
      console.log(`API returned isSuccess: false or missing post data`);
      return getMockPostById(postId);
    }

    // Map API response to Post object
    const post = data.data.post;
    return {
      postId: post.postId,
      username: post.username,
      title: post.title,
      description: post.description,
      image: post.image,
      tag: post.tag,
      likeCount: post.likeCount,
      dislikeCount: post.dislikeCount,
      commentCount: post.commentCount,
      updatedAt: post.updatedAt,
      comments: mapComments(post.comments as any),
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return getMockPostById(postId);
  }
}

function mapComments(apiComments: Post[] | null): any[] {
  if (!apiComments) return [];

  return apiComments.map((post) => ({
    postId: post.postId,
    username: post.username,
    title: post.title,
    description: post.description,
    image: post.image,
    tag: post.tag,
    likeCount: post.likeCount,
    dislikeCount: post.dislikeCount,
    commentCount: post.commentCount,
    updatedAt: post.updatedAt,
    comments: mapComments(post.comments as any),
  }));
}
