"use client";

import { useEffect, useRef, useState } from "react";
import PostPreview, { Post } from "./PostPreview";
import { getPosts } from "@/utils/posts";
import { Tag } from "@/utils/posts";

export default function PostList({
  tags = [],
  filter = "latest",
}: {
  tags?: Tag[];
  filter?: "latest" | "recommended" | "following";
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInitialPosts = async () => {
      setIsLoading(true);
      try {
        const initialPosts = await getPosts({ filter, lastPostId: "0" });

        // Filter posts if tags are selected
        if (tags.length === 0) {
          setPosts(initialPosts);
        } else {
          const filteredPosts = initialPosts.filter(
            (post) => post.tagNameList?.some((tag) => tags.some((t) => t.tagName === tag)) ?? false
          );
          setPosts(filteredPosts);
        }

        setHasMore(initialPosts.length > 0);
      } catch (err) {
        console.error("Failed to load posts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialPosts();
  }, []); // Refetch when tags or filter changes
  // Infinite scrolling setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading]);

  // Function to load more posts
  const loadMorePosts = async () => {
    if (isLoading || !hasMore || posts.length === 0) return;

    setIsLoading(true);

    try {
      // Get the ID of the last post
      const lastPostId = posts[posts.length - 1].postId;

      // Fetch more posts
      const newPosts = await getPosts({
        filter,
        lastPostId,
        count: 10,
      });

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        if (tags.length === 0) {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        } else {
          // Fixed to match the same filtering logic used for initial posts
          const filteredPosts = newPosts.filter(
            (post) => post.tagNameList?.some((tag) => tags.some((t) => t.tagName === tag)) ?? false
          );
          setPosts((prevPosts) => [...prevPosts, ...filteredPosts]);
        }
      }
    } catch (err) {
      console.error("Failed to load more posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col px-4 py-2">
      {posts.length > 0 ? (
        <>
          {/* Map through posts and add dividers between them */}
          {posts.map((post) => (
            <div key={post.postId} className="w-full">
              <PostPreview post={post} />
              {/* Add divider after each post except the last one */}
              <div className="divider my-0"></div>
            </div>
          ))}

          {/* Observer target and loading state */}
          <div ref={observerTarget} className="py-2">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <span className="loading loading-spinner loading-xl"></span>
              </div>
            ) : hasMore ? (
              <div className="h-10"></div>
            ) : (
              <div className="text-center text-base-content/50 my-4">
                <p className="text-sm">You've reached the end</p>
              </div>
            )}
          </div>
        </>
      ) : isLoading ? (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      ) : (
        <div className="text-center text-lg text-base-content/50 my-4">No posts available</div>
      )}
    </div>
  );
}
