"use client";

import { useState } from "react";

export default function LoadingImage({
  src,
  alt = "",
  className = "",
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative">
      {/* Skeleton */}
      {isLoading && <div className={`skeleton w-full h-full absolute inset-0 ${className}`}></div>}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full ${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
