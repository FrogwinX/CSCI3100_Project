"use client";

import { useRouter } from "next/navigation";
import UserList from "@/components/users/UserPreviewList";

export default function UserRelationsTab({
  userId,
  Section,
}: {
  userId: string;
  Section: "following" | "followers" | "blocked";
}) {
  const router = useRouter();
  const tabs = [
    { name: "following", label: "Following" },
    { name: "followers", label: "Followers" },
    { name: "blocked", label: "Blocked" },
  ];

  // Function to render the content based on the active tab
  const renderContent = () => {
    switch (Section) {
      case "following":
        return <UserList searchKeyword={userId} relationType="following" />;
      case "followers":
        return <UserList searchKeyword={userId} relationType="followers" />;
      case "blocked":
        return <UserList searchKeyword={userId} relationType="blocked" />;
    }
  };

  const handleTabClick = (tabName: string) => {
    // Only navigate if the clicked tab is not already active
    if (Section !== tabName) {
      router.push(`/profile/${userId}/${tabName}`, { scroll: false });
    }
  };

  const getTabClass = (tabName: string) => {
    return `tab text-lg ${Section === tabName ? "tab-active" : ""}`;
  };

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div role="tablist" className="tabs tabs-border w-full place-content-evenly">
        {tabs.map((tab) => (
          <a key={tab.name} role="tab" className={`${getTabClass(tab.name)}`} onClick={() => handleTabClick(tab.name)}>
            {tab.label}
          </a>
        ))}
      </div>
      <div>{renderContent()}</div>
    </div>
  );
}
