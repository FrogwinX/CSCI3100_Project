"use client";
import React, { useEffect, useState, useRef } from "react";
import { getCommentList, createComment, Post } from "@/utils/posts";
import UserAvatar from "@/components/users/UserAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as faThumbsUpSolid,
  faThumbsDown as faThumbsDownSolid,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-regular-svg-icons";
import { useSession } from "@/hooks/useSession";
import { getMyComments } from "@/utils/profiles";
import PostPreview from "@/components/posts/PostPreview";

interface CommentListProps {
  postId?: string;
  userId: string;
  onReplySuccess?: () => void;
}

function CommentFormInline({
  parentId,
  userId,
  onSuccess,
  replyToNumber,
  nextSubNumber,
}: {
  parentId: string;
  userId: string;
  onSuccess: () => void;
  replyToNumber?: string;
  nextSubNumber?: string;
}) {
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
      if (nextSubNumber && replyToNumber) {
        // sub comment reply: add (reply to Cx-y) to content
        finalContent = `${nextSubNumber} (reply to ${replyToNumber}) ${content}`;
      } else if (nextSubNumber) {
        // main comment reply: only add sub number
        finalContent = `${nextSubNumber} ${content}`;
      } else if (replyToNumber) {
        // sub comment reply (auto-assign sub number)
        finalContent = `(reply to ${replyToNumber}) ${content}`;
      }
      const response = await createComment(parentId, userId, finalContent);
      if (response) {
        setContent("");
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error("Failed to create comment");
      }
    } catch (err) {
      console.error("Error creating comment:", err);
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

function parseCommentNumber(str: string) {
  const match = str.match(/^C(\d+)(?:-(\d+))?/);
  if (!match) return [Infinity];
  const main = parseInt(match[1], 10);
  const sub = match[2] ? parseInt(match[2], 10) : 0;
  return [main, sub];
}

function stripCommentNumber(str: string) {
  return str.replace(/^C\d+(?:-\d+)?\s*/, "");
}

function renderCommentContent(str: string, showNumber: boolean, selfNumber?: string) {
  let html = str;

  if (!showNumber) {
    if (selfNumber) {
      const regex = new RegExp(`^${selfNumber}\\s*`);
      html = html.replace(regex, "");
    } else {
      html = html.replace(/^C\d+(?:-\d+)?\s*/, "");
    }
    html = html.replace(/\(reply to (C\d+(?:-\d+)?)\)\s*/, '<span style="color:#2563eb;font-size:0.95em;font-weight:400;">$1</span> ');
  } else {
    // highlight the reply-to reference
    html = html.replace(
      /\(reply to (C\d+(?:-\d+)?)\)/,
      '<span style="color:#2563eb;font-size:0.95em;font-weight:400;">$1</span>'
    );
    // highlight the leading comment number
    html = html.replace(
      /^(C\d+(?:-\d+)?)(?=\s)/,
      '<span style="color:#2563eb;font-size:0.95em;font-weight:400;">$1</span>'
    );
  }

  return html;
}

function CommentItem({
  comment,
  userId,
  onReplySuccess,
  showLikeDislike = true,
  numberPrefix = "",
  index = 0,
  subCommentVisibility,
  setSubCommentVisibility,
  mainCommentId,
  mainCommentNumber,
}: {
  comment: any;
  userId: string;
  onReplySuccess: () => void;
  showLikeDislike?: boolean;
  numberPrefix?: string;
  index?: number;
  subCommentVisibility?: Record<string, boolean>;
  setSubCommentVisibility?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  mainCommentId?: string;
  mainCommentNumber?: string;
}) {
  const { session } = useSession();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyToNumber, setReplyToNumber] = useState<string | undefined>(undefined);
  const [replyToSubNumber, setReplyToSubNumber] = useState<string | undefined>(undefined);
  const [showSubReplyBox, setShowSubReplyBox] = useState(false);
  const [subReplyToNumber, setSubReplyToNumber] = useState<string | undefined>(undefined);

  const [userLiked, setUserLiked] = useState(comment.isLiked);
  const [userDisliked, setUserDisliked] = useState(comment.isDisliked);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [dislikeCount, setDislikeCount] = useState(comment.dislikeCount);
  const [isLoading, setIsLoading] = useState(false);

  const updateLikeStatus = async (action: "like" | "dislike" | "unlike" | "undislike") => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const isRemoveAction = action === "unlike" || action === "undislike";
      const url = isRemoveAction ? "/api/Forum/unlikeOrUndislike" : "/api/Forum/likeOrDislike";
      const response = await fetch(url, {
        method: isRemoveAction ? "DELETE" : "POST",
        body: JSON.stringify({
          postId: parseInt(comment.postId),
          userId: session.userId,
          action: action,
        }),
      });
      if (!response.ok) {
        setIsLoading(false);
        return;
      }
      const data = await response.json();
      if (data.data && data.data.isSuccess) {
        if (action === "like") {
          setUserLiked(true);
          setLikeCount((prev: number) => prev + 1);
        } else if (action === "dislike") {
          setUserDisliked(true);
          setDislikeCount((prev: number) => prev + 1);
        } else if (action === "unlike") {
          setUserLiked(false);
          setLikeCount((prev: number) => prev - 1);
        } else if (action === "undislike") {
          setUserDisliked(false);
          setDislikeCount((prev: number) => prev - 1);
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isLoading) return;
    if (userLiked) {
      updateLikeStatus("unlike");
    } else if (userDisliked) {
      setIsLoading(true);
      try {
        await updateLikeStatus("undislike");
        await updateLikeStatus("like");
      } finally {
        setIsLoading(false);
      }
    } else {
      updateLikeStatus("like");
    }
  };

  const handleDislike = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isLoading) return;
    if (userDisliked) {
      updateLikeStatus("undislike");
    } else if (userLiked) {
      setIsLoading(true);
      try {
        await updateLikeStatus("unlike");
        await updateLikeStatus("dislike");
      } finally {
        setIsLoading(false);
      }
    } else {
      updateLikeStatus("dislike");
    }
  };

  // Extract comment number from content or generate new one
  const extractCommentNumber = (content: string) => {
    const match = content.match(/^C\d+(?:-\d+)?/);
    return match ? match[0] : null;
  };

  const commentNumber = extractCommentNumber(comment.content) || (numberPrefix ? `${numberPrefix}-${index + 1}` : `C${index + 1}`);
  
  // Update content with comment number if not present
  let contentWithNumber = comment.content;
  if (!extractCommentNumber(contentWithNumber)) {
    contentWithNumber = `${commentNumber} ${contentWithNumber}`;
  }

  const subComments = Array.isArray(comment.commentList)
    ? comment.commentList.slice().sort((a: any, b: any) => {
        // Sort sub-comments by their post ID to maintain consistent order
        return Number(a.postId) - Number(b.postId);
      })
    : [];

  // Calculate next sub-comment number based on the highest existing sub-comment number
  let maxSub = 0;
  subComments.forEach((c: any) => {
    const num = parseCommentNumber(c.content);
    if (num[1] > maxSub) maxSub = num[1];
  });
  const nextSubNumber = `${commentNumber}-${maxSub + 1}`;

  const isMainComment = numberPrefix === "";
  const showSubComments =
    isMainComment && subCommentVisibility && comment.postId in subCommentVisibility
      ? subCommentVisibility[comment.postId]
      : true;
  const toggleSubComments = () => {
    if (isMainComment && setSubCommentVisibility) {
      setSubCommentVisibility((prev) => ({ ...prev, [comment.postId]: !prev[comment.postId] }));
    }
  };

  const mainId = mainCommentId ?? comment.postId;
  const mainNumber = mainCommentNumber ?? commentNumber;

  return (
    <div id={comment.postId} className={`flex flex-col border-l-2 border-base-300 pl-6 pb-2 w-full`}>
      <div className="flex justify-between w-full items-start">
        <div className="flex flex-grow items-start">
          <UserAvatar src={comment.avatar} size="md" />
          <div className="ml-3 w-full">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-base-content font-mono bg-base-200 rounded px-1.5 py-0.5 mr-1 align-middle">
                {commentNumber}
              </span>
              <span className="font-semibold text-base align-middle">{comment.username}</span>
              <span className="text-xs text-base-content/70 align-middle">
                {new Date(comment.updatedAt).toLocaleString(undefined, {
                  year: "2-digit",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </span>
            </div>
            <div className="text-base-content break-words whitespace-pre-wrap">
              <span
                dangerouslySetInnerHTML={{ __html: renderCommentContent(contentWithNumber, false, commentNumber) }}
              />
            </div>
            <div className="flex gap-2 mt-2">
              {/* comment reply */}
              {isMainComment ? (
                <button
                  className="btn btn-xs btn-ghost text-base-content/70"
                  onClick={() => {
                    setShowReplyBox((v) => !v);
                    setReplyToNumber(undefined);
                    setReplyToSubNumber(undefined);
                  }}
                >
                  {showReplyBox && !replyToSubNumber ? "Cancel" : "Reply"}
                </button>
              ) : (
                <button
                  className="btn btn-xs btn-ghost text-base-content/70"
                  onClick={() => {
                    setShowSubReplyBox((v) => !v);
                    setSubReplyToNumber(showSubReplyBox ? undefined : commentNumber);
                  }}
                >
                  {showSubReplyBox ? "Cancel" : "Reply"}
                </button>
              )}
            </div>
            {/* comment reply list */}
            {isMainComment && showReplyBox && !replyToSubNumber && (
              <div className="mt-2">
                <CommentFormInline
                  parentId={comment.postId}
                  userId={session.userId ? String(session.userId) : ""}
                  onSuccess={onReplySuccess}
                  replyToNumber={undefined}
                  nextSubNumber={nextSubNumber}
                />
              </div>
            )}
            {/* sub comment reply list */}
            {showSubReplyBox && (
              <div className="mt-2">
                <CommentFormInline
                  parentId={mainId}
                  userId={session.userId ? String(session.userId) : ""}
                  onSuccess={() => {
                    setShowSubReplyBox(false);
                    setSubReplyToNumber(undefined);
                    onReplySuccess();
                  }}
                  replyToNumber={commentNumber}
                  nextSubNumber={undefined}
                />
              </div>
            )}
          </div>
        </div>
        {showLikeDislike && (
          <div className="flex flex-row items-center gap-1">
            <div className="flex items-center bg-base-200 rounded-xl px-3 py-1 gap-2 mt-1">
              <button className="btn btn-sm btn-ghost p-0" onClick={handleLike} title="Like" disabled={isLoading}>
                <FontAwesomeIcon icon={userLiked ? faThumbsUpSolid : faThumbsUp} size="lg" />
              </button>
              <span className="text-xs font-semibold text-base-content">
                {Intl.NumberFormat("en", { notation: "compact" }).format(likeCount - dislikeCount)}
              </span>
              <button className="btn btn-sm btn-ghost p-0" onClick={handleDislike} title="Dislike" disabled={isLoading}>
                <FontAwesomeIcon icon={userDisliked ? faThumbsDownSolid : faThumbsDown} size="lg" />
              </button>
            </div>
            <button className="btn btn-sm btn-ghost btn-circle" title="More options">
              <FontAwesomeIcon icon={faEllipsis} size="lg" />
            </button>
          </div>
        )}
      </div>
      {/* sub comment (reply) */}
      {isMainComment && (
        <div className="w-full">
          {isMainComment && subComments.length > 0 && (
            <button
              className="block text-base-content/50 text-sm my-2 hover:underline hover:text-base-content w-full text-left"
              style={{ fontFamily: "monospace", letterSpacing: 1 }}
              onClick={toggleSubComments}
            >
              {showSubComments ? "----- Hide comment" : "----- Show comment"}
            </button>
          )}
          {showSubComments && subComments.length > 0 && (
            <div className="mt-2 w-full">
              {subComments.map((child: any, idx: number) => (
                <CommentItem
                  key={child.postId}
                  userId={userId}
                  comment={child}
                  onReplySuccess={onReplySuccess}
                  showLikeDislike={showLikeDislike}
                  numberPrefix={commentNumber}
                  index={idx}
                  subCommentVisibility={subCommentVisibility}
                  setSubCommentVisibility={setSubCommentVisibility}
                  mainCommentId={mainCommentId}
                  mainCommentNumber={mainCommentNumber}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CommentList({ postId, userId, onReplySuccess }: CommentListProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [excludedCommentIds, setExcludedCommentIds] = useState<Set<number>>(new Set());
  const [subCommentVisibility, setSubCommentVisibility] = useState<Record<string, boolean>>({});

  const fetchComments = async (isInitial: boolean = false) => {
    try {
      setLoading(true);
      let list = postId
        ? await getCommentList(postId, userId, {
            excludingCommentIdList: isInitial ? [] : Array.from(excludedCommentIds),
            count: 10,
          })
        : await getMyComments({ userIdTo: userId });

      if (!list || list.length === 0) {
        setHasMore(false);
        return;
      }

      // Update excludedCommentIds with new comments
      setExcludedCommentIds((prevExcludedIds) => {
        const newExcludedIds = new Set(prevExcludedIds);
        list.forEach((comment: any) => newExcludedIds.add(Number(comment.postId)));
        return newExcludedIds;
      });

      if (isInitial) {
        // Sort main comments by post ID to maintain consistent order
        const sortedList = list.slice().sort((a: any, b: any) => Number(a.postId) - Number(b.postId));
        
        // Add comment numbers based on sorted order
        const completedList = sortedList.map((c: any, idx: number) => {
          if (!/^C\d+/.test(c.content)) {
            return { ...c, content: `C${idx + 1} ${c.content}` };
          }
          return c;
        });
        
        setComments(completedList);
        setSubCommentVisibility((prev) => {
          const updated = { ...prev };
          list.forEach((c: any) => {
            if (!(c.postId in updated)) {
              updated[c.postId] = false;
            }
          });
          return updated;
        });
      } else {
        setComments((prevComments) => {
          const all = [...prevComments, ...list];
          const map = new Map();
          
          // Sort all comments by post ID
          const sortedAll = all.slice().sort((a: any, b: any) => Number(a.postId) - Number(b.postId));
          
          // Add comment numbers based on sorted order
          sortedAll.forEach((c, idx) => {
            if (!/^C\d+/.test(c.content)) {
              map.set(c.postId, { ...c, content: `C${idx + 1} ${c.content}` });
            } else {
              map.set(c.postId, c);
            }
          });
          
          return Array.from(map.values());
        });
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(true);
  }, [postId, userId]);

  // Infinite scrolling observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchComments(false);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading]);

  if (loading && comments.length === 0) return <div>Loading comments...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!comments.length) return <div>No comments yet.</div>;

  const handleAnyReplySuccess = () => {
    fetchComments(true);
  };

  if (!postId) {
    return (
      <div className="flex flex-col">
        {comments.map((post) => (
          <div key={post.postId} className="flex flex-col gap-4 w-full">
            <PostPreview post={post} size="md" />
            {post.commentList.map((comment: Post, idx: number) => (
              <CommentItem
                key={comment.postId}
                comment={comment}
                userId={userId}
                onReplySuccess={handleAnyReplySuccess}
                showLikeDislike={true}
                numberPrefix="None"
                index={idx}
                subCommentVisibility={subCommentVisibility}
                setSubCommentVisibility={setSubCommentVisibility}
                mainCommentId={comment.postId}
                mainCommentNumber={comment.content.match(/^(C\d+(?:-\d+)?)/)?.[0] || `M${idx + 1}`}
              />
            ))}
            <div className="divider my-0"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {comments.map((comment, idx) => {
        const commentNumber = `C${idx + 1}`;
        return (
          <CommentItem
            key={comment.postId}
            comment={comment}
            userId={userId}
            onReplySuccess={handleAnyReplySuccess}
            showLikeDislike={true}
            numberPrefix=""
            index={idx}
            subCommentVisibility={subCommentVisibility}
            setSubCommentVisibility={setSubCommentVisibility}
            mainCommentId={comment.postId}
            mainCommentNumber={commentNumber}
          />
        );
      })}

      {/* Observer target and loading state */}
      <div ref={observerTarget} className="py-2">
        {loading ? (
          <div className="flex justify-center py-4">
            <span className="loading loading-spinner loading-xl"></span>
          </div>
        ) : hasMore ? (
          <div className="h-10"></div>
        ) : (
          <div className="text-center text-base-content/50 my-4">
            <p className="text-sm">You&apos;ve reached the end</p>
          </div>
        )}
      </div>
    </div>
  );
}
