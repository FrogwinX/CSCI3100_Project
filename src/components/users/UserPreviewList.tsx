"use client";

import { useEffect, useRef, useState } from "react";
import { getSearchUser } from "@/utils/users";
import { getUserRelations } from "@/utils/profiles";
import { Users } from "@/utils/users";
import UserPreview from "@/components/users/UserPreview";

export default function UserList({
  searchKeyword = "",
  relationType = "",
}: {
  searchKeyword?: string;
  relationType?: string;
}) {
  const [users, setUsers] = useState<Users[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [excludedUserIds, setExcludedUserIds] = useState<Set<number>>(new Set());

  // Initial fetch
  useEffect(() => {
    const fetchInitialUsers = async () => {
      setIsLoading(true);
      try {
        let initialUsers;
        switch (relationType) {
          case "following":
            initialUsers = await getUserRelations({
              userIdTo: searchKeyword,
              relationship: "following",
            });
            break;
          case "followers":
            initialUsers = await getUserRelations({
              userIdTo: searchKeyword,
              relationship: "followers",
            });
            break;
          case "blocked":
            initialUsers = await getUserRelations({
              userIdTo: searchKeyword,
              relationship: "blocked",
            });
            break;
          default:
            initialUsers = await getSearchUser({
              keyword: searchKeyword,
            });
            break;
        }

        console.log("Initial users:", initialUsers);

        if (!initialUsers) {
          setHasMore(false);
          return;
        }

        // Store all user ids in a set to avoid duplicates
        setExcludedUserIds((prevExcludedIds) => {
          const newExcludedIds = new Set(prevExcludedIds);
          initialUsers.forEach((user) => newExcludedIds.add(Number(user.userId)));
          return newExcludedIds;
        });

        setUsers(initialUsers);
        setHasMore(initialUsers.length > 0);
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialUsers();
  }, [searchKeyword]);

  // Infinite scrolling observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreUsers();
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

  // Function to load more users
  const loadMoreUsers = async () => {
    if (isLoading || !hasMore || users.length === 0) return;

    setIsLoading(true);

    try {
      // Fetch more users
      let newUsers;
      switch (relationType) {
        case "following":
          newUsers = await getUserRelations({
            userIdTo: searchKeyword,
            relationship: "following",
            excludingUserIdList: Array.from(excludedUserIds),
          });
          break;
        case "followers":
          newUsers = await getUserRelations({
            userIdTo: searchKeyword,
            relationship: "followers",
            excludingUserIdList: Array.from(excludedUserIds),
          });
          break;
        case "blocked":
          newUsers = await getUserRelations({
            userIdTo: searchKeyword,
            relationship: "blocked",
            excludingUserIdList: Array.from(excludedUserIds),
          });
          break;
        default:
          newUsers = await getSearchUser({
            keyword: searchKeyword,
            excludingUserIdList: Array.from(excludedUserIds),
            count: 10,
          });
          break;
      }

      if (!newUsers || newUsers.length === 0) {
        setHasMore(false);
      } else {
        // Add new user IDs to excluded list
        setExcludedUserIds((prevExcludedIds) => {
          const newExcludedIds = new Set(prevExcludedIds);
          newUsers.forEach((user) => newExcludedIds.add(Number(user.userId)));
          return newExcludedIds;
        });

        setUsers((prevUsers) => [...prevUsers, ...newUsers]);
      }
    } catch (err) {
      console.error("Failed to load more users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col px-4 py-2">
      {users.length > 0 ? (
        <>
          {/* Map through users */}
          {users.map((user) => (
            <div key={user.userId} className="w-full">
              <UserPreview user={user} />
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
        <div className="text-center text-lg text-base-content/50 my-4">No users found</div>
      )}
    </div>
  );
}
