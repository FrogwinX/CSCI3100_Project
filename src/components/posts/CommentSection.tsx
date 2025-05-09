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
  const [replyTo, setReplyTo] = useState(null);
  const [subCommentVisibility, setSubCommentVisibility] = useState<Record<string, boolean>>({});

  return (
    <div id="comments" className="bg-white rounded-xl shadow p-6 min-h-screen w-full mx-auto mt-6">
      <h2 className="text-xl font-bold mb-6">Comments</h2>
      <CommentForm
        postId={postId}
        userId={userId}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        onCommentSuccess={() => {
          setRefreshKey((k) => k + 1);
          setReplyTo(null);
        }}
      />
      <CommentList 
        postId={postId} 
        userId={userId} 
        key={refreshKey} 
        subCommentVisibility={subCommentVisibility}
        setSubCommentVisibility={setSubCommentVisibility}
      />
    </div>
  );
} 