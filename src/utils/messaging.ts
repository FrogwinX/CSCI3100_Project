import SockJS from "sockjs-client";
import { Client, Message, Frame } from "@stomp/stompjs";

// Message types
export interface OutgoingMessage {
  userIdFrom: number;
  userIdTo: number;
  content: string;
  attachTo: number;
  imageIdList: number[];
}

export interface IncomingMessage {
  messageId: number;
  userIdFrom: number;
  userIdTo: number;
  content: string;
  attachTo: number;
  sentAt: string;
  imageAPIList: string[] | null;
  success: boolean;
  refresh: boolean;
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
        const socket = new SockJS("https://flowchatbackend.azurewebsites.net/chat");

        this.client = new Client({
          webSocketFactory: () => socket,
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
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

  // Subscribe to a topic (conversation)
  public subscribe(topic: string, callback: (message: IncomingMessage) => void): void {
    if (!this.client || !this.client.connected) {
      throw new Error("Not connected to WebSocket server");
    }

    // Unsubscribe if already subscribed
    this.unsubscribe(topic);

    // Subscribe to new topic
    const subscription = this.client.subscribe(`/topic/${topic}`, (message: Message) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        callback(parsedMessage);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    // Store subscription
    this.subscriptions.set(topic, {
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
  public sendMessage(topic: string, message: OutgoingMessage): void {
    if (!this.client || !this.client.connected) {
      throw new Error("Not connected to WebSocket server");
    }

    this.client.publish({
      destination: `/app/send/${topic}`,
      body: JSON.stringify(message),
    });
  }

  // Create a topic name from two user IDs
  public static createTopicName(userId1: number, userId2: number): string {
    return `user${Math.min(userId1, userId2)}-user${Math.max(userId1, userId2)}`;
  }
}

// Create a singleton instance
export const messagingService = new MessagingService();

// Export default for easier imports
export default messagingService;
