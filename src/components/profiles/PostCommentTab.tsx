"use client";

import { Profile } from "@/utils/profiles";
import { useState } from "react";
import PostList from "../posts/PostPreviewList";

export default function PostCommentTab({ profile } : { profile : Profile }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [`My Posts (${profile.postCount})`, `My Comments (${profile.commentCount})`];

  return (
    <div className="w-full">
      <div className="flex justify-center gap-30 border-b border-gray-300">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`cursor-pointer py-2 text-xl text-center ${activeTab === index ? 'text-base-content border-b-2 border-black' : 'text-base-content/50'
              }`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="mt-4">
        {activeTab === 0 && <div><PostList filter="my" /></div>}
        {activeTab === 1 && <div>My Comments</div>}
      </div>
    </div>
  );
}
