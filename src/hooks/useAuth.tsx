"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// API Endpoints
const API_BASE_URL = "https://flowchatbackend.azurewebsites.net/api";

// Response Types
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

// User Type
interface User {
  id: number;
  name: string;
  email: string;
  roles: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    usernameOrEmail: string,
    password: string
  ) => Promise<ApiResponse<LoginData>>;
  register: (
    username: string,
    email: string,
    password: string,
    licenseKey: string
  ) => Promise<ApiResponse<RegisterData>>;
  logout: () => void;
  requestLicenseKey: (email: string) => Promise<ApiResponse<RequestData>>;
  requestAuthCode: (email: string) => Promise<ApiResponse<RequestData>>;
  checkEmailUnique: (email: string) => Promise<ApiResponse<EmailCheckData>>;
  checkUsernameUnique: (
    username: string
  ) => Promise<ApiResponse<UsernameCheckData>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Helper function for API calls to reduce repetition
  async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
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

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (
    usernameOrEmail: string,
    password: string
  ): Promise<ApiResponse<LoginData>> => {
    try {
      const result = await apiFetch<LoginData>("Account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      // Successful login
      if (
        result.data.isPasswordCorrect &&
        result.data.isAccountActive &&
        result.data.user
      ) {
        const userData: User = {
          id: result.data.user.id,
          name: result.data.user.username,
          email: usernameOrEmail.includes("@") ? usernameOrEmail : "",
          roles: result.data.user.roles,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }

      return result;
    } catch (error) {
      return {
        message: "Login failed",
        data: {
          isPasswordCorrect: false,
          isAccountActive: false,
          user: null,
        },
      };
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    licenseKey: string
  ): Promise<ApiResponse<RegisterData>> => {
    try {
      const result = await apiFetch<RegisterData>("Account/registerAccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, licenseKey }),
      });

      return result;
    } catch (error) {
      return {
        message: "An error occurred during registration",
        data: {
          user: null,
          isSuccess: false,
        },
      };
    }
  };

  const requestLicenseKey = async (
    email: string
  ): Promise<ApiResponse<RequestData>> => {
    try {
      const result = await apiFetch<RequestData>("Account/requestLicenseKey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      return result;
    } catch (error) {
      return {
        message: "Failed to request license key",
        data: { isSuccess: false },
      };
    }
  };

  const requestAuthCode = async (
    email: string
  ): Promise<ApiResponse<RequestData>> => {
    try {
      const result = await apiFetch<RequestData>(
        "Account/requestAuthenticationCode",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      return result;
    } catch (error) {
      return {
        message: "Failed to request authentication code",
        data: { isSuccess: false },
      };
    }
  };

  const checkEmailUnique = async (
    email: string
  ): Promise<ApiResponse<EmailCheckData>> => {
    try {
      return await apiFetch<EmailCheckData>(
        `Account/isEmailUnique?email=${encodeURIComponent(email)}`
      );
    } catch (error) {
      return {
        message: "Failed to check email uniqueness",
        data: { isEmailUnique: false },
      };
    }
  };

  const checkUsernameUnique = async (
    username: string
  ): Promise<ApiResponse<UsernameCheckData>> => {
    try {
      return await apiFetch<UsernameCheckData>(
        `Account/isUsernameUnique?username=${encodeURIComponent(username)}`
      );
    } catch (error) {
      return {
        message: "Failed to check username uniqueness",
        data: { isUsernameUnique: false },
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        requestLicenseKey,
        requestAuthCode,
        checkEmailUnique,
        checkUsernameUnique,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
