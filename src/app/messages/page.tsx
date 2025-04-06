"use client";

import { faEllipsis, faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import messagingService, { ConnectionStatus, IncomingMessage, MessagingService } from "@/utils/messaging";
import ChatMessage from "@/components/chats/ChatMessage";

// Mock contact data - replace with API call later
const contacts = [
  {
    id: 4,
    name: "ncfcroy",
    lastMessage: "",
  },
  {
    id: 6,
    name: "royng163",
    lastMessage: "",
  },
];

export default function DirectMessagePage() {
  const { session } = useSession();
  const [selectedContact, setSelectedContact] = useState<(typeof contacts)[0] | null>(null);
  const [messages, setMessages] = useState<IncomingMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(messagingService.getStatus());
  const [currentTopic, setCurrentTopic] = useState<string>("");

  // Connect to WebSocket when component mounts
  useEffect(() => {
    if (!session.isLoggedIn || !session.token) return;

    const unsubscribeStatus = messagingService.onStatusChange(setConnectionStatus);

    if (messagingService.getStatus() !== ConnectionStatus.CONNECTED) {
      messagingService.connect(session.token).catch((error) => {
        console.error("Failed to connect to messaging service:", error);
      });
    }

    return () => {
      unsubscribeStatus();
    };
  }, [session]);

  // Subscribe to the selected conversation
  useEffect(() => {
    if (!selectedContact || !session.userId) return;

    // Clear messages when switching contacts
    setMessages([]);

    const topic = MessagingService.createTopicName(session.userId, selectedContact.id);
    setCurrentTopic(topic);

    try {
      messagingService.subscribe(topic, (message) => {
        // Messaege is from the current user
        if (message.userIdFrom === session.userId) {
          setMessages((prev) =>
            prev.map((m) =>
              // If we find a temporary message with the same content that's pending
              m.userIdFrom === session.userId && m.content === message.content && !m.success
                ? message // Replace with server's confirmed message
                : m
            )
          );
        } else {
          // Message from the other user
          setMessages((prev) => [...prev, message]);
        }
      });
    } catch (error) {
      console.error("Failed to subscribe to topic:", error);
    }

    return () => {
      messagingService.unsubscribe(topic);
    };
  }, [selectedContact, session.userId]);

  // Send message function
  const sendMessage = () => {
    if (!messageText.trim() || !session.userId || !selectedContact) return;

    try {
      // Create a temporary message object for immediate display
      const tempMessage: IncomingMessage = {
        messageId: Date.now(), // Temporary ID
        userIdFrom: session.userId,
        userIdTo: selectedContact.id,
        attachTo: 0,
        content: messageText,
        sentAt: new Date().toISOString(),
        imageAPIList: null,
        success: true,
        refresh: false,
      };

      // Add to UI immediately
      setMessages((prev) => [...prev, tempMessage]);

      console.log("Sending message:", tempMessage);
      // Send to server
      messagingService.sendMessage(currentTopic, {
        userIdFrom: session.userId,
        userIdTo: selectedContact.id,
        content: messageText,
        attachTo: 0,
        imageIdList: [],
      });

      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Handle pressing Enter in the input field
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex h-full">
      {/* Left column */}
      <div className="hidden lg:block w-1/8"></div>
      {/* Middle column - Direct message content */}
      <div className="bg-base-100 min-h-full flex flex-grow w-6/8">
        {/* Contact List (Left)*/}
        <div className="w-1/3 flex flex-col bg-base-100">
          <div className="flex items-end p-2 h-24 text-2xl font-bold">Contacts</div>
          <ul className="list overflow-y-auto">
            {contacts.map((contact) => (
              <li
                key={contact.id}
                className={`list-row cursor-pointer hover:bg-base-200 ${
                  selectedContact?.id === contact.id ? "bg-base-200" : ""
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="bg-neutral text-neutral-content place-content-center rounded-full w-10 h-10">
                  {/* <FontAwesomeIcon icon={faUser} /> */}
                </div>
                <div>
                  <div>{contact.name}</div>
                  <div className="text-xs uppercase font-semibold opacity-60">
                    {connectionStatus === ConnectionStatus.CONNECTED ? "Online" : "Offline"}
                  </div>
                </div>
                <p className="list-col-wrap text-xs">{contact.lastMessage}</p>
              </li>
            ))}
          </ul>
        </div>
        {/* Conversation (Right) */}
        <div className="w-2/3 flex flex-col bg-base-300">
          {selectedContact ? (
            <div className="overflow-y-auto flex flex-col flex-grow">
              <div className="flex h-14 justify-between items-center bg-base-100 shadow-md p-2">
                <Link href={`/profile/${selectedContact.id}`}>
                  <div className="avatar items-center gap-2">
                    <div className="bg-neutral text-neutral-content place-content-center rounded-full w-10">
                      {/* <FontAwesomeIcon icon={faUser} /> */}
                    </div>
                    <span className="text-md">{selectedContact.name}</span>
                  </div>
                </Link>
                <div className="flex gap-1">
                  {/* Options menu */}
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className={`btn btn-ghost btn-circle btn-md`}>
                      <FontAwesomeIcon icon={faEllipsis} size="xl" />
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 shadow-lg w-26">
                      <li>
                        <a>
                          <FontAwesomeIcon icon={faFlag} />
                          <span>Report</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Messages */}
              <div className="flex-grow space-y-4 p-4">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.messageId}
                    isOwner={message.userIdFrom === session.userId}
                    message={message}
                  />
                ))}
              </div>
              {/* Message input */}
              <div className="flex p-2 gap-2">
                <div className="input-group w-full">
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder={
                      connectionStatus === ConnectionStatus.CONNECTED
                        ? "Type a message..."
                        : "Connecting to chat server..."
                    }
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={connectionStatus !== ConnectionStatus.CONNECTED}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center shadow-md">
              <div className="text-center text-base-content/50">
                <p>Select a contact to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Right column */}
      <div className="hidden lg:block w-1/8"></div>
    </div>
  );
}
