"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faPenToSquare, faFlag, faUser } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import UserAvatar from "@/components/users/UserAvatar";

export default function PostHeader({
  postId,
  postUserId,
  postUsername,
  postUpdatedAt,
  postUserAvatar,
  size = "sm",
}: {
  postId: string;
  postUserId: string;
  postUsername: string;
  postUpdatedAt: string;
  postUserAvatar: string | null;
  size?: "sm" | "md";
}) {
  const router = useRouter();
  const { session } = useSession();

  // Check if the current user is the author of the post
  const isAuthor = session.username === postUsername;

  const handleEdit = (e: MouseEvent) => {
    e.stopPropagation();
    router.push(`/forum/post/${postId}/edit`);
  };

  const handleDelete = async (e: MouseEvent) => {
    e.stopPropagation();
    alert("Delete to be implemented");
  };

  const handleReport = (e: MouseEvent) => {
    e.stopPropagation();
    alert("Report to be implemented");
  };

  const textSize = size === "md" ? "text-sm" : "text-xs";

  return (
    <div className="flex justify-between items-center my-1">
      {/** Avatar, username, time */}
      <div className="flex">
        {/** Avatar and username */}
        <Link href={`/profile/${postUserId}`}>
          <UserAvatar src={postUserAvatar} username={postUsername} size={size} />
        </Link>
        {/** Time */}
        <div className="flex items-center mx-0.5 gap-0.5">
          <span className={`${textSize} font-thin`}>•</span>
          <span className={`${textSize} font-light`}>{moment(postUpdatedAt).fromNow()}</span>
        </div>
      </div>
      <div className="flex gap-1">
        {/* Options menu */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className={`btn btn-ghost btn-circle btn-${size}`}>
            <FontAwesomeIcon icon={faEllipsis} size="xl" />
          </div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 shadow-lg w-26">
            {/* Show edit/delete only if user is author */}
            {isAuthor && (
              <>
                <li className="w-full">
                  <a onClick={handleEdit}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                    <span>Edit</span>
                  </a>
                </li>
                <li className="w-full">
                  <a onClick={handleDelete}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                    <span>Delete</span>
                  </a>
                </li>
              </>
            )}

            {/* Show report only if user is NOT author */}
            {!isAuthor && (
              <li>
                <a onClick={handleReport}>
                  <FontAwesomeIcon icon={faFlag} />
                  <span>Report</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
