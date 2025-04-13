export default function LoadingContact() {
  return (
    <li className="flex items-center gap-3 p-4 border-b border-base-200">
      <div className="skeleton w-10 h-10 rounded-full bg-base-300"></div>
      <div className="flex flex-col gap-2 flex-1">
        <div className="skeleton h-4 w-24 bg-base-300"></div>
        <div className="skeleton h-3 w-32 bg-base-300"></div>
      </div>
    </li>
  );
}
