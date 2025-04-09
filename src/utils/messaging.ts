import SockJS from "sockjs-client";
import { Client, Message } from "@stomp/stompjs";
import { getSession } from "@/utils/sessions";

// Message types
export interface OutgoingMessage {
  userIdFrom: number;
  userIdTo: number;
  content: string | null;
  attachTo: number | null;
  imageIdList: number[] | null;
  action: string;
  messageIdList: number[] | null;
}

export interface ReceivedMessage {
  success: boolean;
  errorMessage: string | null;
  action: string;
  time: string;
  readOrDeleteMessageIdList: number[] | null;
  messageDetail: IncomingMessage;
}

export interface IncomingMessage {
  messageId: number;
  userIdFrom: number;
  userIdTo: number;
  content: string;
  attachTo: number | null;
  sentAt: string;
  readAt: string | null;
  imageAPIList: string[] | null;
}

export interface Contact {
  messageId: number;
  contactUsername: string;
  latestMessage: string;
  userIdFrom: number;
  usernameFrom: string;
  userIdTo: number;
  usernameTo: string;
  sentAt: string;
  readAt: string;
  unreadMessageCount: number;
}

interface ContactListResponse {
  message: string;
  data: {
    contactList: Contact[];
    isSuccess: boolean;
  };
}

// Connection status
export enum ConnectionStatus {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error",
}

// Messaging service
export class MessagingService {
  private client: Client | null = null;
  private subscriptions = new Map<string, { id: string; callback: (message: IncomingMessage) => void }>();
  private status: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private statusListeners: ((status: ConnectionStatus) => void)[] = [];

  // Get current connection status
  public getStatus(): ConnectionStatus {
    return this.status;
  }

  // Add status change listener
  public onStatusChange(listener: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  // Update connection status
  private updateStatus(newStatus: ConnectionStatus): void {
    this.status = newStatus;
    this.statusListeners.forEach((listener) => listener(newStatus));
  }

  // Connect to WebSocket server
  public connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client) {
        this.disconnect();
      }

      this.updateStatus(ConnectionStatus.CONNECTING);

      try {
        const socket = new SockJS("https://flowchatbackend.azurewebsites.net/chat", null, {
          transports: ["websocket", "xhr-streaming", "xhr-polling"],
          debug: false,
        });

        this.client = new Client({
          webSocketFactory: () => socket,
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 10000,
          heartbeatOutgoing: 10000,
        });

        this.client.onConnect = () => {
          this.updateStatus(ConnectionStatus.CONNECTED);
          resolve();
        };

        this.client.activate();
      } catch (error) {
        console.error("Failed to connect:", error);
      }
    });
  }

  // Disconnect from WebSocket server
  public disconnect(): void {
    if (this.client && this.client.connected) {
      // Unsubscribe from all topics
      this.subscriptions.forEach((sub) => {
        if (this.client) {
          this.client.unsubscribe(sub.id);
        }
      });
      this.subscriptions.clear();

      this.client.deactivate();
      this.client = null;
      this.updateStatus(ConnectionStatus.DISCONNECTED);
    }
  }

  // Subscribe to user channel
  public subscribe(channel: string, callback: (message: IncomingMessage) => void): void {
    if (!this.client || !this.client.connected) {
      throw new Error("Not connected to WebSocket server");
    }

    // Unsubscribe if already subscribed
    this.unsubscribe(channel);

    // Subscribe to the channel
    const subscription = this.client.subscribe(`/channel/${channel}`, (message: Message) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        callback(parsedMessage);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    // Store subscription
    this.subscriptions.set(channel, {
      id: subscription.id,
      callback,
    });
  }

  // Unsubscribe from a topic
  public unsubscribe(topic: string): void {
    const subscription = this.subscriptions.get(topic);
    if (subscription && this.client) {
      this.client.unsubscribe(subscription.id);
      this.subscriptions.delete(topic);
    }
  }

  // Send a message
  public sendMessage(channel: string, message: OutgoingMessage): void {
    if (!this.client || !this.client.connected) {
      throw new Error("Not connected to WebSocket server");
    }

    this.client.publish({
      destination: `/app/send/${channel}`,
      body: JSON.stringify(message),
    });
  }
}

export async function getContactsList(count: number): Promise<Contact[]> {
  try {
    const session = await getSession();

    let apiUrl = `https://flowchatbackend.azurewebsites.net/api/Chat/getContactList?userId=${session.userId}&contactNum=${count}`;

    apiUrl += `&excludingUserIdList=0`;

    // Fetch data from the API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();

    // Safer property access with detailed logging
    if (!data) {
      console.error("Empty response from API");
      return [];
    }

    if (!data.data) {
      console.error("Response missing data property:", data);
      return [];
    }

    return data.data.contactList;
  } catch (error) {
    console.error("Error fetching contact list:", error);
    return [];
  }
}

// Create a singleton instance
export const messagingService = new MessagingService();
