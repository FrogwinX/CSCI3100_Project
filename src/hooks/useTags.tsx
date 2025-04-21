"use client";

import React, { createContext, useState, useContext } from "react";
import { Tag } from "@/utils/posts";

export interface TagContextType {
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
  isPostsLoading: boolean;
  setPostsLoading: (isLoading: boolean) => void;
}

export const TagContext = createContext<TagContextType>({
  selectedTags: [],
  setSelectedTags: () => {},
  isPostsLoading: false,
  setPostsLoading: () => {},
});

export function TagProvider({ children }: { children: React.ReactNode }) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isPostsLoading, setPostsLoading] = useState(false);

  return (
    <TagContext.Provider
      value={{
        selectedTags,
        setSelectedTags,
        isPostsLoading,
        setPostsLoading,
      }}
    >
      {children}
    </TagContext.Provider>
  );
}

export function useTagContext() {
  const context = useContext(TagContext);
  if (context === undefined) {
    throw new Error("useTagContext must be used within a TagProvider");
  }
  return context;
}
