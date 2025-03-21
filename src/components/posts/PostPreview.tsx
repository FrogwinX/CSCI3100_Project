import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import PostActions from "@/components/posts/PostActions";
import PostFooter from "@/components/posts/PostFooter";
import PostLink from "@/components/navigation/PostLink";

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
    <PostLink href={`/forum/post/${post.postId}`} className="block">
      <div className="card hover:bg-base-200/40 px-2">
        <div className="card-body p-0 gap-2">
          {/** Header */}
          <div className="flex justify-between items-center my-1">
            {/** Avatar, username, time */}
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
            {/** Follow, more options, client-sided */}
            <PostActions postId={post.postId} postUsername={post.username} />
          </div>
          {/** Body */}
          <div className="flex gap-4">
            <div className="flex-1">
              <h3 className="card-title text-lg font-bold line-clamp-2">{post.title}</h3>
              <p className="text-base-content text-md my-2 line-clamp-3 md:line-clamp-6">{post.description}</p>
            </div>
            {/* Image on the right side, conditionally rendered */}
            {post.image && post.description.trim().length >= 50 && (
              <div className="flex-none w-24 sm:w-32 md:w-40 lg:w-48 xl:w-56">
                <img
                  src={post.image}
                  className="rounded-md object-cover w-full h-full max-h-32 md:max-h-36 lg:max-h-40"
                />
              </div>
            )}
          </div>
          {/* Show image below title if no description */}
          {post.image && post.description.trim().length < 50 && (
            <div className="w-full max-w-xl mx-auto overflow-hidden">
              <img
                src={post.image}
                className="rounded-md object-contain w-full h-full max-h-60 sm:max-h-72 md:max-h-80 lg:max-h-96"
              />
            </div>
          )}
          {/** Tags */}
          {post.tag && (
            <div className="flex flex-wrap gap-1">
              {post.tag.split(",").map((tag, index) => (
                <div key={index} className="badge badge-sm badge-accent">
                  {tag.trim()}
                </div>
              ))}
            </div>
          )}
          {/** Footer, client-sided */}
          <PostFooter post={post} />
        </div>
      </div>
    </PostLink>
  );
}
