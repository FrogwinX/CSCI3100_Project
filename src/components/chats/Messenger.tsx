"use client";

import {
  faFileImage,
  faTrashAlt,
  faMagnifyingGlass,
  faImages,
  faMinus,
  faXmark,
  faArrowLeft,
  faAngleDown,
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
import { uploadImage } from "@/utils/images";

export default function Messenger() {
  const { session, refreshUnreadCount } = useSession();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact>();
  const [conversation, setConversation] = useState<IncomingMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(messagingService.getStatus());
  const [inSelection, setInSelection] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<number>>(new Set());
  const [searchInput, setSearchInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const messageLoaderRef = useRef<HTMLDivElement>(null);
  const [excludedMessageIds, setExcludedMessageIds] = useState<Set<number>>(new Set());
  const [replyTo, setReplyTo] = useState<IncomingMessage | null>(null);
  const [scrollingToMessageId, setScrollingToMessageId] = useState<number | null>(null);
  const [showConversation, setShowConversation] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const handleImageSelect: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length === 0) return; // Do nothing if no files selected

    // Append new files to the existing selection
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // Create object URLs only for the newly added files and append them
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setFilePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);

    // Clear the file input value to allow selecting the same file again if needed
    if (e.target) {
      e.target.value = "";
    }
  };

  const removeImagePreview = (indexToRemove: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    setFilePreviews((prevPreviews) => {
      const newPreviews = prevPreviews.filter((_, index) => index !== indexToRemove);
      // Revoke the object URL for the removed preview to free memory
      URL.revokeObjectURL(prevPreviews[indexToRemove]);
      return newPreviews;
    });
  };

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      filePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  // Keep a ref of the selected contact such that it can be used in the message subscription callback
  const selectedContactRef = useRef<Contact | undefined>(undefined);
  useEffect(() => {
    selectedContactRef.current = selectedContact;
  }, [selectedContact]);

  const handleContactSelect = async (contact: Contact) => {
    setSelectedContact(contact);
    setShowConversation(true); // Show conversation on mobile
    setConversation([]); // Clear previous conversation
    setInSelection(false); // Reset selection mode
    setSelectedMessages(new Set()); // Clear selected messages
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

  // Function to load older messages
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

  const fetchContacts = useCallback(async () => {
    // Don't fetch if not connected or already loading
    if (messagingService.getStatus() !== ConnectionStatus.CONNECTED) {
      console.log("Skipping fetchContacts:", { status: messagingService.getStatus() });
      return;
    }
    try {
      const fetchedContacts = await getContactsList(20);
      setContacts(fetchedContacts.filter((contact) => !contact.isContactUserBlocked));
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]); // Clear contacts on error
    }
  }, [ConnectionStatus]);

  // Listen for status changes and update local state
  useEffect(() => {
    // Subscribe to status changes to update local state
    const unsubscribeStatus = messagingService.onStatusChange(setConnectionStatus);

    // Update status immediately in case it changed between initial state and effect run
    setConnectionStatus(messagingService.getStatus());

    // Cleanup function
    return () => {
      unsubscribeStatus();
    };
  }, []);

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
              setConversation((prev) =>
                prev.map((m) =>
                  message.readOrDeleteMessageIdList?.includes(m.messageId) ? { ...m, isActive: false } : m
                )
              );
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

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (conversationRef.current) {
      // Scroll the container itself to the bottom
      conversationRef.current.scrollTo({
        top: conversationRef.current.scrollHeight,
        behavior: behavior,
      });
    }
  };

  const handleScroll = useCallback(() => {
    const currentDiv = conversationRef.current;
    if (currentDiv) {
      const { scrollTop } = currentDiv;

      const threshold = -100; // Pixels from bottom

      if (scrollTop < threshold) {
        setShowScrollToBottom(true);
      } else {
        setShowScrollToBottom(false);
      }
    }
  }, [setShowScrollToBottom]);

  // Handle scroll events for showing/hiding the button
  useEffect(() => {
    const conversationDiv = conversationRef.current;

    // Only add listener if the div exists
    if (conversationDiv) {
      conversationDiv.addEventListener("scroll", handleScroll, { passive: true });

      // Initial check right after attaching
      handleScroll();

      // Cleanup function specific to this effect run
      return () => {
        conversationDiv.removeEventListener("scroll", handleScroll);
        // Reset button state when contact changes or unmounts
        setShowScrollToBottom(false);
      };
    } else {
      // No cleanup needed if listener wasn't attached
      return () => {
        // Reset button state if effect re-runs and div is no longer there
        setShowScrollToBottom(false);
      };
    }
  }, [selectedContact]);

  // Send message function
  const sendMessage = async () => {
    // Allow sending only images without text
    if (!messageText.trim() && selectedFiles.length === 0) return;
    if (!session.userId || !selectedContact) return;

    let uploadedImageIds: number[] = [];
    let tempImageUrls: string[] = [...filePreviews];

    // Upload images if selected
    if (selectedFiles.length > 0) {
      try {
        // Show loading state for images
        const uploadPromises = selectedFiles.map((file) => uploadImage(file));
        const uploadResults = await Promise.all(uploadPromises);

        // Filter out failed uploads and get IDs
        uploadedImageIds = uploadResults.filter((result) => result.imageId !== 0).map((result) => result.imageId);

        if (uploadedImageIds.length !== selectedFiles.length) {
          console.warn("Some images failed to upload.");
          // Handle failed uploads (e.g., show error message)
          // For now, we'll just send the successfully uploaded ones
        }
      } catch (error) {
        console.error("Error during image upload process:", error);
        // Handle upload errors (e.g., show error message to user)
        return; // Stop message sending if uploads fail critically
      }
    }

    // No message text and no successfully uploaded images
    if (!messageText.trim() && uploadedImageIds.length === 0) {
      console.log("No text or successfully uploaded images to send.");
      // Clear potentially failed previews if only images were selected and all failed
      if (selectedFiles.length > 0) {
        setSelectedFiles([]);
        setFilePreviews([]);
      }
      return;
    }

    try {
      // Create a temporary message object for immediate display
      const tempMessage: IncomingMessage = {
        messageId: -1, // Temporary ID
        userIdFrom: session.userId,
        userIdTo: selectedContact.contactUserId,
        content: messageText,
        isActive: true,
        attachTo: replyTo ? replyTo.messageId : 0,
        sentAt: new Date().toISOString(),
        readAt: null,
        imageAPIList: tempImageUrls.length > 0 ? tempImageUrls : null,
      };

      // Add to UI immediately
      setConversation((prev) => [tempMessage, ...prev]);
      // Scroll to the bottom of the conversation
      scrollToBottom("smooth");

      // Send to server
      messagingService.sendMessage(`${session.userId}`, {
        userIdFrom: session.userId,
        userIdTo: selectedContact.contactUserId,
        content: messageText,
        attachTo: replyTo ? replyTo.messageId : 0,
        imageIdList: uploadedImageIds.length > 0 ? uploadedImageIds : [],
        action: "send",
        messageIdList: [],
      });

      setMessageText("");
      setSelectedFiles([]);
      setFilePreviews([]);
      setReplyTo(null);
      // Revoke object URLs for previews that were just sent
      tempImageUrls.forEach((url) => URL.revokeObjectURL(url));
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

      refreshUnreadCount(); // Refresh unread count after marking as read
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  const deleteMessages = (messageId?: number) => {
    if (!session.userId || !selectedContact) return;

    // If messageId is provided (from using delete dropdown option), delete that specific message
    const messageIds = messageId ? [messageId] : Array.from(selectedMessages);

    try {
      messagingService.sendMessage(`${session.userId}`, {
        userIdFrom: session.userId,
        userIdTo: selectedContact.contactUserId,
        content: null,
        attachTo: null,
        imageIdList: null,
        action: "delete",
        messageIdList: messageIds,
      });

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

  const handleSelectionButton = (messageId?: number) => {
    setInSelection(!inSelection);

    if (messageId) {
      // If a message ID is provided, select that message
      setSelectedMessages(new Set([messageId]));
    } else {
      // If no message ID is provided, clear the selection
      setSelectedMessages(new Set());
    }
  };

  const handleScrollToMessage = (messageId: number) => {
    const element = document.getElementById(`${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      // Highlight
      element.classList.add("bg-info/20", "transition-colors", "duration-1000");
      setTimeout(() => {
        element.classList.remove("bg-info/20", "transition-colors", "duration-1000");
      }, 1000);
    } else {
      // If not found, set the target ID to trigger the useEffect loader
      setScrollingToMessageId(messageId);
    }
  };

  // handle loading and scrolling when target is set
  useEffect(() => {
    // Only run if we have a target ID and are not currently loading messages
    if (scrollingToMessageId === null || isLoadingMoreMessages) {
      return;
    }

    const targetElement = document.getElementById(`${scrollingToMessageId}`);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      // Highlight the message
      targetElement.classList.add("bg-primary/20", "transition-colors", "duration-1000");
      setTimeout(() => {
        targetElement.classList.remove("bg-primary/20", "transition-colors", "duration-1000");
      }, 1000);

      // Reset the target ID
      setScrollingToMessageId(null);
    } else {
      // Message still not found, check if more messages can be loaded
      if (hasMoreMessages) {
        // Trigger loading more messages
        loadMoreMessages();
      } else {
        // No more messages to load, and the target wasn't found
        setScrollingToMessageId(null); // Reset the target ID
      }
    }
  }, [scrollingToMessageId, isLoadingMoreMessages, conversation, hasMoreMessages, loadMoreMessages]);

  // Function to go back to contact list on mobile
  const handleBackButton = () => {
    setShowConversation(false);
    setSelectedContact(undefined);
    setConversation([]);
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
        <div
          className={`w-full lg:w-1/3 flex flex-col bg-base-100 shadow-md ${
            showConversation ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="flex flex-col p-2 gap-2">
            <h1 className="text-3xl font-bold mt-6">Contacts</h1>
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
                      {contact.userIdFrom === session.userId ? "You: " : ""}

                      {contact.latestMessage ? (
                        contact.latestMessage
                      ) : (
                        <span className="italic opacity-80">
                          <FontAwesomeIcon icon={faFileImage} /> Image
                        </span>
                      )}
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
        <div className={`w-full lg:w-2/3 flex flex-col ${showConversation ? "flex" : "hidden md:flex"}`}>
          {selectedContact ? (
            <div className="relative overflow-y-auto flex flex-col flex-grow">
              {/* Header with contact info and action buttons */}
              <div className="flex h-14 justify-between items-center bg-base-100 shadow-md p-2">
                <div className="flex items-center gap-1">
                  {/* Back Button */}
                  <button className="btn btn-ghost btn-circle btn-sm" onClick={handleBackButton}>
                    <FontAwesomeIcon icon={faArrowLeft} size="xl" />
                  </button>
                  {/* Contact info and avatar */}
                  <Link href={`/profile/${selectedContact.contactUserId}`}>
                    <UserAvatar src={selectedContact.contactUserAvatar} username={selectedContact.contactUsername} />
                  </Link>
                </div>
                {/* Action buttons */}
                <div className="flex gap-2 items-center">
                  {inSelection ? (
                    <>
                      {/* Show count and delete/cancel buttons when in selection mode */}
                      <span className="text-sm font-medium mr-2">{selectedMessages.size} selected</span>
                      {selectedMessages.size > 0 && (
                        <button
                          className="btn btn-soft btn-error btn-sm"
                          onClick={() => deleteMessages()}
                          aria-label="Delete selected messages"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                          Delete
                        </button>
                      )}
                      <button
                        className="btn btn-sm"
                        onClick={() => handleSelectionButton()}
                        aria-label="Cancel selection"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Enter selection mode */}
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => handleSelectionButton()}
                        aria-label="Select messages"
                      >
                        <FontAwesomeIcon icon={faCheckSquare} size="xl" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div ref={conversationRef} className="flex flex-col-reverse flex-grow overflow-y-auto px-2">
                {/* Map messages */}
                {conversation.map((message) => {
                  // Find the original message if this is a reply
                  let originalMessage: IncomingMessage | undefined = undefined;
                  if (message.attachTo && message.attachTo !== 0) {
                    originalMessage = conversation.find((m) => m.messageId === message.attachTo) ?? {
                      messageId: message.attachTo,
                      userIdFrom: 0,
                      userIdTo: 0,
                      content: "[Tap to load and jump to original message]",
                      isActive: true,
                      attachTo: 0,
                      sentAt: new Date().toISOString(),
                      readAt: null,
                      imageAPIList: null,
                    };
                  }

                  return (
                    <ChatMessage
                      key={message.messageId}
                      myUserId={session.userId!}
                      message={message}
                      isSelected={selectedMessages.has(message.messageId)}
                      onMessageClick={toggleSelection}
                      handleSelectOption={handleSelectionButton}
                      handleDeleteOption={deleteMessages}
                      isInSelectionMode={inSelection}
                      handleReplyOption={(messageId) =>
                        setReplyTo(conversation.find((msg) => msg.messageId === messageId) || null)
                      }
                      handleScrollToMessage={handleScrollToMessage}
                      replyTo={originalMessage}
                      contactUsername={selectedContact.contactUsername}
                    />
                  );
                })}
                {/* Observer target and loading state for older messages */}
                <div ref={messageLoaderRef} className="py-2 text-center">
                  {isLoadingMoreMessages ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : !hasMoreMessages && conversation.length > 0 ? (
                    <p className="text-xs text-base-content/50">This is the begining of the conversation</p>
                  ) : (
                    <div className="h-1"></div> // Placeholder for observer
                  )}
                </div>
              </div>

              {/* Scroll to Bottom Button */}
              {showScrollToBottom && (
                <button
                  onClick={() => scrollToBottom()}
                  className="absolute bottom-20 right-4 btn btn-circle btn-sm z-40 shadow-lg"
                >
                  <FontAwesomeIcon icon={faAngleDown} />
                </button>
              )}

              {/* Input Area */}
              <div className="flex flex-col p-2 bg-base-100 border border-base-300">
                {/* Reply Indicator */}
                {replyTo && (
                  <div className="flex justify-between items-center p-2 mb-2 rounded-md bg-base-200 border-l-4 border-primary">
                    <div className="text-xs overflow-hidden">
                      <p className="font-semibold flex items-center gap-1">
                        {replyTo.userIdFrom === session.userId ? "You" : selectedContact.contactUsername}
                      </p>
                      <p className="truncate opacity-70">
                        {replyTo.content || (replyTo.imageAPIList ? "[Image]" : "[Original message]")}
                      </p>
                    </div>
                    {/* Remove button */}
                    <button onClick={() => setReplyTo(null)} className="btn btn-xs btn-circle bg-base-100">
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                )}
                {/* Image Previews */}
                {filePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2 p-2">
                    {filePreviews.map((previewUrl, index) => (
                      <div key={index} className="indicator">
                        <img src={previewUrl} alt={`Preview ${index}`} className="h-16 w-16 object-cover rounded" />
                        <div className="indicator-item">
                          <button onClick={() => removeImagePreview(index)} className="btn btn-circle btn-soft btn-xs">
                            <FontAwesomeIcon icon={faMinus} size="lg" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Text Input and Buttons */}
                <div className="flex gap-2 items-center">
                  {/* Hidden File Input */}
                  <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleImageSelect} />
                  {/* Image Upload Button */}
                  <button
                    className="btn btn-ghost btn-circle"
                    onClick={() => fileInputRef.current?.click()} // Trigger hidden input
                    aria-label="Attach image"
                  >
                    <FontAwesomeIcon icon={faImages} size="lg" />
                  </button>
                  <input
                    type="text"
                    className="input input-ghost flex-grow"
                    placeholder="Type here"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                  />
                  {/* Send Button */}
                  <button className="btn btn-primary" onClick={sendMessage}>
                    Send
                  </button>
                </div>
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
