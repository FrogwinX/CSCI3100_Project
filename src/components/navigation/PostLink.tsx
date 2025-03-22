"use client";

import { useRouter } from "next/navigation";
import { ReactNode, MouseEvent } from "react";

export default function PostLink({
  children,
  href,
  className = "",
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) {
  const router = useRouter();

  const handleClick = (e: MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;

    // Check if the target or its parent is an interactive element
    if (
      target.closest("a") ||
      target.closest("button") ||
      target.closest("[role='button']") ||
      target.closest(".dropdown") ||
      target.closest(".interactive-element")
    ) {
      e.stopPropagation();
      return;
    }

    router.push(href);
  };

  return (
    <div onClick={handleClick} className={`cursor-pointer ${className}`}>
      {children}
    </div>
  );
}
