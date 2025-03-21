import { Metadata } from "next";
import PostList from "@/components/posts/PostPreviewList";
import { getPosts } from "@/utils/posts";

export const metadata: Metadata = {
  title: "Recommended Posts | FlowChat",
  description: "Discover recommended posts based on your interests.",
};

export const dynamic = "force-dynamic";

export default async function RecommendedPostsPage() {
  const posts = await getPosts({ filter: "recommended" });

  return (
    <div>
      <PostList posts={posts} />
    </div>
  );
}
