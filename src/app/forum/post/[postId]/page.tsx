import PostDetail from "@/components/posts/PostDetail";

export default function PostDetailPage({ params }: { params: { postId: string } }) {
  return <PostDetail params={params} />;
}

export { generateMetadata } from "@/components/posts/PostDetail";
