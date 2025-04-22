import { Metadata } from "next";
import PostList from "@/components/posts/PostPreviewList";

export const metadata: Metadata = {
  title: "Recommended Posts | FlowChat",
  description: "Discover recommended posts based on your interests.",
};

export const dynamic = "force-dynamic";

export default async function RecommendedPostsPage() {
  return (
    <div>
      <PostList filter="recommended" />
    </div>
  );
}
