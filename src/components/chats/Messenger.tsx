"use client";

import {
  faEllipsis,
  faFlag,
  faCheckSquare as faCheckedSquare,
  faTrashAlt,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
  const [inSelection, setInSelection] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<number>>(new Set());
  const [searchInput, setSearchInput] = useState("");

  // Keep a ref of the selected contact such that it can be used in the message subscription callback
  const selectedContactRef = useRef<Contact | undefined>(undefined);
  useEffect(() => {
    selectedContactRef.current = selectedContact;
  }, [selectedContact]);

  const getContactUserId = (contact: Contact) => {
    if (contact.usernameFrom === contact.contactUsername) {
      return contact.userIdFrom;
    } else if (contact.usernameTo === contact.contactUsername) {
      return contact.userIdTo;
    }

    if (contact.messageId === -1) {
      // Temporary contact, use the userIdFrom for the temp contact
      return contact.userIdFrom;
    }
    return -1;
  };

  // Connect to WebSocket when component mounts
  useEffect(() => {
    if (!session.isLoggedIn || !session.token) return;

    const unsubscribeStatus = messagingService.onStatusChange(setConnectionStatus);
    let retryCount = 0;
    let retryTimeout: NodeJS.Timeout;

    const connectWithRetry = async () => {
      if (messagingService.getStatus() === ConnectionStatus.CONNECTED) return;

      try {
        await messagingService.connect(session.token!);
      } catch {
        if (retryCount < 3) {
          console.log(`Retrying connection (${retryCount + 1}/3)...`);
          retryCount++;
          retryTimeout = setTimeout(connectWithRetry, 1000);
        } else {
          console.log("Max retries reached");
        }
      }
    };

    connectWithRetry();

    return () => {
      unsubscribeStatus();
      clearTimeout(retryTimeout);
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
        const currentContact = selectedContactRef.current;
        console.log("Received message:", message);
        if (currentContact) {
          switch (message.action) {
            case "send":
              if (
                messageDetail.userIdFrom === getContactUserId(currentContact) ||
                messageDetail.userIdTo === getContactUserId(currentContact)
              ) {
                // Check if this is a message we sent
                if (messageDetail.userIdFrom === session.userId) {
                  // Replace the temporary version with the server version which have the messageId)
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.userIdFrom === session.userId && m.content === messageDetail.content && m.messageId === -1
                        ? messageDetail
                        : m
                    )
                  );
                } else {
                  // For messages from other users, just add them
                  setMessages((prev) => [...prev, messageDetail]);

                  // Mark new message as read immediately if this conversation is active
                  if (selectedContact) {
                    readMessages([messageDetail]);
                  }
                }
              }
              break;
            case "read":
              // Update the read status of messages
              setMessages((prev) =>
                prev.map((m) =>
                  message.readOrDeleteMessageIdList?.includes(m.messageId)
                    ? { ...m, readAt: new Date().toISOString() }
                    : m
                )
              );
              break;
            case "delete":
              // Remove deleted messages from the UI
              setMessages((prev) => prev.filter((m) => !message.readOrDeleteMessageIdList?.includes(m.messageId)));
              break;
          }
        }
      });

      setContacts(initialContacts);
    } catch (error) {
      console.error("Failed to subscribe to channel:", error);
    }

    return () => {
      if (session.userId) {
        messagingService.unsubscribe(`/channel/${session.userId}`);
      }
    };
  }, [session, connectionStatus]);

  // Mark messages as read when contact is selected or when new messages arrive
  useEffect(() => {
    if (selectedContact && messages.length > 0 && connectionStatus === ConnectionStatus.CONNECTED) {
      readMessages(messages);
    }
  }, [selectedContact, messages]);

  // Send message function
  const sendMessage = () => {
    if (!messageText.trim() || !session.userId || !selectedContact) return;

    try {
      // Create a temporary message object for immediate display
      const tempMessage: IncomingMessage = {
        messageId: -1, // Temporary ID
        userIdFrom: session.userId,
        userIdTo: getContactUserId(selectedContact),
        content: messageText,
        attachTo: 0,
        sentAt: new Date().toISOString(),
        readAt: null,
        imageAPIList: null,
      };

      console.log("Sending message:", tempMessage);

      // Add to UI immediately
      setMessages((prev) => [...prev, tempMessage]);

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

  const readMessages = (messages: IncomingMessage[]) => {
    if (!session.userId || !selectedContact) return;

    // Filter unread messages received from the other user
    const unreadMessages = messages.filter(
      (msg) => !msg.readAt && msg.userIdFrom === getContactUserId(selectedContact) && msg.userIdTo === session.userId
    );

    if (unreadMessages.length === 0) return;

    // Extract message IDs
    const messageIds = unreadMessages.map((msg) => msg.messageId);

    try {
      messagingService.sendMessage(`${session.userId}`, {
        userIdFrom: session.userId,
        userIdTo: getContactUserId(selectedContact),
        content: null,
        attachTo: null,
        imageIdList: null,
        action: "read",
        messageIdList: messageIds,
      });
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  const deleteMessages = () => {
    if (selectedMessages.size === 0 || !session.userId || !selectedContact) return;

    try {
      messagingService.sendMessage(`${session.userId}`, {
        userIdFrom: session.userId,
        userIdTo: getContactUserId(selectedContact),
        content: null,
        attachTo: null,
        imageIdList: null,
        action: "delete",
        messageIdList: Array.from(selectedMessages),
      });

      // Update UI immediately for better user experience
      setMessages((prev) => prev.filter((msg) => !selectedMessages.has(msg.messageId)));

      // Exit selection mode
      setInSelection(false);
      setSelectedMessages(new Set());
    } catch (error) {
      console.error("Failed to delete messages:", error);
    }
  };

  const toggleSelection = (messageId: number) => {
    if (!inSelection) return;

    setSelectedMessages((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(messageId)) {
        newSelection.delete(messageId);
      } else {
        newSelection.add(messageId);
      }
      return newSelection;
    });
  };

  // Exit selection mode
  const handleSelectionButton = () => {
    setInSelection(!inSelection);
    setSelectedMessages(new Set());
  };

  // Handle pressing Enter in the input field
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const searchUser = async (uid: string) => {
    if (!session.userId || !session.token) return;

    const userId = parseInt(uid, 10);

    try {
      // Check if we already have a conversation with this user
      const existingContact = initialContacts.find((contact) => getContactUserId(contact) === userId);

      if (existingContact) {
        // If we already have a conversation, just select it
        setSelectedContact(existingContact);
        setSearchInput("");
        return;
      }

      // Create a new temporary contact
      const newContact: Contact = {
        messageId: -1, // Temporary ID
        contactUsername: "Unknown User",
        latestMessage:
          "This is a temp contact, a real contact can be created using the Get Search User Result API. Reload the page after sending a message to get a real contact for now",
        userIdFrom: userId,
        usernameFrom: "",
        userIdTo: -1,
        usernameTo: "",
        sentAt: "",
        readAt: "",
        unreadMessageCount: 0,
      };

      // Update the contacts list and select the new contact
      setContacts((prev) => [newContact, ...prev]);
      setSelectedContact(newContact);
      setMessages([]);
      setSearchInput("");
    } catch (error) {
      console.error("Error searching for user:", error);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchUser(searchInput);
    }
  };

  return (
    <div className="flex h-full">
      {/* Left column */}
      <div className="hidden lg:block w-1/8"></div>
      {/* Middle column - Direct message content */}
      <div className="bg-base-200 min-h-full flex flex-grow w-6/8 shadow-lg">
        {/* Contact List (Left)*/}
        <div className="w-1/3 flex flex-col bg-base-100 shadow-md">
          <div className="flex flex-col p-2 gap-2">
            <h1 className="text-2xl font-bold mt-6">Contacts</h1>
            {/* Search bar */}
            <div className="relative bg-base-200 rounded-full p-1">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
              />
              <input
                type="text"
                placeholder="Enter user ID to create a new chat for now"
                // placeholder="Search Contacts"
                className="w-full h-full rounded-full text-sm pl-8 pr-3"
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
            </div>
          </div>
          <ul className="list overflow-y-auto">
            {/* Please create a contact component */}
            {connectionStatus !== ConnectionStatus.CONNECTED ? (
              [1, 2, 3, 4, 5, 6].map((item) => <LoadingContact key={item} />)
            ) : contacts.length === 0 ? (
              <p className="text-base-content/50 text-center mt-4 break-words text-wrap mx-16">
                Start a new conversation with someone to get started
              </p>
            ) : (
              contacts.map((contact) => (
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
              ))
            )}
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
                <div className="flex gap-1 place-items-center">
                  {inSelection && (
                    <div className="badge badge-outline badge-primary">Selected {selectedMessages.size} messages</div>
                  )}

                  {/* Options menu */}
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className={`btn btn-ghost btn-circle btn-md`}>
                      <FontAwesomeIcon icon={faEllipsis} size="xl" />
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 shadow-lg w-26">
                      {/* Selection mode toggle */}
                      <li>
                        <a onClick={handleSelectionButton}>
                          <FontAwesomeIcon icon={inSelection ? faCheckedSquare : faCheckSquare} />
                          <span>{inSelection ? "Cancel" : "Select"}</span>
                        </a>
                      </li>

                      {/* Delete option - only visible when in selection mode and messages selected */}
                      {inSelection && selectedMessages.size > 0 && (
                        <li>
                          <a onClick={deleteMessages}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                            <span>Delete</span>
                          </a>
                        </li>
                      )}

                      {/* Report option */}
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
              <div className="flex-grow">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.messageId}
                    isOwner={message.userIdFrom === session.userId}
                    message={message}
                    isSelected={selectedMessages.has(message.messageId)}
                    onMessageClick={toggleSelection}
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
                    <span className="flex items-center gap-1">
                      Connecting
                      <span className="loading loading-dots loading-sm"></span>
                    </span>
                  ) : (
                    <span>Send direct messages to users on FlowChat</span>
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
