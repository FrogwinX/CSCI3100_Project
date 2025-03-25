import PostHeader from "@/components/posts/PostHeader";
import PostFooter from "@/components/posts/PostFooter";
import { Post } from "@/components/posts/PostPreview";
import LoadingImage from "@/components/posts/LoadingImage";

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
            <p className="text-base-content text-md my-2 whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>

        {/** Image */}
        {post.imageAPIList && (
          <div className="relative w-full overflow-hidden rounded-xl bg-base-300">
            {/* Blurred background image */}
            <div className="absolute inset-0 w-full h-full opacity-60 scale-200">
              <img src={post.imageAPIList[0]} className="object-cover blur-xl w-full h-full" />
            </div>
            {/* Main image */}
            <div className="relative w-full h-full items-center justify-center">
              <LoadingImage
                src={post.imageAPIList[0]}
                alt={post.title}
                className=" object-contain rounded-md aspect-video"
              />
            </div>
          </div>
        )}

        {/** Tags */}
        {post.tagNameList && (
          <div className="flex flex-wrap gap-1">
            {post.tagNameList.map((tag, index) => (
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
          postIsLiked={post.isLiked}
          postDislikeCount={post.dislikeCount}
          postIsDisliked={post.isDisliked}
          postCommentCount={post.commentCount}
        />
      </div>
    </div>
  );
}
