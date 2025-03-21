"use server";

import { cookies } from "next/headers";

// Set authentication data in cookies
export async function setAuthCookies(userData: any) {
  // Set auth token in HttpOnly cookie
  (await cookies()).set({
    name: "auth_token",
    value: userData.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 86400, // 1 day
    path: "/",
    sameSite: "strict",
  });

  // Set user info in regular cookie (accessible to client JS)
  const userInfo = {
    roles: userData.roles,
    id: userData.id,
    username: userData.username,
  };

  (await cookies()).set({
    name: "user",
    value: JSON.stringify(userInfo),
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 86400,
    path: "/",
    sameSite: "strict",
  });

  return { success: true };
}

// Clear auth cookies
export async function clearAuthCookies() {
  (await cookies()).delete("auth_token");
  (await cookies()).delete("user");
  return { success: true };
}
