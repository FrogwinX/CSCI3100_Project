import { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { getPostById } from "@/utils/posts";
import { notFound } from "next/navigation";

// Dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { postId: string } }): Promise<Metadata> {
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

export default async function PostDetail({ params }: { params: { postId: string } }) {
  const post = await getPostById(params.postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="p-4">
      <article className="prose lg:prose-lg max-w-none">
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>

        <div className="flex justify-between items-center mb-6 not-prose">
          <div className="flex items-center gap-2">
            <div className="avatar">
              <div className="w-10 h-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                {post.author.avatarUrl ? (
                  <img src={post.author.avatarUrl} alt={post.author.username} />
                ) : (
                  post.author.username.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            <div>
              <div className="font-medium">{post.author.username}</div>
              <div className="text-xs opacity-60">{formatDistanceToNow(post.createdAt, { addSuffix: true })}</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="btn btn-sm btn-ghost gap-1">
              <FontAwesomeIcon icon={faHeart} />
              <span>{post.likeCount}</span>
            </button>
            <button className="btn btn-sm btn-ghost gap-1">
              <FontAwesomeIcon icon={faComment} />
              <span>{post.commentCount}</span>
            </button>
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4 not-prose">
            {post.tags.map((tag) => (
              <span key={tag} className="badge">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6">
          {/* Render post content - you might want to use a markdown renderer */}
          <p>{post.content}</p>
        </div>
      </article>

      <div className="divider my-8">Comments</div>

      {/* Comment section would go here */}
      <div className="bg-base-200 p-4 rounded-lg">
        <p className="text-center text-base-content/60">Comments section coming soon!</p>
      </div>
    </div>
  );
}
