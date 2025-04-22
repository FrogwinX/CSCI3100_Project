"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export interface User {
  username?: string;
  email: string;
  profileImage?: string;
}

export default function UserInfo({ user }: { user: User }) {
  return (
    <div className="h-20 flex items-center gap-4">
      {/* User avatar */}
      <div className="avatar avatar-placeholder items-center gap-1">
        {user.profileImage ? (
          <div className="w-16 h-16 rounded-full">
            <Image
              src={user.profileImage}
              alt={""}
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

      {/* Username and email */}
      <div>
        <h3 className="text-lg font-bold">{user.username}</h3>
        <p className="text-base-content/70">Email: {user.email}</p>
      </div>
    </div>
  );
}
