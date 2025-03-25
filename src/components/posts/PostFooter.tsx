"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { faThumbsDown, faThumbsUp, faComment } from "@fortawesome/free-regular-svg-icons";
import {
  faThumbsDown as faThumbsDownSolid,
  faThumbsUp as faThumbsUpSolid,
  faLink,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { MouseEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";

export default function PostFooter({
  postId,
  postLikeCount,
  postDislikeCount,
  postCommentCount,
  postIsLiked,
  postIsDisliked,
}: {
  postId: string;
  postLikeCount: number;
  postDislikeCount: number;
  postCommentCount: number;
  postIsLiked: boolean;
  postIsDisliked: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { session } = useSession();

  const [userLiked, setUserLiked] = useState(postIsLiked);
  const [userDisliked, setUserDisliked] = useState(postIsDisliked);
  const [likeCount, setLikeCount] = useState(postLikeCount);
  const [dislikeCount, setDislikeCount] = useState(postDislikeCount);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Function to make API call for like/dislike
  const updateLikeStatus = async (action: "like" | "dislike" | "unlike" | "undislike") => {
    setIsLoading(true);

    try {
      const isRemoveAction = action === "unlike" || action === "undislike";
      const url = isRemoveAction ? "/api/Forum/unlikeOrUndislike" : "/api/Forum/likeOrDislike";

      const response = await fetch(url, {
        method: isRemoveAction ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({
          postId: parseInt(postId),
          userId: session.userId,
          action: action,
        }),
      });

      if (!response.ok) {
        console.error("Failed to update like status:", await response.text());
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      if (data.data.isSuccess) {
        if (action === "like") {
          setUserLiked(true);
          setUserDisliked(false);
          setLikeCount((prev) => prev + 1);
          if (userDisliked) setDislikeCount((prev) => prev - 1);
        } else if (action === "dislike") {
          setUserDisliked(true);
          setUserLiked(false);
          setDislikeCount((prev) => prev + 1);
          if (userLiked) setLikeCount((prev) => prev - 1);
        } else if (action === "unlike") {
          setUserLiked(false);
          setLikeCount((prev) => prev - 1);
        } else if (action === "undislike") {
          setUserDisliked(false);
          setDislikeCount((prev) => prev - 1);
        }
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Event handlers
  const handleLike = (e: MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    if (userLiked) {
      updateLikeStatus("unlike");
    } else {
      updateLikeStatus("like");
    }
  };

  const handleDislike = (e: MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    if (userDisliked) {
      updateLikeStatus("undislike");
    } else {
      updateLikeStatus("dislike");
    }
  };

  const handleComment = (e: MouseEvent) => {
    e.stopPropagation();
    if (pathname.includes(`/forum/post/${postId}`)) {
      // Scroll to comments section if already on the post page
      document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/forum/post/${postId}#comments`);
    }
  };

  const handleLinkCopy = async (e: MouseEvent) => {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(`${window.location.origin}/forum/post/${postId}`);
      setShowToast(true);

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleShare = async (e: MouseEvent) => {
    e.stopPropagation();

    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          url: `${window.location.origin}/forum/post/${postId}`,
        });
      } catch (err) {
        console.error("Error sharing: ", err);
      }
    } else {
      // Fallback to copy if share API is not available
      handleLinkCopy(e);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Toast notification */}
      {showToast && (
        <div className="toast toast-center">
          <div className="alert alert-success">
            <span>Link copied to clipboard!</span>
          </div>
        </div>
      )}

      {/* Like, dislike */}
      <div className="bg-base-200 rounded-xl">
        <button className="btn btn-sm" onClick={handleLike} disabled={isLoading}>
          <FontAwesomeIcon icon={userLiked ? faThumbsUpSolid : faThumbsUp} size="lg" />
        </button>
        <span className="text-xs cursor-default">
          {Intl.NumberFormat("en", {
            notation: "compact",
          }).format(likeCount - dislikeCount)}
        </span>
        <button className="btn btn-sm" onClick={handleDislike} disabled={isLoading}>
          <FontAwesomeIcon icon={userDisliked ? faThumbsDownSolid : faThumbsDown} size="lg" />
        </button>
      </div>

      {/* Comments */}
      <button className="btn btn-sm" onClick={handleComment}>
        <FontAwesomeIcon icon={faComment} size="lg" />
        {Intl.NumberFormat("en", {
          notation: "compact",
        }).format(postCommentCount)}
      </button>

      {/* Share */}
      <div className="dropdown dropdown-start">
        <div tabIndex={0} role="button" className="btn btn-sm">
          <FontAwesomeIcon icon={faShare} size="lg" />
          Share
        </div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box shadow w-35">
          <li>
            <button onClick={handleLinkCopy}>
              <FontAwesomeIcon icon={faLink} />
              Copy link
            </button>
          </li>
          <li>
            <button onClick={handleShare}>
              <FontAwesomeIcon icon={faShareNodes} />
              Share via...
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
