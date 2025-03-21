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

// TO BE DELETED, FOR DEVELOPMENT PURPOSES ONLY
const descriptionSamples = [
  // Very short
  "",
  "Quick question about homework assignment #3.",

  // Short
  "I've been working on this project for a few weeks now. The progress has been slow but steady.",
  "Discovered this interesting algorithm today. It's supposed to improve performance by 30%.",

  // Medium
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.",
  "I'm really interested in how we can apply machine learning to optimize energy consumption in smart buildings. Has anyone here worked on similar projects? Would love to hear about your experiences and challenges.",

  // Long
  "Mauris accumsan nulla vel diam. Sed in felis eu justo cursus adipiscing. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.",

  // Very long
  "Curabitur at lacus ac velit ornare lobortis. Curabitur a felis in nunc fringilla tristique. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus.",
];

// TO BE DELETED, FOR DEVELOPMENT PURPOSES ONLY
const tagPool = {
  tech: ["programming", "ai", "web", "mobile", "cloud", "database", "security", "coding"],
  academics: ["research", "project", "thesis", "homework", "assignment", "study", "course"],
  university: ["campus", "semester", "dorm", "student", "professor", "class", "lecture"],
  lifestyle: ["fitness", "food", "travel", "music", "movies", "books", "gaming"],
  misc: ["discussion", "question", "help", "advice", "announcement", "mock", "tutorial"],
};

// TO BE DELETED, FOR DEVELOPMENT PURPOSES ONLY
const getRandomTags = () => {
  const numberOfTags = Math.floor(Math.random() * 3) + 1; // 1-3 tags per post
  const allCategories = Object.keys(tagPool) as (keyof typeof tagPool)[];
  const selectedTags = [];

  // Select at least one tag from a random category
  const primaryCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
  const primaryTags = tagPool[primaryCategory];
  selectedTags.push(primaryTags[Math.floor(Math.random() * primaryTags.length)]);

  // Add additional tags if needed
  while (selectedTags.length < numberOfTags) {
    const category = allCategories[Math.floor(Math.random() * allCategories.length)];
    const tags = tagPool[category];
    const tag = tags[Math.floor(Math.random() * tags.length)];
    // Avoid duplicates
    if (!selectedTags.includes(tag)) {
      selectedTags.push(tag);
    }
  }

  return selectedTags.join(",");
};

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
  const mockPosts: Post[] = Array.from({ length: 10 }, (_, i) => ({
    postId: `mock-post-${i + 1}`,
    username: `user${i + 1}`,
    title: `Mock Post #${i + 1}: This is a sample post title for development`,
    description: descriptionSamples[Math.floor(Math.random() * descriptionSamples.length)],
    image: i % 3 === 0 ? "https://picsum.photos/400/300?random=" + i : null,
    tag: getRandomTags(),
    likeCount: Math.floor(Math.random() * 10000),
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
  const numComments = Math.floor(Math.random() * 5) + 1; // Generate between 1 and 5 comments
  const mockComments: Post[] = Array.from({ length: numComments }, (_, idx) => ({
    postId: `${postId}-comment-${idx + 1}`,
    username: idx % 2 === 0 ? "Alice" : "Bob",
    title: `Comment ${idx + 1}`,
    description: descriptionSamples[Math.floor(Math.random() * descriptionSamples.length)],
    image: null,
    tag: "",
    likeCount: Math.floor(Math.random() * 20),
    dislikeCount: Math.floor(Math.random() * 5),
    commentCount: 0,
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 12 * 60 * 60 * 1000)).toISOString(),
    comments: [],
  }));

  const mockPost: Post = {
    postId: postId,
    username: "John Doe",
    title: `Mock Post #${postId}: Detailed View`,
    description: descriptionSamples[Math.floor(Math.random() * descriptionSamples.length)],
    image: "https://picsum.photos/800/600?random=" + postId,
    tag: getRandomTags(),
    likeCount: Math.floor(Math.random() * 100),
    dislikeCount: Math.floor(Math.random() * 20),
    commentCount: mockComments.length,
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString(),
    comments: mockComments,
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
