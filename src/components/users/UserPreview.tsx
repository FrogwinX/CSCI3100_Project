"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHeart, faCross } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export interface Users {
  userId: number;
  username: string;
  profileImage: string;
  isUserBlocked?: boolean;
  isUserFollowed?: boolean;
}

export default function UserPreview({ user }: { user: Users }) {
  const [isFollowed, setIsFollowed] = useState(user.isUserFollowed);

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation(); // Stop event propagation
    setIsFollowed(!isFollowed);
    // Here you would call an API to follow/unfollow the user
    // For example: followUser(user.userId) or unfollowUser(user.userId)
  };
  return (
    <Link href={`/profile/${user.username}`} className="block">
      <div className="card hover:bg-base-200/40 px-2">
        <div className="card-body p-4 gap-2">
          <div className="flex items-center gap-4">
            {/* User avatar */}
            <div className="avatar">
              {user.profileImage ? (
                <div className="w-16 h-16 rounded-full">
                  <Image
                    src={user.profileImage}
                    alt={user.username}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
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
          </div>
        </div>
      </div>
    </Link>
  );
}
