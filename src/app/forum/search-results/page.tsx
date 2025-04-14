"use client";

import { useState } from "react";
import PostList from "@/components/posts/PostPreviewList";
import UserList from "@/components/users/UserPreviewList";

export default function SearchResultsPage({ searchInput }: { searchInput: string }) {
  const [activeTab, setActiveTab] = useState<"posts" | "users">("posts");

  return (
    <div className="flex flex-col">
      {/* Tab switcher */}
      <div className="tabs tabs-boxed bg-base-200 mb-4 w-fit mx-auto">
        <a className={`tab ${activeTab === "posts" ? "tab-active" : ""}`} onClick={() => setActiveTab("posts")}>
          Posts
        </a>
        <a className={`tab ${activeTab === "users" ? "tab-active" : ""}`} onClick={() => setActiveTab("users")}>
          Users
        </a>
      </div>

      {/* Content based on active tab */}
      {activeTab === "posts" ? (
        PostList({ filter: "latest", keyword: searchInput })
      ) : (
        <UserList searchKeyword={searchInput} />
      )}
    </div>
  );
}
