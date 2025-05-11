import PostFooter from "@/components/posts/PostFooter";
import PostLink from "@/components/navigation/PostLink";
import PostHeader from "@/components/posts/PostHeader";
import LoadingImage from "./LoadingImage";
import { Post } from "@/utils/posts";


// Helper function to process content for preview
function processPreviewContent(content: string): string {
  let processedContent = content;

  // Remove [div] and [image:...] tags completely
  processedContent = processedContent.replace(/\[div\]/g, "");
  processedContent = processedContent.replace(/\[\/div\]/g, "");
  processedContent = processedContent.replace(/\[image:[^\]]+\]/g, ""); // Remove image tags

  // Convert formatting tags to HTML
  processedContent = processedContent.replace(/\[b\](.*?)\[\/b\]/g, "<b>$1</b>");
  processedContent = processedContent.replace(/\[i\](.*?)\[\/i\]/g, "<i>$1</i>");
  processedContent = processedContent.replace(/\[u\](.*?)\[\/u\]/g, "<u>$1</u>");
  processedContent = processedContent.replace(/\[br\]/g, "<br>");

  return processedContent;
}

export default function PostPreview({ post, size = "md", removePostFromPostlist }: { post: Post; size?: "sm" | "md"; removePostFromPostlist: (postId: string) => void }) {
  const processdContent = processPreviewContent(post.content);

  return (
    <PostLink href={`/forum/post/${post.postId}`} className="block" isBlocked={post.isUserBlocked}>
      <div className="card hover:bg-base-200/40 px-2">
        <div className="card-body p-0 gap-2">
          {/** Header, client-sided */}
          <PostHeader
            postId={post.postId}
            postUserId={post.userId}
            postUsername={post.username}
            postUpdatedAt={post.updatedAt}
            postUserAvatar={post.avatar}
            size={size}
            removePostFromPostlist={removePostFromPostlist}
          />
          {/** Body */}
          <div className="flex gap-4">
            <div className="flex-1 overflow-hidden">
              <h3 className="card-title text-lg font-bold line-clamp-2 break-words">{post.title}</h3>
              <div
                className="text-base-content text-md my-2 line-clamp-3 md:line-clamp-6 break-words"
                dangerouslySetInnerHTML={{ __html: processdContent }}
              />
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
          {/* Show image below title for short description */}
          {post.imageAPIList && post.content.trim().length < 50 && (
            <div className="relative w-full overflow-hidden rounded-xl bg-base-300 ">
              <LoadingImage
                src={post.imageAPIList[0]}
                alt={post.title}
                className="object-contain rounded-md max-h-64 md:max-h-72 lg:max-h-80 mx-auto"
              />
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
