import { SessionOptions, getIronSession, unsealData } from "iron-session";
import type { NextRequest } from "next/server";

// Type for session data
export interface SessionData {
  userId?: number;
  username?: string;
  roles?: string;
  isLoggedIn: boolean;
  token?: string;
  profileImage?: string;
}

// Default session state when not logged in
export const defaultSession: SessionData = {
  isLoggedIn: false,
};

// Session configuration
export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    (process.env.NODE_ENV === "development" ? "FALLBACK_DEVELOPMENT_SECRET_KEY_IF_NO_ENV_FILE" : ""),
  cookieName: "flowchat_session",
  cookieOptions: {
    // secure should be true in production
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
  },
};

// Get the session data
export async function getSession() {
  const { cookies } = await import("next/headers");
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  // Initialize the session if not already done
  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }

  return session;
}

// Read-only version of session for middleware
export async function readSessionFromRequest(req: NextRequest): Promise<SessionData> {
  try {
    const cookieValue = req.cookies.get(sessionOptions.cookieName)?.value;

    if (!cookieValue) {
      return defaultSession;
    }

    const data = await unsealData<SessionData>(cookieValue, {
      password: sessionOptions.password,
    });

    return data.isLoggedIn ? data : defaultSession;
  } catch (error) {
    console.error("Error reading session in middleware:", error);
    return defaultSession;
  }
}
