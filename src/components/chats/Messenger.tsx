"use client";

import { faEllipsis, faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { ConnectionStatus, IncomingMessage, messagingService, Contact } from "@/utils/messaging";
import ChatMessage from "@/components/chats/ChatMessage";
import LoadingContact from "@/components/chats/LoadingContact";

export default function Messenger({ initialContacts }: { initialContacts: Contact[] }) {
  const { session } = useSession();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact>();
  const [messages, setMessages] = useState<IncomingMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(messagingService.getStatus());

  const getContactUserId = (contact: Contact) => {
    if (contact.usernameFrom === contact.contactUsername) {
      return contact.userIdFrom;
    } else if (contact.usernameTo === contact.contactUsername) {
      return contact.userIdTo;
    }
    return 0;
  };

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

  // Subscribe to user own channel
  useEffect(() => {
    if (!session.userId || connectionStatus !== ConnectionStatus.CONNECTED) return;

    // Clear messages
    setMessages([]);

    try {
      messagingService.subscribe(`${session.userId}`, (message) => {
        const messageDetail = message.messageDetail;
        if (
          selectedContact &&
          (messageDetail.userIdFrom === getContactUserId(selectedContact) ||
            messageDetail.userIdTo === getContactUserId(selectedContact))
        ) {
          // Check if this is a message we sent
          if (messageDetail.userIdFrom === session.userId) {
            // Replace the temporary version with the server version which have the messageId)
            setMessages((prev) =>
              prev.map((m) =>
                // Use timestamp-based matching since temp messages won't have real IDs
                m.userIdFrom === session.userId &&
                m.content === messageDetail.content &&
                !m.messageId.toString().includes(".")
                  ? messageDetail
                  : m
              )
            );
          } else {
            // For messages from other users, just add them
            setMessages((prev) => [...prev, messageDetail]);
          }
        }
      });
    } catch (error) {
      console.error("Failed to subscribe to channel:", error);
    }

    return () => {
      if (session.userId) {
        messagingService.unsubscribe(`/channel/${session.userId}`);
      }
    };
  }, [session.userId, connectionStatus]);

  // Send message function
  const sendMessage = () => {
    if (!messageText.trim() || !session.userId || !selectedContact) return;

    try {
      // Create a temporary message object for immediate display
      const tempMessage: IncomingMessage = {
        messageId: Date.now(), // Temporary ID
        userIdFrom: session.userId,
        userIdTo: getContactUserId(selectedContact),
        content: messageText,
        attachTo: 0,
        sentAt: new Date().toISOString(),
        readAt: null,
        imageAPIList: null,
      };

      // Add to UI immediately
      setMessages((prev) => [...prev, tempMessage]);

      console.log("Sending message:", tempMessage);
      // Send to server
      messagingService.sendMessage(`${session.userId}`, {
        userIdFrom: session.userId,
        userIdTo: getContactUserId(selectedContact),
        content: messageText,
        attachTo: 0,
        imageIdList: [],
        action: "send",
        messageIdList: [],
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
      <div className="bg-base-200 min-h-full flex flex-grow w-6/8 shadow-lg">
        {/* Contact List (Left)*/}
        <div className="w-1/3 flex flex-col bg-base-100">
          <div className="flex items-end p-2 h-24 text-2xl font-bold ">Contacts</div>
          <ul className="list overflow-y-auto">
            {/* Please create a contact component */}
            {connectionStatus !== ConnectionStatus.CONNECTED
              ? [1, 2, 3, 4, 5, 6].map((item) => <LoadingContact key={item} />)
              : initialContacts.map((contact) => (
                  <li
                    key={getContactUserId(contact)}
                    className={`list-row cursor-pointer hover:bg-base-200 ${
                      selectedContact && getContactUserId(selectedContact) === getContactUserId(contact)
                        ? "bg-base-200"
                        : ""
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="bg-neutral text-neutral-content place-content-center rounded-full w-10 h-10">
                      {/* <FontAwesomeIcon icon={faUser} /> */}
                    </div>
                    <div>
                      <div>{contact.contactUsername}</div>
                    </div>
                    <p className="list-col-wrap text-xs">{contact.latestMessage}</p>
                  </li>
                ))}
          </ul>
        </div>
        {/* Conversation (Right) */}
        <div className="w-2/3 flex flex-col">
          {selectedContact ? (
            <div className="overflow-y-auto flex flex-col flex-grow">
              <div className="flex h-14 justify-between items-center bg-base-100 shadow-md p-2">
                <Link href={`/profile/${getContactUserId(selectedContact)}`}>
                  <div className="avatar items-center gap-2">
                    <div className="bg-neutral text-neutral-content place-content-center rounded-full w-10">
                      {/* <FontAwesomeIcon icon={faUser} /> */}
                    </div>
                    <span className="text-md">{selectedContact.contactUsername}</span>
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
              {/* Please create a custom input field component with image input */}
              <div className="flex p-2 gap-2">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Type here"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-base-content/50">
                <p>
                  {connectionStatus !== ConnectionStatus.CONNECTED ? (
                    connectionStatus === ConnectionStatus.CONNECTING ? (
                      <span className="flex items-center gap-1">
                        Connecting
                        <span className="loading loading-dots loading-sm"></span>
                      </span>
                    ) : (
                      <span>Connection unavailable</span>
                    )
                  ) : (
                    <span>Select a contact on the left to get started</span>
                  )}
                </p>
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
