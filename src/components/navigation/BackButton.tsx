"use client";

import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, usePathname } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const isPostDetailPage = pathname?.includes("/forum/post/");

  if (!isPostDetailPage) return null;

  return (
    <button onClick={() => router.back()} className="btn btn-circle btn-lg bg-base-100">
      <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
    </button>
  );
}
