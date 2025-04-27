"use client";

import UserAvatar from "@/components/users/UserAvatar";
import UserStat from "./UserStat";
import { Profile, userInteract } from "@/utils/profiles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommenting, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faBan, faEllipsis, faPenToSquare, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserInfo({ profile }: { profile: Profile }) {

  const router = useRouter();
  const { session } = useSession();
  const [userFollowed, setUserFollowed] = useState(profile.isUserFollowed);
  const [userBlocked, setUserBlocked] = useState(profile.isUserBlocked);
  const isMe = session.username === profile.username;

  const handleFollow = () => {
    if (userFollowed) {
      setUserFollowed(false);
      userInteract(profile.userId, "unfollow");
    } else {
      setUserFollowed(true);
      userInteract(profile.userId, "follow");
    }
  };

  const handleBlock = () => {
    if (userBlocked) {
      setUserBlocked(false);
      userInteract(profile.userId, "unblock");
    } else {
      setUserBlocked(true);
      userInteract(profile.userId, "block");
    }
  };

  const handleMessage = () => {
    router.push(`/messages`);
  };

  const handleEdit = () => {
    alert("Edit to be implemented");
    // router.push(`/forum/post/${postId}/edit`);
  };

  return (
    <div className="card lg:min-w-lg gap-0 bg-base-100 shadow-md p-2">
      <div className="flex gap-6">
        <div className="flex items-center gap-6 p-4">
          {/* User avatar */}
          <div className="avatar avatar-placeholder items-center gap-1">
            <UserAvatar src={profile.avatar!} size="xxl" />
          </div>

          {/* Username */}
          <div>
            <h3 className="text-2xl font-bold">{profile.username}</h3>
          </div>
        </div>

        <div className="w-full">
          <div className="flex gap-6 flex justify-end">

            {/* Show follow only if user is NOT me */}
            {!isMe && (
              <button className={`btn btn-sm ${userFollowed? "btn-error" : "btn-primary"}`} onClick={handleFollow}>
                {userFollowed ?
                  <><FontAwesomeIcon icon={faTimes} size="lg" /><span>Unfollow</span></> :
                  <><FontAwesomeIcon icon={faHeart} size="lg" /><span>Follow</span></>}
              </button>
            )}

            {/* Show message button only if user is NOT me */}
            {!isMe && (
              <button className="btn btn-sm" onClick={handleMessage}>
                <FontAwesomeIcon icon={faCommenting} size="lg" />
                Message
              </button>
            )}

            {/* Options menu */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className={`btn btn-ghost btn-circle btn-sm`}>
                <FontAwesomeIcon icon={faEllipsis} size="xl" />
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 shadow-lg">
                {/* Show edit only if user is me */}
                {isMe && (
                  <>
                    <li className="w-full">
                      <a onClick={handleEdit}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                        <span>Edit</span>
                      </a>
                    </li>
                  </>
                )}

                {/* Show block only if user is NOT me */}
                {!isMe && (
                  <li>
                    <a onClick={handleBlock}>
                      {userBlocked ?
                        <><FontAwesomeIcon icon={faTimes} /><span>Unblock</span></> :
                        <><FontAwesomeIcon icon={faBan} /><span>Block</span></>}
                    </a>
                  </li>
                )}

              </ul>
            </div>
          </div>

          {/* User Stat */}
          <div className="flex justify-center gap-10 w-full p-4">
            <UserStat data={profile.followingCount} type={"following"} />
            <UserStat data={profile.followerCount} type={"follower"} />
            <UserStat data={profile.likeCount - profile.dislikeCount} type={"like"} />
          </div>

        </div>

      </div>

      <div className="flex items-center gap-6 p-4">
        <h3 className="text-md text-base-content/70">
          {profile.description}
        </h3>
      </div>
    </div>
  );
}
