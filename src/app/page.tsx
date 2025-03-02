"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const [count, setCount] = useState(0);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to register page if not logged in
    if (!user) {
      router.push("/register");
    }
  }, [user, router]);

  const addCount = async () => {
    setCount(count + 1);
  };

  // Show loading state or nothing while checking auth
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 size-fit card-xl shadow-xl mt-10">
      <div className="card-body">
        <h2 className="card-title text-base-content">Welcome, {user.name}!</h2>
        <p className="text-base-content">Click count: {count}</p>
        <div className="justify-end card-actions">
          <button
            onClick={addCount}
            className="btn bg-primary text-primary-content"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
