"use client";
import React, { useEffect, useState } from "react";
import { getCommentList, createComment } from "@/utils/posts";
import UserAvatar from "@/components/users/UserAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as faThumbsUpSolid, faThumbsDown as faThumbsDownSolid } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-regular-svg-icons";

interface CommentListProps {
  postId: string;
  userId: string;
  subCommentVisibility: Record<string, boolean>;
  setSubCommentVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

function CommentFormInline({ parentId, userId, onSuccess, replyToNumber, nextSubNumber }: { parentId: string; userId: string; onSuccess: () => void; replyToNumber?: string; nextSubNumber?: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let finalContent = content;
      if (nextSubNumber) {
        finalContent = nextSubNumber + (replyToNumber ? ` (reply to ${replyToNumber}) ` : " ") + content;
      }
      await createComment(parentId, userId, finalContent);
      setContent("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-2 mt-2">
      <textarea
        className="textarea textarea-bordered w-full min-h-[3rem]"
        placeholder="Reply..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={500}
        disabled={loading}
      />
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-400">{content.length}/500</span>
        <button type="submit" className="btn btn-primary btn-xs" disabled={loading}>
          {loading ? "Posting..." : "Reply"}
        </button>
      </div>
      {error && <div className="text-red-500 mt-1">{error}</div>}
    </form>
  );
}

function CommentItem({
  comment,
  userId,
  onReplySuccess,
  onLikeDislike,
  showLikeDislike = true,
  numberPrefix = "",
  index = 0,
  subCommentVisibility,
  setSubCommentVisibility,
}: {
  comment: any;
  userId: string;
  onReplySuccess: () => void;
  onLikeDislike: (commentId: string, action: "like" | "dislike" | "unlike" | "undislike") => void;
  showLikeDislike?: boolean;
  numberPrefix?: string;
  index?: number;
  subCommentVisibility?: Record<string, boolean>;
  setSubCommentVisibility?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyToNumber, setReplyToNumber] = useState<string | undefined>(undefined);
  const [replyToSubNumber, setReplyToSubNumber] = useState<string | undefined>(undefined);

  const commentNumber = numberPrefix ? `${numberPrefix}-${index + 1}` : `C${index + 1}`;
  let contentWithNumber = comment.content;
  if (!contentWithNumber.startsWith("C")) {
    contentWithNumber = `${commentNumber} ${contentWithNumber}`;
  }
  const subComments = Array.isArray(comment.commentList) ? comment.commentList : [];
  const nextSubNumber = (subComments.length > 0)
    ? `${commentNumber}-${subComments.length + 1}`
    : `${commentNumber}-1`;

  // Like/dislike handler
  const handleLike = () => {
    if (comment.isLiked) {
      onLikeDislike(comment.postId, "unlike");
    } else if (comment.isDisliked) {
      onLikeDislike(comment.postId, "undislike");
      onLikeDislike(comment.postId, "like");
    } else {
      onLikeDislike(comment.postId, "like");
    }
  };
  const handleDislike = () => {
    if (comment.isDisliked) {
      onLikeDislike(comment.postId, "undislike");
    } else if (comment.isLiked) {
      onLikeDislike(comment.postId, "unlike");
      onLikeDislike(comment.postId, "dislike");
    } else {
      onLikeDislike(comment.postId, "dislike");
    }
  };

  const isMainComment = numberPrefix === "";
  const showSubComments = isMainComment && subCommentVisibility && comment.postId in subCommentVisibility
    ? subCommentVisibility[comment.postId]
    : true;
  const toggleSubComments = () => {
    if (isMainComment && setSubCommentVisibility) {
      setSubCommentVisibility((prev) => ({ ...prev, [comment.postId]: !prev[comment.postId] }));
    }
  };

  return (
    <div className={`w-full ${numberPrefix ? "ml-12 border-l-2 border-base-300 pl-6 max-w-[92%]" : "max-w-full"} pb-2`}>
      <div className="flex items-start justify-between w-full">
        <div className="flex items-start w-full">
          <UserAvatar src={comment.avatar} username={comment.username} size="sm" />
          <div className="ml-3 w-full">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-400 font-mono bg-gray-100 rounded px-1.5 py-0.5 mr-1 align-middle">{commentNumber}</span>
              <span className="font-semibold text-base align-middle">{comment.username}</span>
              <span className="text-xs text-gray-400 align-middle">{new Date(comment.updatedAt).toLocaleString()}</span>
            </div>
            <div className="text-base-content break-words whitespace-pre-wrap">
              <span dangerouslySetInnerHTML={{ __html: comment.content }} />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => {
                  setShowReplyBox((v) => !v);
                  setReplyToNumber(undefined);
                  setReplyToSubNumber(undefined);
                }}
              >
                {showReplyBox && !replyToSubNumber ? "Cancel" : "Reply"}
              </button>
            </div>
            {showReplyBox && !replyToSubNumber && (
              <div className="mt-2">
                <CommentFormInline
                  parentId={comment.postId}
                  userId={userId}
                  onSuccess={onReplySuccess}
                  replyToNumber={undefined}
                  nextSubNumber={nextSubNumber}
                />
              </div>
            )}
          </div>
        </div>
        {showLikeDislike && (
          <div className="flex flex-col items-end ml-4 min-w-[70px]">
            <div className="flex items-center bg-base-200 rounded-xl px-3 py-1 gap-2 mb-1">
              <button className="btn btn-sm btn-ghost p-0" onClick={handleLike} title="Like">
                <FontAwesomeIcon icon={comment.isLiked ? faThumbsUpSolid : faThumbsUp} size="lg" />
              </button>
              <span className="text-xs font-semibold">
                {Intl.NumberFormat("en", { notation: "compact" }).format(comment.likeCount - comment.dislikeCount)}
              </span>
              <button className="btn btn-sm btn-ghost p-0" onClick={handleDislike} title="Dislike">
                <FontAwesomeIcon icon={comment.isDisliked ? faThumbsDownSolid : faThumbsDown} size="lg" />
              </button>
            </div>
            <button className="btn btn-sm btn-ghost p-0" title="More options">
              <span className="text-xl">...</span>
            </button>
          </div>
        )}
      </div>
      {/* 子留言（回覆） */}
      {subComments.length > 0 && (
        <>
          {isMainComment && (
            <button
              className="block text-gray-400 text-sm my-2 mx-2 hover:underline hover:text-gray-600"
              style={{ fontFamily: 'monospace', letterSpacing: 1 }}
              onClick={toggleSubComments}
            >
              {showSubComments ? "----- Hide comment" : "----- Show comment"}
            </button>
          )}
          {showSubComments && (
            <div className="mt-2">
              {subComments.map((child: any, idx: number) => (
                <CommentItem
                  key={child.postId}
                  comment={child}
                  userId={userId}
                  onReplySuccess={onReplySuccess}
                  onLikeDislike={onLikeDislike}
                  showLikeDislike={showLikeDislike}
                  numberPrefix={commentNumber}
                  index={idx}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CommentList({ postId, userId, subCommentVisibility, setSubCommentVisibility }: CommentListProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getCommentList(postId, userId)
      .then((list) => {
        setComments(list);
        // 只對新出現的主 comment 設定預設值，保留用戶已經操作過的狀態
        setSubCommentVisibility((prev) => {
          const updated = { ...prev };
          list.forEach((c: any) => {
            if (!(c.postId in updated)) {
              updated[c.postId] = false;
            }
          });
          return updated;
        });
      });
  }, [postId, userId]);

  useEffect(() => {
    setLoading(true);
    getCommentList(postId, userId)
      .then((list) => {
        setComments(list);
        setError(null);
      })
      .catch((err) => {
        setError("Failed to load comments");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, userId, refreshKey]);

  // Like/dislike handler
  const handleLikeDislike = async (commentId: string, action: "like" | "dislike" | "unlike" | "undislike") => {
    const isRemoveAction = action === "unlike" || action === "undislike";
    const url = isRemoveAction ? "/api/Forum/unlikeOrUndislike" : "/api/Forum/likeOrDislike";
    await fetch(url, {
      method: isRemoveAction ? "DELETE" : "POST",
      body: JSON.stringify({
        postId: parseInt(commentId),
        userId: userId,
        action: action,
      }),
    });
    setComments((prevComments) => {
      const update = (c: any): any => {
        if (c.postId === commentId) {
          let likeCount = c.likeCount;
          let dislikeCount = c.dislikeCount;
          let isLiked = c.isLiked;
          let isDisliked = c.isDisliked;
          if (action === "like") {
            likeCount++;
            isLiked = true;
          } else if (action === "unlike") {
            likeCount--;
            isLiked = false;
          } else if (action === "dislike") {
            dislikeCount++;
            isDisliked = true;
          } else if (action === "undislike") {
            dislikeCount--;
            isDisliked = false;
          }
          return { ...c, likeCount, dislikeCount, isLiked, isDisliked };
        }
        if (c.commentList) {
          return { ...c, commentList: c.commentList.map(update) };
        }
        return c;
      };
      return prevComments.map(update);
    });
  };

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!comments.length) return <div>No comments yet.</div>;

  const handleAnyReplySuccess = () => setRefreshKey((k) => k + 1);

  return (
    <div className="flex flex-col gap-2">
      {comments.map((comment, idx) => (
        <CommentItem
          key={comment.postId}
          comment={comment}
          userId={userId}
          onReplySuccess={handleAnyReplySuccess}
          onLikeDislike={handleLikeDislike}
          showLikeDislike={true}
          numberPrefix=""
          index={idx}
          subCommentVisibility={subCommentVisibility}
          setSubCommentVisibility={setSubCommentVisibility}
        />
      ))}
    </div>
  );
} 