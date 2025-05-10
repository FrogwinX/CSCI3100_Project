"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHeart, faCross } from "@fortawesome/free-solid-svg-icons";
import { Users, followUser } from "@/utils/users";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function UserPreview({ user }: { user: Users }) {
  const [isFollowed, setIsFollowed] = useState(user.isUserFollowed);

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation(); // Stop event propagation
    followUser(user.userId).then((response) => {
      if (response) {
        setIsFollowed(!isFollowed); // Toggle the follow state
      }
    }
    );
    setIsFollowed(user.isUserFollowed);
    // Here you would call an API to follow/unfollow the user
    // For example: followUser(user.userId) or unfollowUser(user.userId)
  };

  return (
    <Link href={`/profile/${user.userId}`} className="block">
      <div className="card hover:bg-base-200/40 px-2">
        <div className="card-body p-4 gap-2">
          <div className="flex items-center gap-4">
            {/* User avatar */}
            <div className="avatar">
              {user.avatar ? (
                // If avatar exists, show the image
                <div className="w-16 h-16 rounded-full">
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                // If no avatar, show a default icon
                <div className="w-16 h-16 bg-neutral text-neutral-content rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} size="lg" />
                </div>
              )}
            </div>

            {/* Username */}
            <div>
              <h3 className="text-lg font-bold">{user.username}</h3>
              <p className="text-base-content/70">User ID: {user.userId}</p>
            </div>

            {/* Follow/Unfollow Button */}
            <button
              onClick={handleFollowToggle}
              className={`btn btn-blocks btn-sm ${isFollowed ? 'btn-error' : 'btn-primary'}`}
            >
              <FontAwesomeIcon
                icon={isFollowed ? faCross : faHeart}
                size="lg"
              />
            </button>

            {/* button that jumps to the direct message of the target user */}

          </div>
        </div>
      </div>
    </Link>
  );
}
