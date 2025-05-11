"use client";

import UserAvatar from "@/components/users/UserAvatar";
import UserStat from "./UserStat";
import { Profile, updateProfile, userInteract } from "@/utils/profiles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommenting, faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faBan,
  faCheck,
  faEllipsis,
  faImage,
  faPenToSquare,
  faTimes,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useSession } from "@/hooks/useSession";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import EditableBox from "./EditableBox";
import { checkUsernameUnique } from "@/utils/authentication";
import Link from "next/link";

export default function UserInfo({ profile }: { profile: Profile }) {
  const maxImageSize = 1 * 1024 * 1024; // Change this when the config has changed
  const router = useRouter();
  const { session, refresh } = useSession();
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(true);
  const [userFollowed, setUserFollowed] = useState(profile.isUserFollowed);
  const [userBlocked, setUserBlocked] = useState(profile.isUserBlocked);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile.username);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [userDescription, setUserDescription] = useState(profile.description);
  const [userAvatar, setUserAvatar] = useState<File | null>(null);
  const [userAvatarPreview, setUserAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMe = session.userId ? session.userId.toString() == profile.userId : true;
  const pathName = usePathname();

  const editProfile = async () => {
    if (usernameErrorMessage.length > 0) {
      return;
    }
    setIsEditing(false);
    profile.username = username;
    profile.description = userDescription;
    await updateProfile(username, userDescription, userAvatar);
    await refresh();
    window.location.reload();
  };

  const handleFollow = async () => {
    if (userFollowed) {
      setUserFollowed(false);
      await userInteract(profile.userId, "unfollow");
    } else {
      setUserFollowed(true);
      await userInteract(profile.userId, "follow");
    }
  };

  const handleBlock = async () => {
    if (userBlocked) {
      await userInteract(profile.userId, "unblock");
    } else {
      await userInteract(profile.userId, "block");
      if (userFollowed) {
        await userInteract(profile.userId, "unfollow");
      }
    }
    window.location.reload();
  };

  const handleEdit = () => {
    setIsDropdownMenuOpen(false);
    setIsEditing(true);
    setIsDropdownMenuOpen(true);
  };

  const handleUploadAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxImageSize) {
        alert(`File size exceeds the ${maxImageSize / 1024 / 1024} MB limit.`);
        return;
      }
      setUserAvatar(file);
      setUserAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUsernameChange = async (newUsername: string) => {
    if (newUsername.length === 0) {
      setUsernameErrorMessage("Username cannot be empty");
      return;
    } else if (newUsername.length > 50) {
      setUsernameErrorMessage("Username cannot exceed 50 characters");
      return;
    } else if (newUsername.includes("@") || newUsername.includes(" ") || newUsername.includes(":")) {
      setUsernameErrorMessage("Username cannot contain the symbol ':', '@' or space");
      return;
    } else {
      setUsernameErrorMessage("");
    }

    const result = await checkUsernameUnique(newUsername);
    if (!result.data.isUsernameUnique && newUsername !== session.username) {
      setUsernameErrorMessage("This username has been used");
      return;
    } else {
      setUsernameErrorMessage("");
    }
  };

  return (
    <>
      <div className="flex gap-6">
        <div className="flex items-center gap-6 p-4 overflow-auto w-full">
          {/* User avatar */}
          <div className="avatar avatar-placeholder items-center gap-1">
            <div className="z-10">
              {userAvatarPreview ? (
                <UserAvatar src={userAvatarPreview!} size="xxl" />
              ) : (
                <UserAvatar src={profile.avatar!} size="xxl" />
              )}
            </div>
            <div className="absolute z-20">
              {isEditing ? (
                <div className="avatar avatar-placeholder gap-1 items-center">
                  <div
                    className="bg-neutral/50 text-neutral-content w-28 h-28 rounded-full"
                    onClick={handleUploadAvatar}
                  >
                    <FontAwesomeIcon icon={faImage} size="lg" />
                    <input
                      type="file"
                      size={maxImageSize}
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* Username */}
          <div className="flex-1 min-w-0 w-full overflow-auto">
            <div className={`${username.length > 18 ? "text-xl" : "text-2xl"} whitespace-normal break-words`}>
              {isEditing ? (
                <EditableBox
                  initialText={username}
                  isEnterEable={false}
                  onSave={(newText: string) => {
                    setUsername(newText);
                    handleUsernameChange(newText);
                  }}
                />
              ) : (
                username
              )}
              {isEditing && usernameErrorMessage.length > 0 ? (
                <div className="text-xs text-error">*{usernameErrorMessage}</div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full p-1">
          <div className="flex gap-6 justify-end">
            {/* Show follow only if user is NOT me and not blocked */}
            {!isMe && !userBlocked && (
              <button className={`btn ${userFollowed ? "btn-soft btn-error" : "btn-primary"}`} onClick={handleFollow}>
                {userFollowed ? (
                  <>
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                    <span>Unfollow</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faHeart} size="lg" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}

            {/* Show message button only if user is NOT me and not blocked */}
            {!isMe && !userBlocked && (
              <Link href={`/messages`}>
                <button className="btn">
                  <FontAwesomeIcon icon={faCommenting} size="lg" />
                  Message
                </button>
              </Link>
            )}

            {/* Edit confirm buttons */}
            <div className="flex justify-end gap-6 p-2 w-full" hidden={!isEditing}>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setUsername(profile.username);
                  setUserDescription(profile.description);
                  setUserAvatar(null);
                  setUserAvatarPreview(null);
                  setUsernameErrorMessage("");
                }}
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
              <button
                onClick={() => {
                  editProfile();
                }}
              >
                <FontAwesomeIcon icon={faCheck} size="lg" />
              </button>
            </div>

            {/* Options menu */}
            <div className="dropdown dropdown-end" hidden={isEditing}>
              <div tabIndex={0} role="button" className={`btn btn-ghost btn-circle`}>
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
                      {userBlocked ? (
                        <>
                          <FontAwesomeIcon icon={faTimes} />
                          Unblock
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faBan} />
                          Block
                        </>
                      )}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* User Stat */}
          <div className="flex gap-10 p-4 items-center">
            {isMe ? (
              <>
                <Link href={`${pathName}/following`}>
                  <UserStat data={profile.followingCount} type="following" />
                </Link>
                <Link href={`${pathName}/followers`}>
                  <UserStat data={profile.followerCount} type="followers" />
                </Link>
              </>
            ) : (
              <>
                <UserStat data={profile.followingCount} type="following" />
                <UserStat data={profile.followerCount} type="followers" />
              </>
            )}
            <UserStat data={profile.likeCount - profile.dislikeCount} type={"like"} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 p-4">
        <h3 className="text-md text-base-content/70 w-full">
          {isEditing ? (
            <EditableBox
              initialText={userDescription}
              isEnterEable={true}
              onSave={(newText: string) => {
                setUserDescription(newText);
              }}
            />
          ) : (
            <div className="w-full break-words whitespace-pre-wrap">{userDescription}</div>
          )}
        </h3>
      </div>
    </>
  );
}
