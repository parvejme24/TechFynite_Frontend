import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession, signIn, signOut } from 'next-auth/react';
import apiClient from '@/lib/api-client';

// Types
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'USER';
  isBanned: boolean;
  isTrashed: boolean;
  isDeletedPermanently: boolean;
  isLoggedIn: boolean;
  lastLoginAt: string;
  provider: string;
  providerId?: string;
  createdAt: string;
  updatedAt: string;
  // NextAuth fields
  name?: string;
  image?: string;
  // Legacy fields for backward compatibility
  displayName?: string;
  photoUrl?: string;
  photoURL?: string;
  profile?: {
    id: string;
    userId: string;
    avatarUrl?: string;
    coverImageUrl?: string;
    designation?: string;
    phone?: string;
    country?: string;
    city?: string;
    stateOrRegion?: string;
    postCode?: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  avatarUrl?: string;
  coverImageUrl?: string;
  designation?: string;
  phone?: string;
  country?: string;
  city?: string;
  stateOrRegion?: string;
  postCode?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    nextAuthSecret?: string;
    expiresAt?: string;
  };
  error?: string;
}

// API functions
const authApi = {
  // Register user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  // Validate session
  validateSession: async (nextAuthSecret: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/validate-session', { nextAuthSecret });
    return response.data;
  },

  // Logout user
  logout: async (nextAuthSecret: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/logout', { nextAuthSecret });
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/change-password', data);
    return response.data;
  },

  // Update profile
  updateProfile: async (data: UpdateProfileRequest): Promise<AuthResponse> => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },
};

// React Query hooks
export const useAuth = () => {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  // Console log session data when it changes
  React.useEffect(() => {
    console.log("🔐 useAuth - Session Status:", status);
    console.log("🔐 useAuth - Session Data:", session);
    if (session?.user) {
      console.log("🔐 useAuth - User from Session:", session.user);
    }
  }, [session, status]);

  return {
    user: session?.user as User | undefined,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
    session,
  };
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authApi.getCurrentUser(),
    enabled: false, // We'll manually trigger this
    retry: false,
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (data.success && data.data?.nextAuthSecret) {
        // Store the session secret
        localStorage.setItem('nextAuthSecret', data.data.nextAuthSecret);
        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      }
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.success && data.data?.nextAuthSecret) {
        // Store the session secret
        localStorage.setItem('nextAuthSecret', data.data.nextAuthSecret);
        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nextAuthSecret: string) => authApi.logout(nextAuthSecret),
    onSuccess: () => {
      // Clear stored session
      localStorage.removeItem('nextAuthSecret');
      // Clear all queries
      queryClient.clear();
      // Sign out from NextAuth
      signOut();
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

// Google OAuth functions
export const useGoogleSignIn = () => {
  return () => {
    signIn('google', { callbackUrl: '/' });
  };
};

export const useCredentialsSignIn = () => {
  return (credentials: LoginRequest) => {
    return signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });
  };
};

