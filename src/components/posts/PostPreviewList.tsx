import PostPreview, { Post } from "./PostPreview";

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {posts.length > 0 ? (
        posts.map((post) => <PostPreview key={post.id} post={post} />)
      ) : (
        <div className="text-center text-lg text-base-content/50">No posts available</div>
      )}
    </div>
  );
}
