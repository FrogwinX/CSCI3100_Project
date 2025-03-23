import PostFooter from "@/components/posts/PostFooter";
import PostLink from "@/components/navigation/PostLink";
import PostHeader from "@/components/posts/PostHeader";
import LoadingImage from "./LoadingImage";

export interface Post {
  postId: string;
  username: string;
  title: string;
  content: string;
  imageAPIList: string[] | null;
  tagNameList: string[] | null;
  likeCount: number;
  isLiked: boolean;
  dislikeCount: number;
  isDisliked: boolean;
  commentCount: number;
  updatedAt: string;
  commentList: Post[] | null;
}

export default function PostPreview({ post }: { post: Post }) {
  return (
    <PostLink href={`/forum/post/${post.postId}`} className="block">
      <div className="card hover:bg-base-200/40 px-2">
        <div className="card-body p-0 gap-2">
          {/** Header, client-sided */}
          <PostHeader postId={post.postId} postUsername={post.username} postUpdatedAt={post.updatedAt} />
          {/** Body */}
          <div className="flex gap-4">
            <div className="flex-1">
              <h3 className="card-title text-lg font-bold line-clamp-2">{post.title}</h3>
              <p className="text-base-content text-md my-2 line-clamp-3 md:line-clamp-6">{post.content}</p>
            </div>
            {/* Image on the right side, conditionally rendered */}
            {post.imageAPIList && post.content.trim().length >= 50 && (
              <div className="flex-none h-full w-24 sm:w-32 md:w-40 lg:w-48 xl:w-56 ">
                <LoadingImage
                  src={post.imageAPIList[0]}
                  alt={post.title}
                  className="object-cover rounded-lg max-h-32 md:max-h-36 lg:max-h-40"
                />
              </div>
            )}
          </div>
          {/* Show image below title if no description */}
          {post.imageAPIList && post.content.trim().length < 50 && (
            <div className="relative w-full overflow-hidden rounded-xl bg-base-300 ">
              {/* Blurred background image */}
              <div className="absolute inset-0 w-full h-full opacity-60">
                <img src={post.imageAPIList[0]} className="object-cover blur-xl w-full h-full aspect-video" />
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
                <div key={index} className="badge badge-sm badge-accent">
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
            postIsLiked={post.isLiked}
            postIsDisliked={post.isDisliked}
          />
        </div>
      </div>
    </PostLink>
  );
}
