import LoadingPostPreview from "@/components/posts/LoadingPostPreview";

export default function Loading() {
  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Render multiple skeleton posts */}
      {[1, 2, 3].map((i) => (
        <LoadingPostPreview key={i} />
      ))}
    </div>
  );
}
