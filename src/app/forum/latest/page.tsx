import { Metadata } from "next";
import PostList from "@/components/posts/PostPreviewList";

export const metadata: Metadata = {
  title: "Latest Posts | FlowChat",
  description: "Browse the latest posts on FlowChat's forum.",
};

export const dynamic = "force-dynamic";

export default async function LatestPostsPage() {
  return (
    <div>
      <PostList filter="latest" />
    </div>
  );
}
