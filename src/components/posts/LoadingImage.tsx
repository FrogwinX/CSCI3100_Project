"use client";

import { useState } from "react";
import Image from "next/image";

// Helper function to convert backend URLs to local API route
function getProxyImageUrl(url: string): string {
  // Handle case where URL already contains the API path
  if (url.includes("flowchatbackend.azurewebsites.net/api/")) {
    const urlParts = url.split("/api/");
    if (urlParts.length > 1) {
      return `/api/${urlParts[1]}`;
    }
  }
  return url;
}

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

  const imageUrl = getProxyImageUrl(src);

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-base-300">
      {/* Blurred background image */}
      <div className="absolute inset-0 w-full h-full opacity-60">
        <Image
          src={imageUrl}
          alt="Blurred background"
          className="object-cover blur-3xl w-full h-full"
          width={500}
          height={500}
        />
      </div>
      {/* Main image */}
      <div className="relative w-full h-full items-center justify-center">
        <div className="relative">
          {/* Skeleton */}
          {isLoading && <div className={`skeleton w-full h-full absolute inset-0 ${className}`}></div>}

          {/* Actual image */}
          <Image
            src={imageUrl}
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
      </div>
    </div>
  );
}
