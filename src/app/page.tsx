"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import NavBar from "@/components/navigation/NavBar";

export default function Home() {
  const [count, setCount] = useState(0);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to register page if not logged in
    if (!isLoading && !user) {
      router.push("/register");
    }
  }, [user, isLoading, router]);

  const addCount = async () => {
    setCount(count + 1);
  };

  // Show loading state or nothing while checking auth
  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-base-200 min-h-screen">
      <NavBar />

      <div className="flex flex-1 bg-base-200 place-content-center place-items-center">
        <div className="card bg-base-100 size-fit card-xl shadow-xl mt-10">
          <div className="card-body">
            <h2 className="card-title text-base-content">
              Welcome, {user.name}!
            </h2>
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
      </div>
    </div>
  );
}
