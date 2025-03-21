export default function LoadingPostPreview() {
  return (
    <div className="card bg-base-100 p-4">
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
  );
}
