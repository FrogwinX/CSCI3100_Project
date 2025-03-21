import { Metadata } from "next";
import PostList from "@/components/posts/PostPreviewList";
import { getPosts } from "@/utils/posts";

export const metadata: Metadata = {
  title: "Latest Posts | FlowChat",
  description: "Browse the latest posts on FlowChat's forum.",
};

export const dynamic = "force-dynamic";

export default async function LatestPostsPage() {
  const posts = await getPosts({ filter: "latest" });

  return (
    <div>
      <PostList posts={posts} />
    </div>
  );
}
