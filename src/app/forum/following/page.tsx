import { Metadata } from "next";
import PostList from "@/components/posts/PostPreviewList";

export const metadata: Metadata = {
  title: "Following | FlowChat",
  description: "Posts from users you follow on FlowChat.",
};

export const dynamic = "force-dynamic";

export default async function FollowingPostsPage() {
  return (
    <div>
      <PostList filter="following" />
    </div>
  );
}
