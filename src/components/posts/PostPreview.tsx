import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";

export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  createdAt: Date;
  commentCount: number;
  likeCount: number;
  tags?: string[];
}

export default function PostPreview({ post }: { post: Post }) {
  // Truncate content for preview
  const previewContent =
    post.content.length > 150
      ? post.content.substring(0, 150) + "..."
      : post.content;

  return (
    <Link href={`/forum/post/${post.id}`}>
      <div className="card card-bordered border-base-200 hover:border-primary transition-colors duration-200 bg-base-100 w-full cursor-pointer">
        <div className="card-body p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="avatar">
                <div className="w-8 h-8 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                  {post.author.avatarUrl ? (
                    <img
                      src={post.author.avatarUrl}
                      alt={post.author.username}
                    />
                  ) : (
                    post.author.username.charAt(0).toUpperCase()
                  )}
                </div>
              </div>
              <span className="text-sm font-medium">
                {post.author.username}
              </span>
            </div>
            <span className="text-xs opacity-60">
              {formatDistanceToNow(post.createdAt, { addSuffix: true })}
            </span>
          </div>

          <h3 className="card-title text-lg font-bold">{post.title}</h3>
          <p className="text-base-content/70 text-sm">{previewContent}</p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.map((tag) => (
                <span key={tag} className="badge badge-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-3">
            <span className="flex items-center gap-1 text-xs">
              <FontAwesomeIcon
                icon={faComment}
                className="text-base-content/60"
              />
              {post.commentCount}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <FontAwesomeIcon
                icon={faHeart}
                className="text-base-content/60"
              />
              {post.likeCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
