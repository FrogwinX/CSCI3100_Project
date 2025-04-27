import { IncomingMessage } from "@/utils/messaging";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ChatMessage({
  isOwner,
  message,
  isSelected = false,
  onMessageClick,
}: {
  isOwner: boolean;
  message: IncomingMessage;
  isSelected?: boolean;
  onMessageClick?: (messageId: number) => void;
}) {
  const handleClick = () => {
    // Only allow selection of user's own messages
    if (isOwner && onMessageClick) {
      onMessageClick(message.messageId);
    }
  };

  return (
    <div
      className={`chat px-4 py-2 ${isOwner ? "chat-end" : "chat-start"} ${isSelected ? "bg-primary/20" : ""}`}
      onClick={handleClick}
    >
      <div
        className={`chat-bubble ${
          isOwner ? "bg-primary text-primary-content" : "bg-neutral text-neutral-content"
        } font-medium text-sm max-w-[55%] break-words`}
      >
        {message.isActive ? (
          message.content
        ) : (
          <span className="opacity-50 italic font-bold">
            <FontAwesomeIcon icon={faBan} className="mr-2" />
            Message has been deleted
          </span>
        )}
      </div>
      <div className="chat-footer opacity-50">
        <div className="font-bold">{message.readAt ? "Seen" : message.messageId === -1 ? "Sending" : "Sent"}</div>
        {new Date(message.sentAt).toLocaleTimeString("en", { hour: "numeric", minute: "numeric" })}
      </div>
    </div>
  );
}
