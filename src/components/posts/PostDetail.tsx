import PostHeader from "@/components/posts/PostHeader";
import PostFooter from "@/components/posts/PostFooter";
import LoadingImage from "@/components/posts/LoadingImage";
import { Post } from "@/utils/posts";

export default function PostDetail({ post }: { post: Post }) {
  return (
    <div className="card px-2">
      <div className="card-body p-0 gap-4">
        {/** Header, client-sided */}
        <PostHeader postId={post.postId} postUserId={post.userId} postUsername={post.username} postUpdatedAt={post.updatedAt} postUserAvatar={post.avatar} size="md" />

        {/** Body */}
        <div className="flex gap-4">
          <div className="flex-1 overflow-hidden">
            <h3 className="card-title text-2xl font-bold break-words">{post.title}</h3>
            <p className="text-base-content text-md my-2 whitespace-pre-wrap break-words">{post.content}</p>
          </div>
        </div>

        {/** Image */}
        {post.imageAPIList && (
          <LoadingImage
            src={post.imageAPIList[0]}
            alt={post.title}
            className="object-contain rounded-md max-h-96 mx-auto"
          />
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
