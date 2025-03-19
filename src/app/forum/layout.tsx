import BackButton from "@/components/navigation/BackButton";
import { Suspense } from "react";

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-grow w-full gap-x-2 md:px-32">
      {/* Left column - empty space */}
      <div className="hidden lg:flex w-1/6 flex-col items-end pt-4 pr-4 sticky top-16 h-fit">
        <BackButton />
      </div>

      {/* Middle column - main content */}
      <div className="flex-grow w-full lg:w-4/6">
        <div className="bg-base-100 min-h-full">
          <Suspense
            fallback={
              <div className="p-4 flex flex-col gap-4">
                {/* Skeleton posts - create multiple for better visual effect */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card bg-base-100 border border-base-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="skeleton w-10 h-10 rounded-full"></div>
                      <div className="skeleton h-4 w-32"></div>
                      <div className="skeleton h-3 w-16 ml-auto"></div>
                    </div>
                    <div className="skeleton h-6 w-3/4 mb-3"></div>
                    <div className="flex flex-col gap-2">
                      <div className="skeleton h-4 w-full"></div>
                      <div className="skeleton h-4 w-full"></div>
                      <div className="skeleton h-4 w-2/3"></div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <div className="skeleton h-4 w-12"></div>
                      <div className="skeleton h-4 w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
      </div>

      {/* Right column - tags or empty space */}
      <div className="hidden md:block w-1/6">
        {/* This will be conditionally rendered based on route */}
        <div className="card bg-base-100 sticky top-20 p-4">
          <h3 className="text-lg font-bold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">{/* Tags will be added dynamically */}</div>
        </div>
      </div>
    </div>
  );
}
