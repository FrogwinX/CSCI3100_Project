import BackButton from "@/components/navigation/BackButton";

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-grow w-full gap-x-2 md:px-32">
      {/* Left column - conditionally rendered back button */}
      <div className="hidden lg:flex w-1/6 flex-col items-end pt-4 pr-4 sticky top-16 h-fit">
        <BackButton />
      </div>

      {/* Middle column - main content */}
      <div className="flex-grow w-full lg:w-4/6">
        <div className="bg-base-100 min-h-full">{children}</div>
      </div>

      {/* Right column - conditionally rendered action menu */}
      <div className="hidden md:block w-1/6">
        <div className="card bg-base-100 sticky top-20">
          <div className="card-body">
            <h2 className="card-title">Action menu</h2>
            <p>
              @CH0ISUM Please make this conditionally rendered component like the back button on the left and a mobile
              version of this like navbar.
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Filter</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
