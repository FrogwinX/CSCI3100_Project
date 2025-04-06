"use client";

import { useState } from "react";
import Image from "next/image";

export default function LoadingImage({
  src,
  alt = "",
  className = "",
  priority = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative">
      {/* Skeleton */}
      {isLoading && <div className={`skeleton w-full h-full absolute inset-0 ${className}`}></div>}

      {/* Actual image */}
      <Image
        src={src}
        alt={alt}
        className={`w-full h-full ${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        width={500}
        height={500}
        priority={priority}
      />
    </div>
  );
}
