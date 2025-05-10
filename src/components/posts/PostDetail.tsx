import React from "react";
import PostHeader from "@/components/posts/PostHeader";
import PostFooter from "@/components/posts/PostFooter";
import LoadingImage from "@/components/posts/LoadingImage";
import { Post } from "@/utils/posts";

function processContent(content: string, imageList: string[] | null): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\[image:[^\]]+\]/g; // Regex to find image placeholders
  let lastIndex = 0;
  let match;
  let imageIndex = 0;

  if (!imageList || imageList.length === 0) {
    // If no images, render the whole content, respecting HTML including <br>
    parts.push(<div key="content-no-images" dangerouslySetInnerHTML={{ __html: content }} />);
    return parts;
  }

  // Find all image placeholders
  while ((match = regex.exec(content)) !== null) {
    // Add the text part before the match
    if (match.index > lastIndex) {
      const textSegment = content.substring(lastIndex, match.index);
      // Render text segment, allowing HTML
      parts.push(<div key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: textSegment }} />);
    }

    // Check if there's a corresponding image URL
    if (imageIndex < imageList.length) {
      const imageUrl = imageList[imageIndex];
      // Add the LoadingImage component
      parts.push(
        <LoadingImage
          key={`image-${imageIndex}`}
          src={imageUrl}
          alt={`Post image ${imageIndex + 1}`}
          className="object-contain rounded-md max-h-96 mx-auto"
        />
      );
      imageIndex++;
    } else {
      // Placeholder for missing image
      parts.push(
        <span key={`missing-${imageIndex}`} className="italic text-base-content/50">
          [Image not available]
        </span>
      );
    }

    lastIndex = regex.lastIndex; // Update the index for the next search
  }

  // Add any remaining text after the last match
  if (lastIndex < content.length) {
    const textSegment = content.substring(lastIndex);
    // Render the final text segment
    parts.push(<div key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: textSegment }} />);
  }

  return parts;
}

export default function PostDetail({ post }: { post: Post }) {
  // Process the content to replace image placeholders with actual images
  const processedContent = processContent(post.content, post.imageAPIList);

  return (
    <div className="relative">
      {post.isUserBlocked && (
        <div
          role="alert"
          className="alert alert-warning text-warning-content w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          You have blocked this user
        </div>
      )}
      <div className={post.isUserBlocked ? "pointer-events-none blur-2xl" : ""}>
        <div className="card px-2">
          <div className="card-body p-0 gap-4">
            {/** Header, client-sided */}
            <PostHeader
              postId={post.postId}
              postUserId={post.userId}
              postUsername={post.username}
              postUpdatedAt={post.updatedAt}
              size="md"
              postUserAvatar={post.avatar}
            />

            {/** Body */}
            <div className="flex gap-4">
              <div className="flex-1 overflow-hidden">
                <h3 className="card-title text-2xl font-bold break-words">{post.title}</h3>
                <div className="text-base-content text-md my-2 whitespace-pre-wrap break-words">{processedContent}</div>
              </div>
            </div>

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
      </div>
    </div>
  );
}
