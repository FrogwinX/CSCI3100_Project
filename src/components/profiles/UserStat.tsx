"use client";

export default function UserStat({
  data = 0,
  type = "following",
}: {
  data?: number;
  type?: "following" | "followers" | "like";
}) {
  const titleType = {
    following: "Following",
    followers: "Followers",
    like: "Likes",
  };

  const title = titleType[type];

  return (
    <div className="flex items-center gap-3 text-xl">
      {Intl.NumberFormat("en", {
        notation: "compact",
      }).format(data)}
      <h1 className="text-xl text-base-content/70">{title}</h1>
    </div>
  );
}
