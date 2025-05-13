"use client";

import { useEffect, useRef, useState } from "react";
import PostPreview from "@/components/posts/PostPreview";
import { Post } from "@/utils/posts";
import { getPosts, getSearchPosts } from "@/utils/posts";
import { useTagContext } from "@/hooks/useTags";
import LoadingPostPreview from "@/components/posts/LoadingPostPreview";
// import { Tag } from "@/utils/posts";

export default function PostList({
  filter,
  keyword,
  authorUserId,
}: {
  filter?: "latest" | "recommended" | "following" | "created" | undefined;
  keyword?: string | undefined;
  authorUserId?: string;
}) {
  const { selectedTags: tags, setPostsLoading } = useTagContext();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPostsFetched, setCurrentPostsFetched] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [excludedPostIds, setExcludedPostIds] = useState<Set<number>>(new Set());
  // const [lastTags, setLastTags] = useState<Tag[]>([]);

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

  const removePostFromPostlist = (postId: string) => {
    console.log("Removing post with ID:", postId);
    setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
  }

  const fetchInitialPosts = async () => {
    console.log("Fetching initial posts...");
    setIsLoading(true);
    try {
      let initialPosts;
      //switch between getPosts and getSearchPosts based on keyword
      if (!keyword) {
        switch (filter) {
          case "created":
            initialPosts = await getPosts({ filter, authorUserId, count: 10 });
            break;
          default:
            initialPosts = await getPosts({ filter, count: 10 });
            break;
        }
      } else {
        initialPosts = await getSearchPosts({ keyword });
      }
      // Scroll to the top of the page smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });

      // No posts are returned from the API
      if (!initialPosts || initialPosts.length === 0) {
        setHasMore(false);
        return;
      }

      const filteredPosts = filterPostsByTags(initialPosts);
      setCurrentPostsFetched(filteredPosts);
      // if (tags !== lastTags) {
      //   setLastTags(tags); // Update lastTags to the current tags
      // }

      // Update excludedPostIds with the initial posts
      const newExcludedIds = new Set<number>();
      initialPosts.forEach((post) => newExcludedIds.add(Number(post.postId)));
      setExcludedPostIds(newExcludedIds);

      setPosts(filteredPosts);
      setHasMore(initialPosts.length > 0);

      // console.log("Initial Posts:", initialPosts);
      // console.log("Filtered Posts:", filteredPosts);
      // console.log("Excluded Post IDs:", Array.from(newExcludedIds));
      // console.log("Selected Tags:", tags);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    // Reset states when tags change
    setPosts([]);
    setExcludedPostIds(new Set());
    setHasMore(true);

    fetchInitialPosts();

    // console.log("Trigger fetchInitialPosts on filter/tags/keyword change");
    // console.log("Selected tags:", tags);
    // console.log("Keyword:", keyword);
  }, [tags, keyword]); // Refetch when tags or filter or keyword change

  // Effect to handle auto-loading more posts if filtered results are empty
  useEffect(() => {
    // If no posts after filtering, but there might be more, try loading more

    // console.log("Checking if more posts need to be loaded...");
    // console.log("number of Current posts fetched:", currentPostsFetched.length);
    // console.log("Posts after after filter in this fetch:", posts);
    // console.log("Has more:", hasMore);

    if (!isLoading && (posts.length === 0 || currentPostsFetched.length === 0) && hasMore) {
      console.log("No posts after filtering, loading more...");
      loadMorePosts();
    }
    else {
      console.log("Posts available or no more to load, not loading more.");
    }

  }, [posts, hasMore, currentPostsFetched]);

  // Infinite scrolling setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          console.log("Post bottom reached, loading more posts...");
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    const currentObserverTarget = observerTarget.current;

    if (currentObserverTarget) {
      observer.observe(currentObserverTarget);
    }

    return () => {
      if (currentObserverTarget) {
        observer.unobserve(currentObserverTarget);
      }
    };
  }, [hasMore, isLoading]);

  // Function to load more posts
  const loadMorePosts = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      let newPosts;
      //switch between getPosts and getSearchPosts based on keyword

      if (!keyword) {
        switch (filter) {
          case "created":
            newPosts = await getPosts({
              filter,
              excludingPostIdList: Array.from(excludedPostIds),
              count: 10,
              authorUserId: authorUserId,
            });
            break;
          default:
            newPosts = await getPosts({
              filter,
              excludingPostIdList: Array.from(excludedPostIds),
              count: 10,
            });
            break;
        }
      } else {
        newPosts = await getSearchPosts({
          keyword,
          excludingPostIdList: Array.from(excludedPostIds),
          count: 10,
        });
      }

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


      console.log("Load more Posts:", newPosts);
      console.log("excluded:", excludedPostIds)

      setCurrentPostsFetched(filteredPosts);
      // if (tags !== lastTags) {
      //   setLastTags(tags); // Update lastTags to the current tags
      // }
      setPosts((prevPosts) => {
        // Get existing post IDs for deduplication
        const existingPostIds = new Set(prevPosts.map(post => post.postId));

        // Filter out posts that already exist in the current state
        const uniqueNewPosts = filteredPosts.filter(post => !existingPostIds.has(post.postId));

        console.log(`Found ${filteredPosts.length - uniqueNewPosts.length} duplicate posts that were discarded`);

        // Only append posts that don't already exist
        return [...prevPosts, ...uniqueNewPosts];
      });

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
              <PostPreview post={post} removePostFromPostlist={removePostFromPostlist} />
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
        [1, 2, 3, 4].map((i) => <LoadingPostPreview key={i} />)
      ) : (
        <div className="text-center text-lg text-base-content/50 my-4">No posts available</div>
      )}
    </div>
  );
}