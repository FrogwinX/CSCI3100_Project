"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus, faFilter } from "@fortawesome/free-solid-svg-icons";
import { getAllTags, Tag } from "@/utils/posts";
import PostList from "@/components/posts/PostPreviewList";

export default function SideMenu() {
  const [searchTags, setSearchTags] = useState<Tag[]>([]);
  const [AllTags, setAllTags] = useState<Tag[]>([]);
  // New state to hold shuffled tags
  const [recommendedTags, setRecommendedTags] = useState<Tag[]>([]);

  useEffect(() => {
    getAllTags().then((tags) => {
      setAllTags(tags);
      // Shuffle tags only once when they're loaded
      const shuffled = [...tags].sort(() => 0.5 - Math.random()).slice(0, 30);
      setRecommendedTags(shuffled);
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

  const handleFilterPostsByTags = (tags: Tag[]) => {};

  return (
    <div className="card-body gap-0">
      {/* Section 1 Create Post Button */}
      <div className="w-full">
        <button className="btn btn-primary w-full">
          <FontAwesomeIcon icon={faPlus} />
          Create Post
        </button>
        {/* TODO: Implement create post functionality */}
      </div>
      <div className="divider my-0 gap-0"></div>
      Filter By Tags
      {/* Section 2 Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
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
      <div className="flex flex-wrap gap-2">
        {recommendedTags.map((tag) => {
          return (
            <button
              key={tag.tagId}
              className={`btn btn-sm ${searchTags.some((t) => t.tagId === tag.tagId) ? "btn-primary" : "btn-accent"}`}
              onClick={() => {
                toggleTag(tag);
                handleFilterPostsByTags(searchTags);
                console.log(searchTags);
              }}
            >
              {tag.tagName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
