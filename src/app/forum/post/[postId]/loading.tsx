export default function PostDetailLoading() {
  return (
    <div className="flex flex-col px-4 py-2 gap-4">
      {/* Loading Post Detail */}
      <div className="card bg-base-100 p-4">
        {/* Header with avatar, username, time */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="skeleton w-10 h-10 rounded-full"></div>
            <div className="skeleton h-4 w-32"></div>
          </div>
          <div className="skeleton h-8 w-20"></div>
        </div>

        {/* Title */}
        <div className="skeleton h-8 w-3/4 mb-6"></div>

        {/* Description with multiple lines */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-4/5"></div>
          <div className="skeleton h-4 w-2/3"></div>
        </div>

        {/* Image placeholder */}
        <div className="skeleton w-full h-64 mb-6 rounded-lg"></div>

        {/* Tags */}
        <div className="flex gap-2 mb-4">
          <div className="skeleton h-6 w-16 rounded-full"></div>
          <div className="skeleton h-6 w-20 rounded-full"></div>
          <div className="skeleton h-6 w-12 rounded-full"></div>
        </div>

        {/* Footer with actions */}
        <div className="flex gap-3 mt-2">
          <div className="skeleton h-10 w-24 rounded-xl"></div>
          <div className="skeleton h-10 w-24 rounded-xl"></div>
          <div className="skeleton h-10 w-24 rounded-xl"></div>
        </div>
      </div>

      {/* Loading Comments Section */}
      <div id="comments" className="card bg-base-100 p-4 scroll-mt-16">
        {/* Comments header */}
        <div className="skeleton h-6 w-40 mb-6"></div>

        {/* Comment input */}
        <div className="skeleton h-24 w-full mb-6 rounded-lg"></div>

        {/* Comments list */}
        <div className="flex flex-col gap-6">
          {/* Comment 1 */}
          <div className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="skeleton w-8 h-8 rounded-full"></div>
              <div className="skeleton h-4 w-24"></div>
            </div>
            <div className="pl-10">
              <div className="skeleton h-4 w-full mb-2"></div>
              <div className="skeleton h-4 w-3/4 mb-2"></div>
              <div className="flex gap-2 mt-2">
                <div className="skeleton h-6 w-16 rounded-lg"></div>
                <div className="skeleton h-6 w-16 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Comment 2 */}
          <div className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="skeleton w-8 h-8 rounded-full"></div>
              <div className="skeleton h-4 w-28"></div>
            </div>
            <div className="pl-10">
              <div className="skeleton h-4 w-full mb-2"></div>
              <div className="skeleton h-4 w-4/5 mb-2"></div>
              <div className="flex gap-2 mt-2">
                <div className="skeleton h-6 w-16 rounded-lg"></div>
                <div className="skeleton h-6 w-16 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
