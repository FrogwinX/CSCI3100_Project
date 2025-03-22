import PostHeader from "@/components/posts/PostHeader";
import PostFooter from "@/components/posts/PostFooter";
import { Post } from "./PostPreview";

export default function PostDetail({ post }: { post: Post }) {
  return (
    <div className="card px-2">
      <div className="card-body p-0 gap-4">
        {/** Header, client-sided */}
        <PostHeader postId={post.postId} postUsername={post.username} postUpdatedAt={post.updatedAt} size="md" />

        {/** Body */}
        <div className="flex gap-4">
          <div className="flex-1">
            <h3 className="card-title text-2xl font-bold">{post.title}</h3>
            <p className="text-base-content text-md my-2 whitespace-pre-wrap">{post.description}</p>
          </div>
        </div>

        {/** Image */}
        {post.image && (
          <div className="w-full max-w-4xl mx-auto">
            <img src={post.image} className="rounded-md object-contain w-full h-full" />
          </div>
        )}

        {/** Tags */}
        {post.tag && (
          <div className="flex flex-wrap gap-1">
            {post.tag.split(",").map((tag, index) => (
              <div key={index} className="badge badge-md badge-accent">
                {tag.trim()}
              </div>
            ))}
          </div>
        )}

        {/** Footer, client-sided */}
        <PostFooter
          postId={post.postId}
          postLikeCount={post.likeCount}
          postDislikeCount={post.dislikeCount}
          postCommentCount={post.commentCount}
        />
      </div>
    </div>
  );
}
