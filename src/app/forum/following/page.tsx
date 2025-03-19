import { Metadata } from "next";
import PostList from "@/components/posts/PostPreviewList";
import { getPosts } from "@/utils/posts";

export const metadata: Metadata = {
  title: "Following | FlowChat",
  description: "Posts from users you follow on FlowChat.",
};

export const dynamic = "force-dynamic";

export default async function FollowingPostsPage() {
  const posts = await getPosts({ following: "userID" });

  return (
    <div>
      <PostList posts={posts} />
    </div>
  );
}
