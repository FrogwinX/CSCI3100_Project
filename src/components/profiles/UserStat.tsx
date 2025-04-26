"use client";

export default function UserStat({
  data = "0",
  type = "following" }:
  {
    data?: string
    type?: "following" | "follower" | "like"
  }) {

  const titleType = {
    following: "Followings",
    follower: "Followers",
    like: "Likes",
  };

  const title = titleType[type];

  return (
    <div className="flex items-center gap-3">
      <h1 className="text-xl">
        {data}
      </h1>
      <h1 className="text-xl text-base-content/70">
        {title}
      </h1>
    </div>
  );
}
