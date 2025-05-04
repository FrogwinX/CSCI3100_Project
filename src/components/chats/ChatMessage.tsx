import { getProxyImageUrl } from "@/utils/images";
import { IncomingMessage } from "@/utils/messaging";
import { faBan, faAngleDown, faReply } from "@fortawesome/free-solid-svg-icons";
import { faCheckSquare, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function ChatMessage({
  myUserId,
  message,
  isSelected = false,
  onMessageClick,
  handleDeleteOption,
  handleSelectOption,
  isInSelectionMode,
  handleReplyOption,
  handleScrollToMessage,
  replyTo,
  contactUsername,
}: {
  myUserId: number;
  message: IncomingMessage;
  isSelected?: boolean;
  onMessageClick: (messageId: number) => void;
  handleDeleteOption: (messageId: number) => void;
  handleSelectOption: (messageId: number) => void;
  isInSelectionMode: boolean;
  handleReplyOption: (messageId: number) => void;
  handleScrollToMessage: (messageId: number) => void;
  replyTo?: IncomingMessage;
  contactUsername: string;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const hasImages = message.imageAPIList && message.imageAPIList.length > 0;
  const isOwner = message.userIdFrom === myUserId;

  const handleClick = () => {
    // Only allow selection of user's own messages
    if (isOwner && onMessageClick && isInSelectionMode && message.messageId !== -1 && message.isActive) {
      // Toggle selection state
      onMessageClick(message.messageId);
    }
  };

  const handleReplyPreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (message.attachTo) {
      handleScrollToMessage(message.attachTo);
    }
  };

  const handleReplyAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (message.isActive && message.messageId !== -1) {
      handleReplyOption(message.messageId);
    }
  };

  const handleSelectAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOwner && message.isActive && message.messageId !== -1) {
      handleSelectOption(message.messageId);
    }
  };

  const handleDeleteAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOwner && message.isActive && message.messageId !== -1) {
      handleDeleteOption(message.messageId);
    }
  };

  return (
    <div
      id={message.messageId.toString()}
      className={`chat ${isOwner ? "chat-end" : "chat-start"} ${isSelected ? "bg-primary/20" : ""}`}
      onClick={handleClick} // selection toggling
    >
      <div
        className={`chat-bubble relative ${
          isOwner ? "bg-primary text-primary-content" : "bg-neutral text-neutral-content"
        } font-medium text-sm break-words max-w-[85%] lg:max-w-[60%] ${isOwner ? "flex-row" : "flex-row-reverse"}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Action Menu (Checkbox or Dropdown) */}
        {message.isActive && message.messageId !== -1 && (
          <div
            className={`
           absolute top-1/2 transform -translate-y-1/2
           ${isOwner ? "right-full mr-2" : "left-full ml-2"}
           z-10 flex items-center
           transition-opacity duration-150
           ${isHovering || isInSelectionMode ? "opacity-100" : "opacity-0"}
          `}
          >
            {/* Show Checkbox when in selection mode */}
            {isInSelectionMode ? (
              <input type="checkbox" className="checkbox" checked={isSelected} readOnly />
            ) : (
              /* Show Dropdown Trigger when NOT in selection mode */
              <div className={`dropdown dropdown-top ${isOwner ? "dropdown-start" : "dropdown-end"}`}>
                <button tabIndex={0} role="button" className="btn btn-circle btn-xs bg-base-100">
                  <FontAwesomeIcon icon={faAngleDown} />
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box w-26 shadow text-base-content bg-base-100"
                >
                  <li>
                    <a onClick={handleReplyAction}>
                      <FontAwesomeIcon icon={faReply} />
                      Reply
                    </a>
                  </li>
                  {isOwner && (
                    <>
                      <li>
                        <a onClick={handleSelectAction}>
                          <FontAwesomeIcon icon={faCheckSquare} />
                          Select
                        </a>
                      </li>

                      <li>
                        <a onClick={handleDeleteAction} className="text-error/80">
                          <FontAwesomeIcon icon={faTrashAlt} />
                          Delete
                        </a>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
        {message.isActive ? (
          <div className="flex flex-col gap-1">
            {/* Reply Preview Section */}
            {replyTo && message.attachTo !== 0 && (
              <div
                className={`bg-base-100/50 p-2 rounded-md cursor-pointer border-l-4 text-base-content border-secondary " 
                `}
                onClick={handleReplyPreviewClick}
              >
                <p className="font-semibold text-xs opacity-90">
                  {replyTo.userIdFrom === myUserId ? "You" : contactUsername}
                </p>
                <p className="text-xs opacity-80 truncate">
                  {replyTo.content ? replyTo.content : <span className="italic opacity-80">Image</span>}
                </p>
              </div>
            )}
            {/* Display images if they exist */}
            {hasImages && (
              <div className={`grid gap-1 ${message.imageAPIList!.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                {message.imageAPIList!.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl.startsWith("blob:") ? imageUrl : getProxyImageUrl(imageUrl)}
                    alt={`Message image ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
            {message.content}
          </div>
        ) : (
          <span className="opacity-50 italic font-bold">
            <FontAwesomeIcon icon={faBan} className="mr-2" />
            Message has been deleted
          </span>
        )}
      </div>
      <div className="chat-footer opacity-50">
        {isOwner && (
          <div className="font-bold">{message.readAt ? "Seen" : message.messageId === -1 ? "Sending" : "Sent"}</div>
        )}
        {new Date(message.sentAt).toLocaleString(undefined, {
          year: "2-digit",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      </div>
    </div>
  );
}
