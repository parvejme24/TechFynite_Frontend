import { useState } from "react";
import { UserProfile } from "@/types/user";
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

interface UpdateProfileData {
  displayName?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  designation?: string;
  stateOrRegion?: string;
  postCode?: string;
  photo?: File;
  removePhoto?: boolean;
}

interface UpdateRoleData {
  role: string;
}

interface UseUserApiReturn {
  // Get all users (ADMIN/SUPER_ADMIN only)
  getAllUsers: () => Promise<UserProfile[] | null>;
  // Get user by ID (ADMIN/SUPER_ADMIN only)
  getUserById: (userId: string) => Promise<UserProfile | null>;
  // Update user profile (with photo upload)
  updateUserProfile: (userId: string, data: UpdateProfileData) => Promise<UserProfile | null>;
  // Update user role (ADMIN/SUPER_ADMIN only)
  updateUserRole: (userId: string, data: UpdateRoleData) => Promise<UserProfile | null>;
  // Loading states
  loading: boolean;
  // Error state
  error: string | null;
}

export const useUserApi = (): UseUserApiReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all users (ADMIN/SUPER_ADMIN only)
  const getAllUsers = async (): Promise<UserProfile[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

                const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.users || result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get user by ID (ADMIN/SUPER_ADMIN only)
  const getUserById = async (userId: string): Promise<UserProfile | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.user || result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch user";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile (with photo upload)
  const updateUserProfile = async (userId: string, data: UpdateProfileData): Promise<UserProfile | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      // Create FormData for multipart/form-data
      const formData = new FormData();

      // Add text fields
      if (data.displayName) formData.append("displayName", data.displayName);
      if (data.email) formData.append("email", data.email);
      if (data.phone) formData.append("phone", data.phone);
      if (data.city) formData.append("city", data.city);
      if (data.country) formData.append("country", data.country);
      if (data.designation) formData.append("designation", data.designation);
      if (data.stateOrRegion) formData.append("stateOrRegion", data.stateOrRegion);
      if (data.postCode) formData.append("postCode", data.postCode);

      // Add photo file if provided
      if (data.photo) {
        formData.append("photo", data.photo);
      }

      // Add removePhoto flag if provided
      if (data.removePhoto) {
        formData.append("removePhoto", "true");
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type header - let the browser set it with boundary for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Construct full image URL if user data exists
      if (result.user) {
        result.user.photoUrl = constructImageUrl(result.user.photoUrl);
      } else if (result.photoUrl) {
        result.photoUrl = constructImageUrl(result.photoUrl);
      }
      
      return result.user || result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update user role (ADMIN/SUPER_ADMIN only)
  const updateUserRole = async (userId: string, data: UpdateRoleData): Promise<UserProfile | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.user || result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update user role";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getAllUsers,
    getUserById,
    updateUserProfile,
    updateUserRole,
    loading,
    error,
  };
}; 