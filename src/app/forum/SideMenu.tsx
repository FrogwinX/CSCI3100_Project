"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus, faFilter } from "@fortawesome/free-solid-svg-icons";

export default function SideMenu({ children }: { children: React.ReactNode }) {
  const recommendedTags = {
    tech: ["programming", "ai", "web", "mobile", "cloud", "database", "security", "coding"],
  };
  return (
    <div className="card-body gap-4">
      {/* Section 1 Create Post Button */}
      <div className="w-full">
        <button className="btn btn-primary w-full">
          <FontAwesomeIcon icon={faPlus} />
          Create Post
        </button>
        {/* TODO: Implement create post functionality */}
      </div>
      <div className="divider my-0"></div>
      {/* Section 2 Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div>
          <button className="btn btn-base-200">
            <FontAwesomeIcon icon={faFilter} />
            Filter
          </button>
          {/* TODO: Implement filter functionality */}
        </div>
        <div className="flex-grow max-w-md relative">
          <input
            type="text"
            placeholder="Search tags"
            className="w-full h-full rounded-full bg-base-200 pl-10 pr-4 border-base-300"
            autoFocus
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60"
          />
        </div>
      </div>
      <div className="divider my-0"></div>
      You may interested:
      {/* Section 3: Tags */}
      <div className="flex flex-wrap gap-2">
        {Object.values(recommendedTags)
          .flat()
          .map((tag, index) => (
            <button
              key={index}
              className="btn btn-sm bg-accent text-accent-content"
              onClick={() => {
                const searchInput = document.querySelector<HTMLInputElement>('input[placeholder="Search tags"]');
                if (
                  searchInput &&
                  !searchInput.value
                    .split(",")
                    .map((t) => t.trim())
                    .includes(tag)
                ) {
                  searchInput.value = searchInput.value ? `${searchInput.value}, ${tag}` : tag;
                }
              }}
            >
              {tag.trim()}
            </button>
          ))}
      </div>
    </div>
  );
}
