import { getPostById } from "@/utils/posts";
import { notFound } from "next/navigation";
import PostDetail from "@/components/posts/PostDetail";
import { cache } from "react";
import { getSession } from "@/utils/sessions";
import CommentSection from "@/components/posts/CommentSection";

type Params = Promise<{ postId: string }>;

const getPost = cache((postId: string) => {
  return getPostById(postId);
});

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params;
  const post = await getPost(params.postId);

  if (!post) {
    return {
      title: "Post Not Found | FlowChat",
    };
  }

  return {
    title: `${post.title} | FlowChat`,
    description: post.content.substring(0, 160),
  };
}

export default async function PostDetailPage(props: { params: Params }) {
  const params = await props.params;
  const post = await getPost(params.postId);
  const session = await getSession();

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col px-4 py-2">
      <PostDetail post={post} />
      <CommentSection postId={post.postId} userId={String(session.userId)} />
    </div>
  );
}
