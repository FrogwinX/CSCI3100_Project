"use server";

import { Post } from "@/components/posts/PostPreview";
import { getSession } from "@/utils/sessions";

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

// TO BE DELETED, FOR DEVELOPMENT PURPOSES ONLY
const contentSamples = [
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

// TO BE DELETED, FOR DEVELOPMENT PURPOSES ONLY
function getMockPosts(
  options: {
    filter?: "latest" | "recommended" | "following";
    lastPostId?: string;
    count?: number;
  } = {}
): Post[] {
  // Keep track of the base timestamp for proper time progression
  const baseTimestamp = Date.now();

  // Extract the number from lastPostId if provided
  let lastPostNumber = 0;
  if (options.lastPostId) {
    // More reliable parsing with fallback
    const match = options.lastPostId.match(/mock-post-(\d+)/);
    lastPostNumber = match ? parseInt(match[1]) : 0;
  }

  // Calculate the starting index for the new batch
  // Ensure we start ONE AFTER the lastPostId to avoid duplicates
  const startIndex = lastPostNumber + 1;

  const mockPosts: Post[] = Array.from({ length: options.count || 10 }, (_, i) => {
    // Calculate the current post index
    const postIndex = startIndex + i;

    // Calculate timestamp to ensure posts get progressively older
    // If continuing from a lastPostId, add extra time offset to ensure
    // the new batch is clearly older than the previous batch
    const timeOffset = lastPostNumber > 0 ? lastPostNumber * 24 * 60 * 60 * 1000 : 0;
    const ageInMilliseconds = timeOffset + postIndex * 3600000 + Math.random() * 1800000;

    return {
      postId: `mock-post-${postIndex}`,
      username: `user${postIndex}`,
      title: `Mock Post #${postIndex}: This is a sample post title for development`,
      content: contentSamples[Math.floor(Math.random() * contentSamples.length)],
      imageAPIList: postIndex % 3 === 0 ? [`https://picsum.photos/400/300?random=${postIndex}`] : null,
      tagNameList: getRandomTags().split(","),
      likeCount: Math.floor(Math.random() * 10000),
      isLiked: false,
      dislikeCount: Math.floor(Math.random() * 20),
      isDisliked: false,
      commentCount: Math.floor(Math.random() * 50),
      updatedAt: new Date(baseTimestamp - ageInMilliseconds).toISOString(),
      commentList: [],
    };
  });

  // No need to apply additional filtering for mock data
  return mockPosts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getPosts(
  options: { filter?: "latest" | "recommended" | "following"; lastPostId?: string; count?: number } = {}
): Promise<Post[]> {
  try {
    const session = await getSession();
    // Build the API URL based on the filter
    let apiUrl = "https://flowchatbackend.azurewebsites.net/api/Forum/";
    switch (options.filter) {
      case "latest":
        apiUrl += "getLatestPostPreviewList?";
        break;
      case "recommended":
        apiUrl += "getRecommendedPostPreviewList?";
        break;
      case "following":
        apiUrl += "getFollowingPostPreviewList?";
        break;
    }

    // Add query parameters
    apiUrl += `userId=${session.userId}&lastPostId=${options.lastPostId}&postNum=${options.count || 10}`;

    // Fetch data from the API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    // If API call fails, use mock data
    if (!response.ok) {
      console.log(`Mock posts are returned due to API request failed with status ${response.status}`);
      return getMockPosts(options);
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
    return [];
  }
}

// TO BE DELETED, FOR DEVELOPMENT PURPOSES ONLY
function getMockPostById(postId: string): Post | null {
  const mockPost: Post = {
    postId: postId,
    username: "John Doe",
    title: `Mock Post #${postId}: Detailed View`,
    content: contentSamples[Math.floor(Math.random() * contentSamples.length)],
    imageAPIList: [`https://picsum.photos/800/600?random=${postId}`],
    tagNameList: getRandomTags().split(","),
    likeCount: Math.floor(Math.random() * 100),
    isLiked: false,
    dislikeCount: Math.floor(Math.random() * 20),
    isDisliked: false,
    commentCount: Math.floor(Math.random() * 50),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString(),
    commentList: [],
  };

  return mockPost;
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

    // If API call fails, use mock data
    if (!response.ok) {
      console.log(`Mock post detail is returned due to API request failed with status ${response.status}`);
      return getMockPostById(postId);
    }

    const data: PostContentResponse = await response.json();
    // Map API response to Post object
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
    console.error("Error fetching post:", error);
    return getMockPostById(postId);
  }
}
