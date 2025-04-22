export default async function Home() {
  // This page won't actually render since middleware handles redirects
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loading loading-spinner loading-lg"></div>
    </div>
  );
}
