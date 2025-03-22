"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { faThumbsDown, faThumbsUp, faComment } from "@fortawesome/free-regular-svg-icons";
import { MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function PostFooter({
  postId,
  postLikeCount,
  postDislikeCount,
  postCommentCount,
}: {
  postId: string;
  postLikeCount: number;
  postDislikeCount: number;
  postCommentCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLike = (e: MouseEvent) => {
    e.stopPropagation();
    alert("Like to be implemented");
  };

  const handleDislike = (e: MouseEvent) => {
    e.stopPropagation();
    alert("Dislike to be implemented");
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

  const handleShare = (e: MouseEvent) => {
    e.stopPropagation();
    alert("Share to be implemented");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Like, dislike*/}
      <div className="bg-base-200 rounded-xl">
        <button className="btn btn-sm" onClick={handleLike}>
          <FontAwesomeIcon icon={faThumbsUp} size="lg" />
        </button>
        <span className="text-xs cursor-default">
          {Intl.NumberFormat("en", {
            notation: "compact",
          }).format(postLikeCount - postDislikeCount)}
        </span>
        <button className="btn btn-sm" onClick={handleDislike}>
          <FontAwesomeIcon icon={faThumbsDown} size="lg" />
        </button>
      </div>

      {/* Comments*/}
      <button className="btn btn-sm" onClick={handleComment}>
        <FontAwesomeIcon icon={faComment} size="lg" />
        {Intl.NumberFormat("en", {
          notation: "compact",
        }).format(postCommentCount)}
      </button>

      {/* Share */}
      <button className="btn btn-sm" onClick={handleShare}>
        <FontAwesomeIcon icon={faShare} size="lg" />
        Share
      </button>
    </div>
  );
}
