"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { faThumbsDown, faThumbsUp, faComment } from "@fortawesome/free-regular-svg-icons";
import { MouseEvent } from "react";
import { Post } from "./PostPreview";

export default function PostFooter({ post }: { post: Post }) {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex items-center gap-2" onClick={handleClick}>
      {/* Like, dislike*/}
      <div className="bg-base-200 rounded-xl">
        <button className="btn btn-sm">
          <FontAwesomeIcon icon={faThumbsUp} size="lg" />
        </button>
        <span className="text-xs">
          {Intl.NumberFormat("en", {
            notation: "compact",
          }).format(post.likeCount - post.dislikeCount)}
        </span>
        <button className="btn btn-sm">
          <FontAwesomeIcon icon={faThumbsDown} size="lg" />
        </button>
      </div>

      {/* Comments*/}
      <button className="btn btn-sm">
        <FontAwesomeIcon icon={faComment} size="lg" />
        {Intl.NumberFormat("en", {
          notation: "compact",
        }).format(post.commentCount)}
      </button>

      {/* Share */}
      <button className="btn btn-sm">
        <FontAwesomeIcon icon={faShare} size="lg" />
        Share
      </button>
    </div>
  );
}
