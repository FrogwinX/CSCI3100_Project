"use client";

import UserAvatar from "@/components/users/UserAvatar";
import UserStat from "./UserStat";
import { Profile, updateProfile, userInteract } from "@/utils/profiles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommenting, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faBan, faCheck, faEllipsis, faPenToSquare, faTimes, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditableBox from "./EditableBox";

export default function UserInfo({ profile }: { profile: Profile }) {

  const router = useRouter();
  const { session } = useSession();
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(true);
  const [userFollowed, setUserFollowed] = useState(profile.isUserFollowed);
  const [userBlocked, setUserBlocked] = useState(profile.isUserBlocked);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile.username);
  const [userDescription, setUserDescription] = useState(profile.description);
  const [usernameFormData, setUsernameFormData] = useState(profile.username);
  const [userDescriptionFormData, setUserDescriptionFormData] = useState(profile.description);
  const [userAvatarFormData, setUserAvatarFormData] = useState(profile.avatar);
  const isMe = session.username === profile.username;

  const editProfile = async () => {
    setIsEditing(false);
    setUsernameFormData(username);
    setUserDescriptionFormData(userDescription);
    await updateProfile(usernameFormData, userDescriptionFormData);
  };

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
    setIsDropdownMenuOpen(false);
    setIsEditing(true);
    setIsDropdownMenuOpen(true);
  };

  return (
    <div className="card lg:min-w-lg gap-0 bg-base-100 shadow-md p-2">
      <div className="flex gap-6">
        <div className="flex items-center gap-6 p-4 w-full">
          {/* User avatar */}
          <div className="avatar avatar-placeholder items-center gap-1">
            <UserAvatar src={profile.avatar!} size="xxl" />
          </div>

          {/* Username */}
          <div className=" w-full break-words">
            <h3 className="text-2xl font-bold">
              {isEditing ? (
                <EditableBox initialText={usernameFormData} onSave={(newText: string) => { setUsername(newText); }} />
              ) : (
                <div className="w-full break-words">{usernameFormData}</div>
              )}
            </h3>
          </div>
        </div>

        <div>
          <div className="flex gap-6 flex justify-end">

            {/* Show follow only if user is NOT me */}
            {!isMe && (
              <button className={`btn btn-sm ${userFollowed ? "btn-error" : "btn-primary"}`} onClick={handleFollow}>
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

            {/* Edit confirm buttons */}
            <div className="flex justify-end gap-6 p-1 w-full" hidden={!isEditing}>
              <button onClick={() => { setIsEditing(false); }}>
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
              <button onClick={() => {editProfile(); }}>
                <FontAwesomeIcon icon={faCheck} size="lg" />
              </button>
            </div>

            {/* Options menu */}
            <div className="dropdown dropdown-end" hidden={isEditing}>
              <div tabIndex={0} role="button" className={`btn btn-ghost btn-circle btn-sm`}>
                <FontAwesomeIcon icon={faEllipsis} size="xl" />
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 shadow-lg">
                {/* Show edit only if user is me */}
                {isMe && isDropdownMenuOpen && (
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
        <h3 className="text-md text-base-content/70 w-full">
          {isEditing ? (
            <EditableBox initialText={userDescriptionFormData} onSave={(newText: string) => { setUserDescription(newText); }} />
          ) : (
            <div className="w-full break-words">{userDescriptionFormData}</div>
          )}
        </h3>
      </div>
    </div>
  );
}
