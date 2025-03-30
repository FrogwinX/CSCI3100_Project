"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";

export interface Users {
  userId: number;
  username: string;
  profileImage: string;
}

export default function UserPreview({ user }: { user: Users }) {
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
