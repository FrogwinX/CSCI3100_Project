"use client";

import React, { createContext, useState, useContext } from "react";
import { Tag } from "@/utils/posts";

type TagContextType = {
  selectedTags: Tag[];
  setSelectedTags: React.Dispatch<React.SetStateAction<Tag[]>>;
};

const TagContext = createContext<TagContextType | undefined>(undefined);

export function TagProvider({ children }: { children: React.ReactNode }) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  return <TagContext.Provider value={{ selectedTags, setSelectedTags }}>{children}</TagContext.Provider>;
}

export function useTagContext() {
  const context = useContext(TagContext);
  if (context === undefined) {
    throw new Error("useTagContext must be used within a TagProvider");
  }
  return context;
}
