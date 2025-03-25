"use server";

import { getSession } from "@/utils/sessions";

// API response types
interface ApiResponse<T> {
  message: string;
  data: T;
}

interface LoginData {
  isPasswordCorrect: boolean | null;
  isAccountActive: boolean;
  user: {
    roles: string;
    id: number;
    token: string;
    username: string;
  } | null;
}

interface RegisterData {
  user: {
    role: string;
    id: number;
    username: string;
  } | null;
  isSuccess: boolean;
}

interface RequestData {
  isSuccess: boolean;
}

interface EmailCheckData {
  isEmailUnique: boolean;
}

interface UsernameCheckData {
  isUsernameUnique: boolean;
}

interface DeleteAccountData {
  isSuccess: boolean;
}

interface ResetPasswordData {
  username: string | null;
  isSuccess: boolean;
}

// Helper function for API calls to reduce repetition
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`https://flowchatbackend.azurewebsites.net/api/${endpoint}`, options);
    const result: ApiResponse<T> = await response.json();
    return result;
  } catch (error) {
    console.error(`API error (${endpoint}):`, error);
    return {
      message: "An error occurred during the request",
      data: {} as T,
    };
  }
}

// Login server action
export async function login(formData: FormData) {
  const username = formData.get("username") as string | null;
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string;

  try {
    const result = await apiFetch<LoginData>("/Account/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    // Successful login
    if (result.data.isPasswordCorrect && result.data.isAccountActive && result.data.user) {
      const session = await getSession();

      // Save user data in session
      session.userId = result.data.user.id;
      session.username = result.data.user.username;
      session.roles = result.data.user.roles;
      session.isLoggedIn = true;
      session.token = result.data.user.token;
      await session.save();
    }

    return result;
  } catch {
    return {
      message: "Login failed",
      data: {
        isPasswordCorrect: false,
        isAccountActive: false,
        user: null,
      },
    };
  }
}

// Logout server action
export async function logout() {
  try {
    // clear session
    const session = await getSession();
    session.destroy();
  } catch (error) {
    console.error("Logout error:", error);
    return { error: "Failed to log out" };
  }
}

// Registration server action
export async function register(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const licenseKey = formData.get("licenseKey") as string;

  try {
    const result = await apiFetch<RegisterData>("Account/registerAccount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, licenseKey }),
    });

    return result;
  } catch {
    return {
      message: "An error occurred during registration",
      data: {
        user: null,
        isSuccess: false,
      },
    };
  }
}

// Request license key server action
export async function requestLicenseKey(email: string) {
  try {
    const result = await apiFetch<RequestData>("Account/requestLicenseKey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return result;
  } catch {
    return {
      message: "Failed to request license key",
      data: { isSuccess: false },
    };
  }
}

// Request authentication code server action
export async function requestAuthCode(email: string) {
  try {
    const result = await apiFetch<RequestData>("Account/requestAuthenticationCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return result;
  } catch {
    return {
      message: "Failed to request authentication code",
      data: { isSuccess: false },
    };
  }
}

// Check if email is unique server action
export async function checkEmailUnique(email: string) {
  try {
    return await apiFetch<EmailCheckData>(`Account/isEmailUnique?email=${encodeURIComponent(email)}`);
  } catch {
    return {
      message: "Failed to check email uniqueness",
      data: { isEmailUnique: false },
    };
  }
}

// Check if username is unique server action
export async function checkUsernameUnique(username: string) {
  try {
    return await apiFetch<UsernameCheckData>(`Account/isUsernameUnique?username=${encodeURIComponent(username)}`);
  } catch {
    return {
      message: "Failed to check username uniqueness",
      data: { isUsernameUnique: false },
    };
  }
}

// Delete account server action
export async function deleteAccount(formData: FormData) {
  const username = formData.get("username") as string | null;
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string;

  try {
    const result = await apiFetch<DeleteAccountData>("Account/deleteAccount", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    if (result.data.isSuccess) {
      logout();
    }

    return result;
  } catch {
    return {
      message: "Failed to delete account",
      data: { isSuccess: false },
    };
  }
}

// Reset password by email server action
export async function resetPasswordByEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const authenticationCode = formData.get("authenticationCode") as string;

  try {
    const result = await apiFetch<ResetPasswordData>("Account/resetPasswordByEmail", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, authenticationCode }),
    });

    return result;
  } catch {
    return {
      message: "Failed to reset password",
      data: { username: null, isSuccess: false },
    };
  }
}
