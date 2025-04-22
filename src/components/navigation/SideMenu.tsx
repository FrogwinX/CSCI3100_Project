"use client";
import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getAllTags, Tag } from "@/utils/posts";
import { useTagContext } from "@/hooks/useTags";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function SideMenu() {
  const { selectedTags: searchTags, setSelectedTags: setSearchTags, isPostsLoading } = useTagContext();
  const [AllTags, setAllTags] = useState<Tag[]>([]);
  const [recommendedTags, setRecommendedTags] = useState<Tag[]>([]);
  // Add debounced loading state to prevent flickering
  const [debouncedLoading, setDebouncedLoading] = useState(isPostsLoading);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce the loading state changes
  useEffect(() => {
    // When loading starts, update immediately
    if (isPostsLoading) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setDebouncedLoading(true);
    } else {
      // When loading ends, delay the update by 500ms
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setDebouncedLoading(false);
      }, 500);
    }

    // Clean up
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPostsLoading]);

  useEffect(() => {
    getAllTags().then((tags) => {
      setAllTags(tags);
      setRecommendedTags(tags);
    });
  }, []);

  const toggleTag = (tag: Tag) => {
    if (debouncedLoading) return;

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

  const pathname = usePathname();
  const shouldShow =
    pathname?.includes("/forum/latest") ||
    pathname?.includes("/forum/recommended") ||
    pathname?.includes("/forum/search-results") ||
    pathname?.includes("/forum/following");

  if (shouldShow) {
    return (
      <div className="card bg-base-100 fixed w-77 h-full overflow-hidden">
        <div className="card-body gap-0 flex flex-col h-full">
          {/* Section 1 Create Post Button */}
          <div className="w-full">
            <Link href="/forum/create-post">
              <button className="btn btn-primary w-full">
                <FontAwesomeIcon icon={faPlus} />
                Create Post
              </button>
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
          <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300 h-full overflow-y-scroll">
            {/* <div className="flex-grow overflow-y-auto min-h-0"> */}
            <div className="flex flex-wrap gap-2 p-1">
              {recommendedTags.map((tag) => {
                return (
                  <button
                    key={tag.tagId}
                    className={`btn btn-sm ${searchTags.some((t) => t.tagId === tag.tagId) ? "btn-primary" : "btn-accent"}`}
                    //if debouncedLoading is true do not toggle tag
                    onClick={() => {
                      if (!debouncedLoading) {
                        toggleTag(tag);
                      }
                    }}
                  >
                    {tag.tagName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
  else return null;
}
