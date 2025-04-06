import { IncomingMessage } from "@/utils/messaging";

export default function ChatMessage({ isOwner, message }: { isOwner: boolean; message: IncomingMessage }) {
  return (
    <div className={`chat ${isOwner ? "chat-end" : "chat-start"}`}>
      <div className="chat-image avatar">
        <div className="bg-neutral text-neutral-content place-content-center rounded-full w-10">
          {/* <FontAwesomeIcon icon={faUser} /> */}
        </div>
      </div>
      <div className="chat-bubble bg-neutral text-neutral-content font-light text-sm max-w-[55%] break-words">
        {message.content}
      </div>
      <div className="chat-footer opacity-50">
        <div className="font-bold">{message.success ? "Success" : "Failed"}</div>
        {new Date(message.sentAt).toLocaleTimeString("en", { hour: "numeric", minute: "numeric" })}
      </div>
    </div>
  );
}
