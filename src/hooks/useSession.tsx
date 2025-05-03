"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from "react";
import { SessionData, defaultSession } from "@/utils/sessions";
import { ConnectionStatus, messagingService } from "@/utils/messaging";

// Context setup
const SessionContext = createContext<{
  session: SessionData;
  loading: boolean;
  refresh: () => Promise<void>;
}>({
  session: defaultSession,
  loading: true,
  refresh: async () => {},
});

// Provider component
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionData>(defaultSession);
  const [loading, setLoading] = useState(true);
  const connectRetryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch session data
  const refresh = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/session");
      const data = await response.json();
      setSession(data);
    } catch (error) {
      console.error("Failed to refresh session:", error);
      setSession(defaultSession);
    } finally {
      setLoading(false);
    }
  };

  // Load session on mount
  useEffect(() => {
    refresh();
  }, []);

  // Function to connect to the messaging service with retry logic
  const connectWithRetry = useCallback(
    async (attempt = 1): Promise<void> => {
      // Clear any existing retry timeout
      if (connectRetryTimeoutRef.current) {
        clearTimeout(connectRetryTimeoutRef.current);
        connectRetryTimeoutRef.current = null;
      }

      // Don't attempt if already connected or connecting
      const currentStatus = messagingService.getStatus();
      if (currentStatus === ConnectionStatus.CONNECTED || currentStatus === ConnectionStatus.CONNECTING) {
        return;
      }

      if (attempt > 20) {
        // Limit retries
        console.error("WebSocket connection failed after multiple attempts.");
        return;
      }

      try {
        // Ensure token exists before connecting
        if (!session.token) {
          return;
        }
        await messagingService.connect(session.token);
      } catch (error) {
        // Schedule retry
        connectRetryTimeoutRef.current = setTimeout(() => connectWithRetry(attempt + 1), 500);
      }
    },
    [session.token] // Dependency: session.token
  );

  // Connect to chat service when entering the web app
  useEffect(() => {
    if (session.isLoggedIn && session.token) {
      // User is logged in, attempt connection if not already connected/connecting
      if (messagingService.getStatus() !== ConnectionStatus.CONNECTED) {
        connectWithRetry();
      }
    } else {
      // User is not logged in or session is invalid, ensure disconnection
      messagingService.disconnect();
      // Clear any pending retry timeout
      if (connectRetryTimeoutRef.current) {
        clearTimeout(connectRetryTimeoutRef.current);
        connectRetryTimeoutRef.current = null;
      }
    }

    // Cleanup on component unmount or session change
    return () => {
      if (connectRetryTimeoutRef.current) {
        clearTimeout(connectRetryTimeoutRef.current);
      }
    };
  }, [session.isLoggedIn, session.token, connectWithRetry]);

  return <SessionContext.Provider value={{ session, loading, refresh }}>{children}</SessionContext.Provider>;
}

// Hook to use the session
export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
