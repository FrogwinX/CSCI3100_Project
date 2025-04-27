"use client";

import { useRouter } from "next/navigation";
import { ReactNode, MouseEvent } from "react";

export default function PostLink({
  children,
  href,
  className = "",
  isBlocked = false,
}: {
  children: ReactNode;
  href: string;
  className?: string;
  isBlocked?: boolean;
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
    <div onClick={isBlocked ? undefined : handleClick} className={`relative ${className}`}>
      {isBlocked && (
        <div
          role="alert"
          className="alert alert-warning text-warning-content w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          You have blocked this user
        </div>
      )}
      <div className={isBlocked ? "pointer-events-none blur-2xl" : "cursor-pointer"}>{children}</div>
    </div>
  );
}
