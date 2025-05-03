export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-fit min-h-full w-full">
      {/* Left column */}
      <div className="hidden lg:flex w-1/6"></div>

      {/* Middle column - main content */}
      <div className="flex flex-grow flex-col w-full lg:w-4/6 bg-base-100 min-h-full px-8 py-4">{children}</div>

      {/* Right column */}
      <div className="hidden lg:flex w-1/6"></div>
    </div>
  );
}
