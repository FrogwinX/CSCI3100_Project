"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { Users, followUser, unfollowUser } from "@/utils/users";
import Link from "next/link";
import { useState } from "react";
import UserAvatar from "@/components/users/UserAvatar";

export default function UserPreview({ user }: { user: Users }) {
  const [isFollowed, setIsFollowed] = useState(user.isUserFollowed);

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation(); // Stop event propagation
    if (user.isUserFollowed) {
      // If the user is already followed, unfollow them
      unfollowUser(user.userId).then((response) => {
        if (response) {
          setIsFollowed(!isFollowed); // Toggle the follow state
        }
      });
    }
    else {
      followUser(user.userId).then((response) => {
        if (response) {
          setIsFollowed(!isFollowed); // Toggle the follow state
        }
      }
      );
      setIsFollowed(user.isUserFollowed);
    }
    // Here you would call an API to follow/unfollow the user
    // For example: followUser(user.userId) or unfollowUser(user.userId)
  };

  return (
    <Link href={`/profile/${user.username}`} className="flex w-full">
      <div className="card hover:bg-base-200/40 px-2 w-full">
        <div className="card-body p-4 gap-2 w-full ">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* User avatar */}
              <UserAvatar
                src={user.avatar}
                size="lg"
              />
              {/* Username */}
              <div>
                <h3 className="text-lg font-bold">{user.username}</h3>
                <p className="line-clamp-1 text-base-content/70">{user.description}</p>
              </div>
            </div>

            {/* Follow/Unfollow Button */}
            <div className="flex gap-2">
              {isFollowed ? (
                <button
                  onClick={handleFollowToggle}
                  className="btn btn-sm btn-error bg-red-400 text-error-content border-none" //color 
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    size="2xl"
                  />
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  className="btn btn-blocks btn-sm btn-primary"
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    size="xl"
                  />
                  Follow
                </button>
              )}
              <button className="btn btn-sm btn-content">
                <FontAwesomeIcon
                  icon={faCommentDots}
                  size="xl"
                />
                Message
              </button>
            </div>

            {/* button that jumps to the direct message of the target user */}

          </div>
        </div>
      </div>
    </Link >
  );
}
