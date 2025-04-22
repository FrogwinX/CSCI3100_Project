"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SessionData, defaultSession } from "@/utils/sessions";

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
