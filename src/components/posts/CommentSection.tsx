"use client";
import React, { useState } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

interface Props {
  postId: string;
  userId: string;
}

export default function CommentSection({ postId, userId }: Props) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div id="comments" className="card bg-base-100 p-4 min-h-screen scroll-mt-16">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      <CommentForm
        postId={postId}
        userId={userId}
        onCommentSuccess={() => setRefreshKey((k) => k + 1)}
      />
      <CommentList postId={postId} userId={userId} key={refreshKey} />
    </div>
  );
} 