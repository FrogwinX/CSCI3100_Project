import PostPreview, { Post } from "./PostPreview";

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="flex flex-col px-4 py-2">
      {posts.length > 0 ? (
        <>
          {/* Map through posts and add dividers between them */}
          {posts.map((post) => (
            <div key={post.postId} className="w-full">
              <PostPreview post={post} />
              {/* Add divider after each post except the last one */}
              <div className="divider my-0"></div>
            </div>
          ))}

          {/* Message at the end of the list */}
          <div className="text-center text-base-content/50">
            <p className="text-sm">No more posts</p>
          </div>
        </>
      ) : (
        <div className="text-center text-lg text-base-content/50 my-4">No posts available</div>
      )}
    </div>
  );
}
