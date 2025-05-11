"use client";
import React, { useEffect, useState, useRef } from "react";
import { getCommentList, createComment, Post, deletePostOrComment } from "@/utils/posts";
import UserAvatar from "@/components/users/UserAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as faThumbsUpSolid,
  faThumbsDown as faThumbsDownSolid,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp, faThumbsDown, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { useSession } from "@/hooks/useSession";
import { getMyComments } from "@/utils/profiles";
import PostPreview from "@/components/posts/PostPreview";
import Link from "next/link";

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

function renderCommentContent(str: string, showNumber: boolean = true) {
  let html = str;

  if (showNumber) {
    // Style the "(reply to C<number>)" part
    html = html.replace(
      /\(reply to (C\d+(?:-\d+)?)\)\s*/,
      '<span style="color:#2563eb;font-size:0.95em;font-weight:400;">$1</span> '
    );
    // Style the "C<number>" prefix
    html = html.replace(/^(C\d+(?:-\d+)?)(\s+)/, "");
  } else {
    // Remove "None-{number}" prefix if present
    html = html.replace(/^None-\d+\s*/, "");
    // Style the "C<number>" prefix
    html = html.replace(/^(C\d+(?:-\d+)?)(\s+)/, "");
    // Remove "(reply to C<number>)" part
    html = html.replace(/\(reply to (C\d+(?:-\d+)?)\)\s*/, "");
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

}: {
  comment: Post;
  userId: string;
  onReplySuccess: () => void;
  showLikeDislike?: boolean;
  numberPrefix?: string;
  index?: number;
  subCommentVisibility?: Record<string, boolean>;
  setSubCommentVisibility?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  mainCommentId?: string;
}) {
  const { session } = useSession();
  const [showSubReplyBox, setShowSubReplyBox] = useState(false);


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
    } catch {
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

  const handleDelete = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    await deletePostOrComment(comment.postId);
    onReplySuccess();
  };

  // Extract comment number from content or generate new one
  const extractCommentNumber = (content: string) => {
    const match = content.match(/^C\d+(?:-\d+)?/);
    return match ? match[0] : null;
  };

  const commentNumber =
    extractCommentNumber(comment.content) || (numberPrefix ? `${numberPrefix}-${index + 1}` : `C${index + 1}`);

  // Update content with comment number if not present
  let contentWithNumber = comment.content;
  if (!extractCommentNumber(contentWithNumber)) {
    contentWithNumber = `${commentNumber} ${contentWithNumber}`;
  }

  const subComments = Array.isArray(comment.commentList)
    ? comment.commentList.slice().sort((a: Post, b: Post) => {
      // Sort sub-comments by their post ID to maintain consistent order
      return Number(a.postId) - Number(b.postId);
    })
    : [];

  // Calculate next sub-comment number based on the highest existing sub-comment number
  let maxSub = 0;
  subComments.forEach((c: Post) => {
    const num = parseCommentNumber(c.content);
    if (num[1] > maxSub) maxSub = num[1];
  });

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
  const isMe = userId == comment.userId;
  const showNumberAndReply = numberPrefix !== "None";

  const commentDisplaySection = (
    <>
      <div className="flex items-center gap-2 mb-1">
        {showNumberAndReply && (
          <span className="text-xs text-base-content font-mono bg-base-200 rounded px-1.5 py-0.5 mr-1 align-middle">
            {commentNumber}
          </span>
        )}
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
        <span dangerouslySetInnerHTML={{ __html: renderCommentContent(contentWithNumber, showNumberAndReply) }} />
      </div>
    </>
  );

  return (
    <div id={`comment-${comment.postId}`} className="flex justify-between w-full items-start gap-4">
      <div className="ml-8 flex flex-col border-l-2 border-base-300 pl-6 pb-2 w-full flex-grow min-w-0">
        <div className="flex items-start min-w-0">
          <Link href={`/profile/${comment.userId}`}>
            <UserAvatar src={comment.avatar} size="md" />
          </Link>
          <div className="ml-3 w-full min-w-0">
            {!showNumberAndReply && mainCommentId ? (
              <Link href={`/forum/post/${mainCommentId}#comment-${comment.postId}`}>{commentDisplaySection}</Link>
            ) : (
              commentDisplaySection // Render directly if not navigable or no parent post info
            )}
            <div className="flex gap-2 mt-2">
              {/* comment reply */}
              <button
                className="btn btn-xs btn-ghost text-base-content/70"
                onClick={() => {
                  setShowSubReplyBox((v) => !v);

                }}
              >
                {showSubReplyBox ? "Cancel" : "Reply"}
              </button>
            </div>
            {/* comment reply list */}
            {showSubReplyBox && (
              <div className="mt-2">
                <CommentFormInline
                  parentId={mainId}
                  userId={session.userId ? String(session.userId) : ""}
                  onSuccess={() => {
                    setShowSubReplyBox(false);
                    onReplySuccess();
                  }}
                  replyToNumber={commentNumber}
                  nextSubNumber={undefined}
                />
              </div>
            )}
            {/* show/hide sub comment button */}
            {subComments.length > 0 && (
              <button
                className="block text-base-content/50 text-sm my-2 hover:underline hover:text-base-content w-full text-left"
                style={{ fontFamily: "monospace", letterSpacing: 1 }}
                onClick={toggleSubComments}
              >
                {showSubComments ? "----- Hide comment" : "----- Show comment"}
              </button>
            )}
          </div>
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
          {isMe && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className={`btn btn-sm btn-ghost btn-circle`}>
                <FontAwesomeIcon icon={faEllipsis} size="lg" />
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 shadow-lg w-26">
                {/* Show edit/delete only if user is author */}
                <li className="w-full">
                  <a onClick={handleDelete}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                    <span>Delete</span>
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CommentList({ postId, userId }: CommentListProps) {
  const [comments, setComments] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [excludedCommentIds, setExcludedCommentIds] = useState<Set<number>>(new Set());
  const [subCommentVisibility, setSubCommentVisibility] = useState<Record<string, boolean>>({});
  const [scrolledToHash, setScrolledToHash] = useState(false); // New state to track scroll

  const fetchComments = async (isInitial: boolean = false) => {
    try {
      setLoading(true);
      const list = postId
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
        list.forEach((comment: Post) => newExcludedIds.add(Number(comment.postId)));
        return newExcludedIds;
      });

      if (isInitial) {
        // Sort main comments by post ID to maintain consistent order
        const sortedList = list.slice().sort((a: Post, b: Post) => Number(a.postId) - Number(b.postId));

        // Add comment numbers based on sorted order
        const completedList = sortedList.map((c: Post, idx: number) => {
          if (!/^C\d+/.test(c.content) && postId) {
            return { ...c, content: `C${idx + 1} ${c.content}` };
          }
          return c;
        });

        setComments(completedList);
        setSubCommentVisibility((prev) => {
          const updated = { ...prev };
          list.forEach((c: Post) => {
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
          const sortedAll = all.slice().sort((a: Post, b: Post) => Number(a.postId) - Number(b.postId));

          // Add comment numbers based on sorted order
          sortedAll.forEach((c, idx) => {
            if (!/^C\d+/.test(c.content) && postId) {
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
    setScrolledToHash(false); // Reset scroll status when postId or userId changes
  }, [postId, userId]); // Removed onReplySuccessProp from dependencies

  // Scroll to a comment if a hash is present in the URL
  useEffect(() => {
    if (!scrolledToHash && !loading && comments.length > 0 && window.location.hash) {
      const hash = window.location.hash;
      const targetCommentId = hash.substring(1);

      if (!targetCommentId.startsWith("comment-")) return;

      const actualIdToFind = targetCommentId.replace("comment-", "");

      let targetElement: HTMLElement | null = null;

      // Function to recursively search for the comment and its parent if it's a sub-comment
      const findCommentAndParent = (
        commentList: Post[],
        idToFind: string
      ): { target: Post | null; parent: Post | null } => {
        for (const comment of commentList) {
          if (comment.postId.toString() === idToFind) {
            return { target: comment, parent: null }; // Found as a main comment
          }
          if (comment.commentList && comment.commentList.length > 0) {
            for (const subComment of comment.commentList) {
              if (subComment.postId.toString() === idToFind) {
                return { target: subComment, parent: comment }; // Found as a sub-comment
              }
            }
          }
        }
        return { target: null, parent: null };
      };

      const { target: foundComment, parent: foundParentComment } = findCommentAndParent(comments, actualIdToFind);

      if (foundComment) {
        if (foundParentComment) {
          // It's a sub-comment, ensure its parent is expanded
          const parentId = foundParentComment.postId.toString();
          if (!subCommentVisibility[parentId]) {
            setSubCommentVisibility((prev) => ({ ...prev, [parentId]: true }));
            // We've changed state to expand. Scrolling will be attempted in the next render cycle
            // when the sub-comment is visible. We don't set scrolledToHash yet.
            // To make it scroll after expansion, we can rely on this effect re-running
            // or use a small timeout, but re-running is cleaner.
            return; // Exit and let the effect re-run after state update
          }
        }

        // Now attempt to find the element in the DOM and scroll
        // Ensure the ID used for getElementById matches exactly what's in the DOM
        targetElement = document.getElementById(targetCommentId); // e.g., "comment-123"

        if (targetElement) {
          // Use a timeout to allow the DOM to update if a parent was just expanded
          setTimeout(() => {
            targetElement!.scrollIntoView({ behavior: "smooth", block: "center" });
            setScrolledToHash(true);
          }, 100); // Small delay for DOM update
        }
      }
    }
  }, [comments, loading, scrolledToHash, subCommentVisibility]);

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

  // If postId is not provided, it is my comments list
  if (!postId) {
    return (
      <div className="flex flex-col">
        {comments.map((post) => (
          <div key={post.postId} className="flex flex-col gap-4 w-full">
            <PostPreview post={post} size="md" />
            {post.commentList!.map((comment: Post, idx: number) => (
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
                mainCommentId={post.postId}
              />
            ))}
            <div className="divider my-0"></div>
          </div>
        ))}
      </div>
    );
  }

  // If postId is provided, it is a post's comment list
  return (
    <div className="flex flex-col gap-2">
      {comments.map((comment, idx) => {
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
