"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getAllTags, Tag } from "@/utils/posts";
import { useTagContext } from "@/hooks/useTags";
import Link from "next/link";

export default function SideMenu() {
  const { selectedTags: searchTags, setSelectedTags: setSearchTags } = useTagContext();
  const [AllTags, setAllTags] = useState<Tag[]>([]);
  // New state to hold shuffled tags
  const [recommendedTags, setRecommendedTags] = useState<Tag[]>([]);
  const [excludedPostIds, setExcludedPostIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    getAllTags().then((tags) => {
      setAllTags(tags);
      // Shuffle tags only once when they're loaded
      // const shuffled = [...tags].sort(() => 0.5 - Math.random()).slice(0, 30);
      setRecommendedTags(tags);
    });
  }, []);

  const toggleTag = (tag: Tag) => {
    if (searchTags.some((t) => t.tagId === tag.tagId)) {
      setSearchTags(searchTags.filter((t) => t.tagId !== tag.tagId));
    } else {
      setSearchTags([...searchTags, tag]);
    }
  };

  const handleFilterTags = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value.toLowerCase();
    const filteredTags = AllTags.filter((tag) => tag.tagName.toLowerCase().includes(search));
    setRecommendedTags(filteredTags);
  };

  return (
    <div className="card-body gap-0 flex flex-col h-full">
      {/* Section 1 Create Post Button */}
      <div className="w-full">
        <Link href="/forum/create-post">
          <button className="btn btn-primary w-full">
            <FontAwesomeIcon icon={faPlus} />
            Create Post
          </button>
          {/* TODO: Implement create post functionality */}
        </Link>
      </div>
      <div className="divider my-0 gap-0"></div>
      Filter By Tags
      {/* Section 2 Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between flex-shrink-0">
        <div className="flex-grow w-full relative my-2">
          <input
            type="text"
            placeholder="Search tags"
            className="w-full h-8 rounded-full bg-base-200 pl-10 pr-4 border-base-300"
            onChange={handleFilterTags}
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60"
          />
        </div>
      </div>
      {/* Section 3: Tags */}
      <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300 h-screen overflow-y-scroll">
        {/* <div className="flex-grow overflow-y-auto min-h-0"> */}
        <div className="flex flex-wrap gap-2 p-1">
          {recommendedTags.map((tag) => {
            return (
              <button
                key={tag.tagId}
                className={`btn btn-sm ${searchTags.some((t) => t.tagId === tag.tagId) ? "btn-primary" : "btn-accent"}`}
                onClick={() => toggleTag(tag)}
              >
                {tag.tagName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
