import { useState } from "react";
import { User } from "@/types/user";
import useApiBaseUrl from "./useApiBaseUrl";

const API_BASE_URL = useApiBaseUrl();

// Helper function to construct full image URL
const constructImageUrl = (photoUrl: string | null | undefined): string | null => {
  if (!photoUrl) return null;
  
  // If already a full URL, return as is
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  
  // If relative path, construct full URL
  const baseUrl = API_BASE_URL.replace('/api/v1', '');
  return `${baseUrl}${photoUrl}`;
};

interface RegisterData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface VerifyOtpData {
  email: string;
  otp: string;
}

interface ResetPasswordRequestData {
  email: string;
}

interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

interface UseAuthReturn {
  // Register new user
  register: (data: RegisterData) => Promise<AuthResponse | null>;
  // Login user
  login: (data: LoginData) => Promise<AuthResponse | null>;
  // Verify OTP
  verifyOtp: (data: VerifyOtpData) => Promise<AuthResponse | null>;
  // Refresh access token
  refreshToken: () => Promise<AuthResponse | null>;
  // Request password reset
  resetPasswordRequest: (
    data: ResetPasswordRequestData
  ) => Promise<{ message: string } | null>;
  // Reset password with OTP
  resetPassword: (
    data: ResetPasswordData
  ) => Promise<{ message: string } | null>;
  // Logout user
  logout: () => Promise<{ message: string } | null>;
  // Get current user
  getCurrentUser: () => Promise<User | null>;
  // Loading states
  loading: boolean;
  // Error state
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Register new user
  const register = async (data: RegisterData): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (data: LoginData): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      // Construct full image URL if user data exists
      if (result.user) {
        result.user.photoUrl = constructImageUrl(result.user.photoUrl);
      }

      // Store tokens in localStorage
      if (result.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
      }
      if (result.refreshToken) {
        localStorage.setItem("refreshToken", result.refreshToken);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async (
    data: VerifyOtpData
  ): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      // Construct full image URL if user data exists
      if (result.user) {
        result.user.photoUrl = constructImageUrl(result.user.photoUrl);
      }

      // Store tokens in localStorage
      if (result.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
      }
      if (result.refreshToken) {
        localStorage.setItem("refreshToken", result.refreshToken);
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "OTP verification failed";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Refresh access token
  const refreshToken = async (): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const refreshTokenValue = localStorage.getItem("refreshToken");
      if (!refreshTokenValue) {
        throw new Error("No refresh token found");
      }

      const response = await fetch(`${API_BASE_URL}/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      // Construct full image URL if user data exists
      if (result.user) {
        result.user.photoUrl = constructImageUrl(result.user.photoUrl);
      }

      // Update tokens in localStorage
      if (result.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
      }
      if (result.refreshToken) {
        localStorage.setItem("refreshToken", result.refreshToken);
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Token refresh failed";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const resetPasswordRequest = async (
    data: ResetPasswordRequestData
  ): Promise<{ message: string } | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/reset-password-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Password reset request failed";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Reset password with OTP
  const resetPassword = async (
    data: ResetPasswordData
  ): Promise<{ message: string } | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Password reset failed";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async (): Promise<{ message: string } | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Clear tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get current user
  const getCurrentUser = async (): Promise<User | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      
      // Construct full image URL if user data exists
      if (result.user) {
        result.user.photoUrl = constructImageUrl(result.user.photoUrl);
      }
      
      return result.user || result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get current user";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    login,
    verifyOtp,
    refreshToken,
    resetPasswordRequest,
    resetPassword,
    logout,
    getCurrentUser,
    loading,
    error,
  };
};
