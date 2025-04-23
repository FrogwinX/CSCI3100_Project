"use client";

import UserAvatar from "@/components/users/UserAvatar";
import { useSession } from "@/hooks/useSession";

export default function UserInfo() {

  const { session } = useSession();

  return (
    <div className="card-body p-0 gap-2">
      <div className="h-15 flex items-center gap-6">
        {/* User avatar */}
        <div className="avatar avatar-placeholder items-center gap-1">
          <UserAvatar src={session.avatar!} size="lg" />
        </div>

        {/* Username and email */}
        <div>
          <h3 className="text-xl font-bold">{session.username}</h3>
          <p className="text-base-content/70">{session.email}</p>
        </div>
      </div>
      <div className="divider my-0"></div>
    </div>
  );
}
