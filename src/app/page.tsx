"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Short timeout to allow for middleware to process first
    const redirectTimer = setTimeout(() => {
      if (user) {
        router.push("/forum"); // Redirect to forum if logged in
      } else {
        router.push("/login"); // Redirect to login if not logged in
      }
    }, 100);

    return () => clearTimeout(redirectTimer);
  }, [user, router]);

  return (
    <div className="place-items-center">
      <span className="loading loading-spinner loading-xl bg-primary"></span>
    </div>
  );
}
