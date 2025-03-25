import { getPostById } from "@/utils/posts";
import { notFound } from "next/navigation";
import PostDetail from "@/components/posts/PostDetail";

export async function generateMetadata({ params }: { params: { postId: string } }) {
  const { postId } = await params;
  const post = await getPostById(postId);

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

export default async function PostDetailPage({ params }: { params: { postId: string } }) {
  const { postId } = await params;
  const post = await getPostById(postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col px-4 py-2">
      <PostDetail post={post} />

      {/** Comments section */}
      <p id="comments" className="card bg-base-100 p-4 scroll-mt-16 min-h-screen">
        @Boscode31415 Please create a comment section here, label the component id="comments" and add
        classname="scroll-mt-16" so my comment button can navigate to the comment section without navbar blocking
      </p>
    </div>
  );
}
