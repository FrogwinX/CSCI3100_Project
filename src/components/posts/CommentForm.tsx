"use client";
import React, { useState } from "react";
import { createComment } from "@/utils/posts";

interface CommentFormProps {
  postId: string;
  userId: string;
  replyTo?: any;
  onCancelReply?: () => void;
  onCommentSuccess?: () => void;
}

export default function CommentForm({ postId, userId, replyTo, onCancelReply, onCommentSuccess }: CommentFormProps) {
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
      await createComment(
        replyTo?.postId ? replyTo.postId : postId,
        userId,
        content
      );
      setContent("");
      if (onCommentSuccess) onCommentSuccess();
    } catch (err) {
      setError("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {replyTo && (
        <div className="mb-2 p-2 bg-base-200 rounded flex items-center justify-between">
          <span className="text-xs">Replying to <b>{replyTo.username}</b></span>
          <button type="button" className="btn btn-xs btn-ghost" onClick={onCancelReply}>Cancel</button>
        </div>
      )}
      <textarea
        className="textarea textarea-bordered w-full min-h-[4rem]"
        placeholder={replyTo ? `Reply to ${replyTo.username}...` : "Write a comment..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={500}
        disabled={loading}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-400">{content.length}/500</span>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Posting..." : replyTo ? "Reply" : "Post Comment"}
        </button>
      </div>
      {error && <div className="text-red-500 mt-1">{error}</div>}
    </form>
  );
} 