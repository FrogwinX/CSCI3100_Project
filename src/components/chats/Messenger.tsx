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
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "@/hooks/useSession";
import {
  ConnectionStatus,
  IncomingMessage,
  messagingService,
  Contact,
  getContactsList,
  getMessageHistory,
} from "@/utils/messaging";
import ChatMessage from "@/components/chats/ChatMessage";
import LoadingContact from "@/components/chats/LoadingContact";
import UserAvatar from "@/components/users/UserAvatar";
import { faImage } from "@fortawesome/free-solid-svg-icons";

export default function Messenger() {
  const { session } = useSession();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact>();
  const [conversation, setConversation] = useState<IncomingMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(messagingService.getStatus());
  const [inSelection, setInSelection] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<number>>(new Set());
  const [searchInput, setSearchInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const conversationRef = useRef<HTMLDivElement>(null);
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const messageLoaderRef = useRef<HTMLDivElement>(null);
  const [excludedMessageIds, setExcludedMessageIds] = useState<Set<number>>(new Set());
  const connectRetryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleImageSelect: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  // Keep a ref of the selected contact such that it can be used in the message subscription callback
  const selectedContactRef = useRef<Contact | undefined>(undefined);
  useEffect(() => {
    selectedContactRef.current = selectedContact;
  }, [selectedContact]);

  const handleContactSelect = async (contact: Contact) => {
    setSelectedContact(contact);
    setConversation([]); // Clear previous conversation
    setIsLoadingMoreMessages(true); // Show loading indicator
    setHasMoreMessages(true); // Reset hasMore flag
    try {
      const messageHistory = await getMessageHistory(contact.contactUserId, 15);
      setConversation(messageHistory);

      // Add fetched message IDs to excludedMessageIds
      const newExcludedIds = new Set<number>();
      messageHistory.forEach((message) => newExcludedIds.add(Number(message.messageId)));
      setExcludedMessageIds(newExcludedIds);
    } catch (error) {
      console.error("Error fetching message history:", error);
      setHasMoreMessages(false); // Assume no more messages on error
    } finally {
      setIsLoadingMoreMessages(false);
    }
  };

  // Function to load more messages (older ones)
  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMoreMessages || !hasMoreMessages || !selectedContact || conversation.length === 0) return;

    setIsLoadingMoreMessages(true);
    try {
      // Fetch older messages
      const olderMessages = await getMessageHistory(selectedContact.contactUserId, 15, Array.from(excludedMessageIds));

      // Update excludedMessageIds with new messages
      setExcludedMessageIds((prevExcludedIds) => {
        const newExcludedIds = new Set(prevExcludedIds);
        olderMessages.forEach((message) => newExcludedIds.add(Number(message.messageId)));
        return newExcludedIds;
      });

      if (olderMessages.length > 0) {
        setConversation((prev) => [...prev, ...olderMessages]); // Append older messages
      } else {
        setHasMoreMessages(false); // No more messages to load
      }
    } catch (error) {
      console.error("Failed to load more messages:", error);
      setHasMoreMessages(false); // Stop trying on error
    } finally {
      setIsLoadingMoreMessages(false);
    }
  }, [isLoadingMoreMessages, hasMoreMessages, selectedContact, conversation]);

  // Infinite scrolling setup for messages
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreMessages && !isLoadingMoreMessages) {
          loadMoreMessages();
        }
      },
      {
        root: conversationRef.current, // Observe within the scrollable container
        threshold: 0.1,
      }
    );

    const currentLoaderRef = messageLoaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [hasMoreMessages, isLoadingMoreMessages, loadMoreMessages]);

  // Connect to the messaging service with retry logic
  const connectWithRetry = useCallback(
    async (attempt = 1): Promise<void> => {
      // Clear any existing retry timeout
      if (connectRetryTimeoutRef.current) {
        clearTimeout(connectRetryTimeoutRef.current);
        connectRetryTimeoutRef.current = null;
      }

      if (messagingService.getStatus() === ConnectionStatus.CONNECTED) {
        console.log("Already connected.");
        return;
      }
      if (attempt > 20) {
        // Limit retries
        console.error("WebSocket connection failed after multiple attempts.");
        setConnectionStatus(ConnectionStatus.ERROR); // Set error state explicitly
        return;
      }

      setConnectionStatus(ConnectionStatus.CONNECTING); // Ensure status is connecting

      try {
        await messagingService.connect(session.token!);
      } catch (error) {
        connectRetryTimeoutRef.current = setTimeout(() => connectWithRetry(attempt + 1), 500);
      }
    },
    [session.token]
  );

  const fetchContacts = useCallback(async () => {
    // Don't fetch if not connected or already loading
    if (messagingService.getStatus() !== ConnectionStatus.CONNECTED) {
      console.log("Skipping fetchContacts:", { status: messagingService.getStatus() });
      return;
    }
    try {
      const fetchedContacts = await getContactsList(20);
      setContacts(fetchedContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]); // Clear contacts on error
    }
  }, [ConnectionStatus]);

  // Connect to websocket
  useEffect(() => {
    if (!session.isLoggedIn || !session.token || !session.userId) {
      // If session is lost, disconnect and clear state
      messagingService.disconnect();
      setContacts([]);
      setSelectedContact(undefined);
      setConversation([]);
      return;
    }

    // Subscribe to status changes
    const unsubscribeStatus = messagingService.onStatusChange(setConnectionStatus);

    // Attempt initial connection if disconnected
    if (messagingService.getStatus() === ConnectionStatus.DISCONNECTED) {
      connectWithRetry();
    }

    // Cleanup function
    return () => {
      unsubscribeStatus();
      // Clear any pending retry timeout on component unmount or session change
      if (connectRetryTimeoutRef.current) {
        clearTimeout(connectRetryTimeoutRef.current);
      }
    };
  }, [session.isLoggedIn, session.token, session.userId, connectWithRetry]);

  // Subscribe to user channel and fetch contacts
  useEffect(() => {
    if (connectionStatus === ConnectionStatus.CONNECTED && session.userId) {
      // Subscribe to user channel
      messagingService.subscribe(`${session.userId}`, (message) => {
        const messageDetail = message.messageDetail;
        const currentContact = selectedContactRef.current;
        console.log("Received message:", message);
        // Update contacts list
        fetchContacts();
        if (currentContact) {
          switch (message.action) {
            case "send":
              // Message from self (replace temp)
              if (messageDetail.userIdFrom === session.userId) {
                setConversation((prev) =>
                  prev.map((m) =>
                    m.messageId === -1 && m.content === messageDetail.content // More specific check
                      ? messageDetail
                      : m
                  )
                );
              }
              // Message from selected contact
              else if (messageDetail.userIdFrom === currentContact.contactUserId) {
                setConversation((prev) => [messageDetail, ...prev]); // Prepend for flex-reverse
                readMessages([messageDetail]); // Mark as read
              }
              // Message from *another* contact - update contact list state
              else {
                console.log("Message from another contact, fetching updated contacts list...");
                fetchContacts(); // Fetch contacts if message is from someone else
              }
              break;
            case "read":
              setConversation((prev) =>
                prev.map((m) =>
                  message.readOrDeleteMessageIdList?.includes(m.messageId) ? { ...m, readAt: message.time } : m
                )
              );
              break;
            case "delete":
              setConversation((prev) => prev.filter((m) => !message.readOrDeleteMessageIdList?.includes(m.messageId)));
              break;
          }
        } else {
          // Message received, but no contact selected. Update contacts list.
          fetchContacts();
        }
      });

      // Fetch initial contacts after successful connection and subscription setup
      fetchContacts();

      // Cleanup for this effect: Unsubscribe when status is no longer CONNECTED or userId changes
      return () => {
        messagingService.unsubscribe(`/channel/${session.userId}`);
      };
    }
  }, [connectionStatus, session.userId, fetchContacts]);

  // Mark messages as read when contact is selected or when new messages arrive
  useEffect(() => {
    if (selectedContact && conversation.length > 0 && connectionStatus === ConnectionStatus.CONNECTED) {
      readMessages(conversation);
    }
  }, [selectedContact, conversation]);

  // Send message function
  const sendMessage = () => {
    if (!messageText.trim() || !session.userId || !selectedContact) return;

    let imageIdList: number[] = [];
    if (selectedFiles.length) {
    }

    try {
      // Create a temporary message object for immediate display
      const tempMessage: IncomingMessage = {
        messageId: -1, // Temporary ID
        userIdFrom: session.userId,
        userIdTo: selectedContact.contactUserId,
        content: messageText,
        attachTo: 0,
        sentAt: new Date().toISOString(),
        readAt: null,
        imageAPIList: null,
      };

      // Add to UI immediately
      setConversation((prev) => [tempMessage, ...prev]);
      // Scroll to the bottom of the conversation
      if (conversationRef.current) {
        conversationRef.current.scrollTo({
          top: conversationRef.current.scrollHeight,
          behavior: "smooth",
        });
      }

      // Send to server
      messagingService.sendMessage(`${session.userId}`, {
        userIdFrom: session.userId,
        userIdTo: selectedContact.contactUserId,
        content: messageText,
        attachTo: 0,
        imageIdList: [],
        action: "send",
        messageIdList: [],
      });

      setMessageText("");
      setSelectedFiles([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const readMessages = (messages: IncomingMessage[]) => {
    if (!session.userId || !selectedContact) return;

    // Filter unread messages received from the other user
    const unreadMessages = messages.filter(
      (msg) => !msg.readAt && msg.userIdFrom === selectedContact.contactUserId && msg.userIdTo === session.userId
    );

    if (unreadMessages.length === 0) return;

    // Extract message IDs
    const messageIds = unreadMessages.map((msg) => msg.messageId);

    try {
      messagingService.sendMessage(`${session.userId}`, {
        userIdFrom: session.userId,
        userIdTo: selectedContact.contactUserId,
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
        userIdTo: selectedContact.contactUserId,
        content: null,
        attachTo: null,
        imageIdList: null,
        action: "delete",
        messageIdList: Array.from(selectedMessages),
      });

      // Update UI immediately for better user experience
      setConversation((prev) => prev.filter((msg) => !selectedMessages.has(msg.messageId)));

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
      const existingContact = contacts.find((contact) => contact.contactUserId === userId);

      if (existingContact) {
        // If we already have a conversation, just select it
        setSelectedContact(existingContact);
        setSearchInput("");
        return;
      }

      // Create a new temporary contact
      const newContact: Contact = {
        messageId: -1, // Temporary ID
        contactUserId: userId,
        contactUsername: "Unknown User",
        contactUserAvatar: null,
        isContactUserBlocked: false,
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
      setConversation([]);
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
            <div className="my-2 flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <span
                className={`badge ${
                  connectionStatus === ConnectionStatus.CONNECTED
                    ? "badge-success"
                    : connectionStatus === ConnectionStatus.CONNECTING
                    ? "badge-warning"
                    : "badge-error"
                } badge-sm`}
              >
                {connectionStatus.toLowerCase()}
              </span>
            </div>
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
                  key={contact.contactUserId}
                  className={`cursor-pointer p-2 hover:bg-base-200 ${
                    selectedContact?.contactUserId === contact.contactUserId ? "bg-base-200" : ""
                  }`}
                  onClick={() => handleContactSelect(contact)}
                >
                  <UserAvatar src={contact.contactUserAvatar} username={contact.contactUsername} size="lg" />
                  <div className="flex justify-between items-center text-md">
                    <span className="truncate">
                      {contact.userIdFrom === session.userId ? `You: ${contact.latestMessage}` : contact.latestMessage}
                    </span>
                    {contact.unreadMessageCount > 0 && (
                      <span className="badge badge-info badge-sm text-info-content">{contact.unreadMessageCount}</span>
                    )}
                  </div>
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
                <Link href={`/profile/${selectedContact.contactUserId}`}>
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
              <div ref={conversationRef} className="flex flex-col-reverse flex-grow overflow-y-auto p-2">
                {/* Map messages */}
                {conversation.map((message) => (
                  <ChatMessage
                    key={message.messageId}
                    isOwner={message.userIdFrom === session.userId}
                    message={message}
                    isSelected={selectedMessages.has(message.messageId)}
                    onMessageClick={toggleSelection}
                  />
                ))}
                {/* Observer target and loading state for older messages */}
                <div ref={messageLoaderRef} className="py-2 text-center">
                  {isLoadingMoreMessages ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : !hasMoreMessages && conversation.length > 0 ? (
                    <p className="text-xs text-base-content/50">This is the begining of this chat</p>
                  ) : (
                    <div className="h-1"></div> // Placeholder for observer
                  )}
                </div>
              </div>
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
