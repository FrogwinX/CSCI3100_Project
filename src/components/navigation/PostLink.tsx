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
    if (!(e.target as HTMLElement).closest(".interactive-element")) {
      router.push(href);
    }
  };

  return (
    <div onClick={handleClick} className={`cursor-pointer ${className}`}>
      {children}
    </div>
  );
}
