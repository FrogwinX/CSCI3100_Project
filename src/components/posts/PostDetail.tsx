import { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faComment, faHeart, faEllipsis, faReply } from "@fortawesome/free-solid-svg-icons";
import { getPostById } from "@/utils/posts";
import { notFound } from "next/navigation";
import moment from "moment";

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
    description: post.description.substring(0, 160),
  };
}

// Mock comment component, please replace with your own implementation
function Comment({ comment, depth = 0 }: { comment: any; depth?: number }) {
  return (
    <div className={`mt-4 ${depth > 0 ? "ml-8 pl-4 border-l-2 border-base-300" : ""}`}>
      <div className="flex items-start gap-2">
        <div className="avatar avatar-placeholder">
          <div className="bg-neutral text-neutral-content w-8 rounded-full">
            <FontAwesomeIcon icon={faUser} />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold">{comment.username}</span>
            <span className="text-xs font-thin">•</span>
            <span className="text-xs opacity-60">{moment(comment.updatedAt).fromNow()}</span>
          </div>

          <div className="mt-1 text-sm">{comment.content || comment.description}</div>

          <div className="flex gap-3 mt-2">
            <button className="flex items-center gap-1 text-xs text-base-content/60 hover:text-primary">
              <FontAwesomeIcon icon={faHeart} />
              <span>{comment.likeCount || 0}</span>
            </button>
            <button className="flex items-center gap-1 text-xs text-base-content/60 hover:text-primary">
              <FontAwesomeIcon icon={faReply} />
              <span>Reply</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render nested comments recursively */}
      {comment.comments && comment.comments.length > 0 && (
        <div className="mt-2">
          {comment.comments.map((reply: any) => (
            <Comment key={reply.postId} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default async function PostDetail({ params }: { params: { postId: string } }) {
  const { postId } = params;

  const post = await getPostById(postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/** Post content */}
      <div className="card bg-base-100">
        <div className="card-body p-0">
          {/** Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="avatar avatar-placeholder">
                <div className="bg-neutral text-neutral-content w-8 rounded-full">
                  <FontAwesomeIcon icon={faUser} />
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                <span className="text-sm font-medium">{post.username}</span>
                <span className="text-xs font-thin">•</span>
                <span className="text-xs font-light">{moment(post.updatedAt).fromNow()}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <button className="btn btn-primary btn-sm">
                <span className="font-bold">Follow</span>
              </button>
              <button className="btn btn-ghost btn-circle btn-sm">
                <FontAwesomeIcon icon={faEllipsis} size="lg" />
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

          {/* Content without truncation */}
          <p className="text-base-content whitespace-pre-line mb-4">{post.description}</p>

          {/* Show image if available */}
          {post.image && (
            <figure className="mb-4">
              <img src={post.image} alt={post.title} className="rounded-lg w-full max-h-96 object-cover" />
            </figure>
          )}

          {post.tag && (
            <div className="flex flex-wrap gap-1 mb-4">
              {post.tag.split(",").map((tag, index) => (
                <span key={index} className="badge badge-sm">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-3">
            <span className="flex items-center gap-1 text-xs">
              <FontAwesomeIcon icon={faComment} className="text-base-content/60" />
              {post.commentCount}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <FontAwesomeIcon icon={faHeart} className="text-base-content/60" />
              {post.likeCount}
            </span>
          </div>
        </div>
      </div>

      {/* Mock Comments section, please replace with your own implementation */}
      <div className="card bg-base-100">
        <div className="divider mb-4">Comments ({post.commentCount || 0})</div>

        {/* New comment input, should support all feature like new post do, including image */}
        <div className="flex-1">
          <textarea
            className="textarea textarea-bordered w-full text-sm"
            placeholder="Add a comment..."
            rows={2}
          ></textarea>
          <div className="flex justify-end mt-2">
            <button className="btn btn-primary btn-sm">Submit</button>
          </div>
        </div>

        {/* List of comments */}
        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <Comment key={comment.postId} comment={comment} />
            ))}
          </div>
        ) : (
          <p className="text-center text-base-content/60 py-4">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}
