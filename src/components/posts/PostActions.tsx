"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faPenToSquare, faFlag } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function PostActions({ postId, postUsername }: { postId: string; postUsername: string }) {
  const router = useRouter();
  const { user } = useAuth();

  // Check if the current user is the author of the post
  const isAuthor = user?.username === postUsername;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const handleEdit = (e: MouseEvent) => {
    e.stopPropagation();
    router.push(`/forum/edit/${postId}`);
  };

  const handleDelete = async (e: MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        // Call your API to delete the post
        // await deletePost(postId);
        alert("Post would be deleted"); // Replace with actual API call
        router.refresh();
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  const handleReport = (e: MouseEvent) => {
    e.stopPropagation();
    alert("Report functionality would open here");
  };

  return (
    <div className="flex gap-1" onClick={handleClick}>
      <button className="btn btn-primary btn-sm">
        <span className="font-bold">Follow</span>
      </button>

      {/* Options menu */}
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm">
          <FontAwesomeIcon icon={faEllipsis} size="xl" />
        </div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 shadow-lg w-26">
          {/* Show edit/delete only if user is author */}
          {isAuthor && (
            <>
              <li className="w-full">
                <a onClick={handleEdit}>
                  <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                  <span>Edit</span>
                </a>
              </li>
              <li className="w-full">
                <a onClick={handleDelete}>
                  <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                  <span>Delete</span>
                </a>
              </li>
            </>
          )}

          {/* Show report only if user is NOT author */}
          {!isAuthor && (
            <li>
              <a onClick={handleReport}>
                <FontAwesomeIcon icon={faFlag} size="lg" />
                <span>Report</span>
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
