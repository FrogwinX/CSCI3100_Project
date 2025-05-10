"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import PostList from "@/components/posts/PostPreviewList";
import UserList from "@/components/users/UserPreviewList";

export default function SearchResultsPage() {
  const [activeTab, setActiveTab] = useState<"posts" | "users">("users");
  const searchParams = useSearchParams();
  const searchInput = searchParams.get('q') || '';
  return (
    <div className="flex flex-col">
      {/* Tab switcher */}
      <div role="tablist" className="tabs tabs-border w-full place-content-evenly">
        <a className={`tab text-lg ${activeTab === "posts" ? "tab-active" : ""}`} onClick={() => setActiveTab("posts")}>
          Posts
        </a>
        <a className={`tab text-lg ${activeTab === "users" ? "tab-active" : ""}`} onClick={() => setActiveTab("users")}>
          Users
        </a>
      </div>

      {/* Content based on active tab */}
      {
        activeTab === "posts" ? (
          <PostList filter="latest" keyword={searchInput} />
        ) : (
          <UserList searchKeyword={searchInput} />
        )
      }
    </div >
  );
}
