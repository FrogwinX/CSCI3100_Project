"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to register page if not logged in
    if (!user) {
      router.push("/register");
    }
  }, [user, router]);

  // Show loading state or nothing while checking auth
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return <div className="skeleton size-full"></div>;
}
