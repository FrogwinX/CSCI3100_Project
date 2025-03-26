"use client";

import { useEffect, useRef, useState } from "react";
import PostPreview, { Post } from "./PostPreview";
import { getPosts } from "@/utils/posts";
import { useTagContext } from "@/hooks/useTags";

export default function PostList({ filter = "latest" }: { filter?: "latest" | "recommended" | "following" }) {
  const { selectedTags: tags } = useTagContext();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const filterPostsByTags = (postsToFilter: Post[]) => {
    if (tags.length === 0) {
      return postsToFilter; // No filtering needed if no tags selected
    }

    return postsToFilter.filter((post) => {
      // Skip posts with no tags if we have selected tags
      if (!post.tagNameList || post.tagNameList.length === 0) {
        return false;
      }

      // Check if post contains ALL selected tags
      return tags.every((tag) => post.tagNameList!.includes(tag.tagName));
    });
  };

  useEffect(() => {
    const fetchInitialPosts = async () => {
      setIsLoading(true);
      try {
        const initialPosts = await getPosts({ filter, lastPostId: "0" });
        const filteredPosts = filterPostsByTags(initialPosts);

        setPosts(filteredPosts);

        // Filter posts if tags are selected
        // if (tags.length === 0) {
        //   setPosts(initialPosts);
        // } else {
        //   const filteredPosts = initialPosts.filter((post) =>
        //     tags.every((t) => post.tagNameList?.includes(t.tagName) ?? false)
        //   );
        //   setPosts(filteredPosts);
        // }

          setHasMore(initialPosts.length > 0);
        } catch (err) {
          console.error("Failed to load posts:", err);
        } finally {
          setIsLoading(false);
        }
      };

    fetchInitialPosts();
  }, [filter, tags]); // Refetch when tags or filter changes

  // Infinite scrolling setup
  useEffect(() => {
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
          // const filteredPosts = newPosts.filter((post) =>
          //   tags.every((t) => post.tagNameList?.includes(t.tagName) ?? false)
          // );

          const filteredPosts = filterPostsByTags(newPosts);
          if (filteredPosts.length === 0) {
            setHasMore(false);
          }
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
                <p className="text-sm">You&apos;ve reached the end</p>
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
