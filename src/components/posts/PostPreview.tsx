import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEllipsis, faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

export interface Post {
  postId: string;
  username: string;
  title: string;
  description: string;
  image: string | null;
  tag: string;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  updatedAt: string;
  comments: Post[] | null;
}

export default function PostPreview({ post }: { post: Post }) {
  return (
    <Link href={`/forum/post/${post.postId}`}>
      <div className="card card-side cursor-pointer hover:bg-base-200 px-2">
        <div className="card-body p-0">
          {/** Header */}
          <div className="flex justify-between items-center my-1">
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

          <h3 className="card-title text-lg font-bold line-clamp-2">{post.title}</h3>

          {/* Use line-clamp for dimension-based truncation */}
          <p className="text-base-content/70 text-sm line-clamp-3 overflow-hidden">{post.description}</p>

          {post.tag && (
            <div className="flex flex-wrap gap-1 mt-2">
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
    </Link>
  );
}
