"use client";

import { useEffect, useRef, useState } from "react";
import PostPreview, { Post } from "./PostPreview";
import { getPosts } from "@/utils/posts";
import { useTagContext } from "@/hooks/useTags";
import LoadingPostPreview from "@/components/posts/LoadingPostPreview";

export default function PostList({ filter = "latest" }: { filter?: "latest" | "recommended" | "following" }) {
  const { selectedTags: tags, setPostsLoading } = useTagContext();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [excludedPostIds, setExcludedPostIds] = useState<Set<number>>(new Set());
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const MAX_ATTEMPTS = 10; // Limit fetch attempts to prevent infinite loops

  // Synchronize local loading state with the global tag context loading state
  useEffect(() => {
    setPostsLoading(isLoading);
  }, [isLoading, setPostsLoading]);

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
    // Reset states when tags change
    setPosts([]);
    setExcludedPostIds(new Set());
    setHasMore(true);
    setFetchAttempts(0);

    const fetchInitialPosts = async () => {
      setIsLoading(true);
      try {
        const initialPosts = await getPosts({ filter });

        // Scroll to the top of the page smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });

        // No posts are returned from the API
        if (!initialPosts || initialPosts.length === 0) {
          setHasMore(false);
          return;
        }

        const filteredPosts = filterPostsByTags(initialPosts);

        // Update excludedPostIds with the initial posts
        const newExcludedIds = new Set<number>();
        initialPosts.forEach((post) => newExcludedIds.add(Number(post.postId)));
        setExcludedPostIds(newExcludedIds);

        setPosts(filteredPosts);
        setHasMore(initialPosts.length > 0);

        console.log("Initial Posts:", initialPosts);
        console.log("Filtered Posts:", filteredPosts);
        console.log("Excluded Post IDs:", Array.from(newExcludedIds));
        console.log("Selected Tags:", tags);
      } catch (err) {
        console.error("Failed to load posts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialPosts();
  }, [filter, tags]); // Refetch when tags or filter changes

  // Effect to handle auto-loading more posts if filtered results are empty
  useEffect(() => {
    // If no posts after filtering, but there might be more, try loading more
    if (!isLoading && posts.length === 0 && hasMore && fetchAttempts < MAX_ATTEMPTS) {
      setFetchAttempts((prev) => prev + 1);
      loadMorePosts();
    }
  }, [posts, hasMore, fetchAttempts]);

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
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      // Fetch more posts
      const newPosts = await getPosts({
        filter,
        excludingPostIdList: Array.from(excludedPostIds),
        count: 10,
      });

      // No posts are returned from the API
      if (!newPosts || newPosts.length === 0) {
        setHasMore(false);
        return;
      }

      const filteredPosts = filterPostsByTags(newPosts);

      // Update excludedPostIds with new posts
      setExcludedPostIds((prevExcludedIds) => {
        const newExcludedIds = new Set(prevExcludedIds);
        newPosts.forEach((post) => newExcludedIds.add(Number(post.postId)));
        return newExcludedIds;
      });

      console.log("New Posts:", newPosts);
      console.log("Filtered Posts:", filteredPosts);

      setPosts((prevPosts) => [...prevPosts, ...filteredPosts]);

      // If got posts but none passed the filter
      if (filteredPosts.length === 0 && newPosts.length > 0) {
        console.log("Got posts but all were filtered out");
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
        [1, 2, 3, 4].map((i) => <LoadingPostPreview key={i} />)
      ) : (
        <div className="text-center text-lg text-base-content/50 my-4">No posts available</div>
      )}
    </div>
  );
}
