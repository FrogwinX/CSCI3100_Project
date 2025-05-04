import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { getProxyImageUrl } from "@/utils/images";

export default function UserAvatar({
  src,
  username = null,
  size = "md",
}: {
  src: string | null;
  username?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
}) {
  const imageUrl = src ? getProxyImageUrl(src) : null;

  const containerSizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-14 h-14",
    xxl: "w-28 h-28",
  };

  const iconSizes = {
    xs: "sm",
    sm: "1x",
    md: "lg",
    lg: "xl",
    xl: "2xl",
    xxl: "4x",
  } as const;

  const textSizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg",
    xl: "text-xl",
    xxl: "text-2xl",
  };

  const currentContainerSize = containerSizes[size] || containerSizes.md;
  const currentIconSize = iconSizes[size] || iconSizes.md;
  const currentTextSize = textSizes[size] || textSizes.md;

  return (
    <div className="avatar avatar-placeholder gap-1 items-center">
      <div className={`${!imageUrl ? "bg-neutral text-neutral-content" : ""} ${currentContainerSize} rounded-full `}>
        {/* Show avatar if available, Fallback to icon if not */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${username}'s avatar`}
            width={64}
            height={64}
            className="object-cover"
            unoptimized
          />
        ) : (
          <FontAwesomeIcon icon={faUser} size={currentIconSize} />
        )}
      </div>
      {/* Show username if given */}
      {username && <span className={`${currentTextSize}`}>{username}</span>}
    </div>
  );
}
