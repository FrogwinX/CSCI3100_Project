import { Post } from "@/components/posts/PostPreview";

type PostsOptions = {
  sort?: "latest" | "recommended";
  following?: string;
  limit?: number;
};

// This is a placeholder implementation - replace with actual API calls
export async function getPosts(options: PostsOptions = {}): Promise<Post[]> {
  // In a real app, this would be an API call to your backend

  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock data
  const mockPosts: Post[] = [
    {
      id: "1",
      title: "Getting Started with Next.js",
      content:
        "Next.js is a powerful React framework that gives you building blocks to create web applications. By framework, we mean Next.js handles the tooling and configuration needed for React, and provides additional structure, features, and optimizations for your application.",
      author: {
        id: "101",
        username: "techguru",
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      commentCount: 5,
      likeCount: 12,
      tags: ["nextjs", "react", "frontend"],
    },
    {
      id: "2",
      title: "Why TypeScript is Worth Learning",
      content:
        "TypeScript adds static typing to JavaScript, which helps catch errors early during development instead of at runtime. This can significantly improve developer productivity and code quality.",
      author: {
        id: "102",
        username: "codingpro",
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      commentCount: 8,
      likeCount: 24,
      tags: ["typescript", "javascript", "programming"],
    },
    {
      id: "3",
      title: "Creating a Custom React Hook",
      content:
        "React hooks are a powerful feature that allow you to reuse stateful logic across components. By creating a custom hook, you can extract component logic into a reusable function.",
      author: {
        id: "103",
        username: "webdev",
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10), // 10 hours ago
      commentCount: 3,
      likeCount: 10,
      tags: ["react", "hooks", "frontend"],
    },
    {
      id: "4",
      title: "Understanding Async/Await in JavaScript",
      content: "A detailed explanation of how async/await simplifies asynchronous programming in JavaScript.",
      author: { id: "104", username: "asyncguru" },
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      commentCount: 4,
      likeCount: 15,
      tags: ["javascript", "async", "programming"],
    },
    {
      id: "5",
      title: "Building RESTful APIs with Node.js",
      content: "Learn how to build scalable RESTful APIs using Node.js and Express.",
      author: { id: "105", username: "nodeexpert" },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      commentCount: 3,
      likeCount: 20,
      tags: ["node.js", "express", "api"],
    },
    {
      id: "6",
      title: "CSS Grid vs. Flexbox: When to Use Each",
      content:
        "An in-depth look at CSS Grid and Flexbox layout systems and how to choose the right one for your design.",
      author: { id: "106", username: "csspro" },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      commentCount: 5,
      likeCount: 18,
      tags: ["css", "web design", "frontend"],
    },
    {
      id: "7",
      title: "Introduction to Docker for Developers",
      content: "Docker simplifies containerization. This post covers basic concepts and setup for developers.",
      author: { id: "107", username: "dockerdev" },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      commentCount: 2,
      likeCount: 25,
      tags: ["docker", "devops", "containers"],
    },
    {
      id: "8",
      title: "Mastering Git: Tips and Tricks",
      content: "Enhance your version control skills with advanced Git techniques and best practices.",
      author: { id: "108", username: "gitmaster" },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      commentCount: 6,
      likeCount: 30,
      tags: ["git", "version control", "coding"],
    },
  ];

  // Apply sorting based on options
  if (options.sort === "latest") {
    mockPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } else if (options.sort === "recommended") {
    // Sort by like count for "recommended"
    mockPosts.sort((a, b) => b.likeCount - a.likeCount);
  }

  // Filter for following if needed
  if (options.following) {
    // This would normally filter posts by authors the user follows
    // For demo, just return a subset
    return mockPosts.slice(0, 1);
  }

  return mockPosts;
}

export async function getPostById(id: string): Promise<Post | null> {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Find post by ID from our mock data
  const posts = await getPosts();
  const post = posts.find((p) => p.id === id);

  if (!post) return null;

  // Add more content for the full post view
  return {
    ...post,
    content:
      post.content +
      "\n\n" +
      "This is additional content that would only be shown in the full post view. It includes more details about the topic being discussed. In a real application, this would be the complete post content rather than just a preview.",
  };
}

export async function getUserId(): Promise<string | null> {
  // This would normally check authentication status
  // For demo purposes, return null (not logged in)
  return null;
}
