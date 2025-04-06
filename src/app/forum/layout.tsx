import BackButton from "@/components/navigation/BackButton";
import SideMenu from "@/components/navigation/SideMenu";
import { TagProvider } from "@/hooks/useTags";

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return (
    <TagProvider>
      <div className="flex h-full w-full gap-x-2 md:px-32">
        {/* Left column - conditionally rendered back button */}
        <div className="hidden lg:flex w-1/6 flex-col items-end pt-4 pr-4 sticky h-fit">
          <BackButton />
        </div>
        {/* Middle column - main content */}
        <div className="flex-grow w-full lg:w-4/6">
          <div className="bg-base-100 min-h-full">{children}</div>
        </div>
        {/* Right column - conditionally rendered action menu */}
        <div className="hidden md:block w-1/6">
          <div className="card bg-base-100 fixed w-77 h-full overflow-hidden">
            <SideMenu />
          </div>
        </div>
      </div>
    </TagProvider>
  );
}
