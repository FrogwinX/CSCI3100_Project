import { getPostById } from "@/utils/posts";
import { notFound } from "next/navigation";
import PostDetail from "@/components/posts/PostDetail";

type Params = Promise<{ postId: string }>;

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params;
  const post = await getPostById(params.postId);

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
  const post = await getPostById(params.postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col px-4 py-2">
      <PostDetail post={post} />

      {/** Comments section */}
      <p id="comments" className="card bg-base-100 p-4 min-h-screen">
        @Boscode31415 Please create a comment section here, label the component id=&quot;comments&quot; so my comment
        button can navigate to the comment section without navbar blocking
      </p>
    </div>
  );
}
