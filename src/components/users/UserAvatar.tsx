import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { getProxyImageUrl } from "@/utils/images"; // Assuming you have this helper

export default function UserAvatar({
  src,
  username = null,
  size = "md",
}: {
  src: string | null;
  username?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
}) {
  const imageUrl = src ? getProxyImageUrl(src) : null;

  const containerSizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    xs: "sm",
    sm: "1x",
    md: "lg",
    lg: "xl",
  } as const;

  const textSizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg",
  };

  const currentContainerSize = containerSizes[size] || containerSizes.md;
  const currentIconSize = iconSizes[size] || iconSizes.md;
  const currentTextSize = textSizes[size] || textSizes.md;

  return (
    <div className="avatar avatar-placeholder gap-1 items-center">
      <div className={`${!imageUrl ? "bg-neutral text-neutral-content" : ""} ${currentContainerSize} rounded-full `}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${username}'s avatar`}
            width={parseInt(currentContainerSize.split("-")[1]) * 4}
            height={parseInt(currentContainerSize.split("-")[1]) * 4}
            className="object-cover"
          />
        ) : (
          <FontAwesomeIcon icon={faUser} size={currentIconSize} />
        )}
      </div>
      {username && <span className={`${currentTextSize}`}>{username}</span>}
    </div>
  );
}
