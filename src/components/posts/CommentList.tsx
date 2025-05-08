"use client";
import React, { useEffect, useState } from "react";
import { getCommentList } from "@/utils/posts";
import UserAvatar from "@/components/users/UserAvatar";

interface CommentListProps {
  postId: string;
  userId: string;
}

export default function CommentList({ postId, userId }: CommentListProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [postId, userId]);

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!comments.length) return <div>No comments yet.</div>;

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <div key={comment.postId} className="card bg-base-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserAvatar src={comment.avatar} username={comment.username} size="sm" />
            <span className="text-xs text-gray-400">{new Date(comment.updatedAt).toLocaleString()}</span>
          </div>
          <div className="pl-10 text-base-content" dangerouslySetInnerHTML={{ __html: comment.content }} />
        </div>
      ))}
    </div>
  );
} 