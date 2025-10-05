"use client";
import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useAuth as useAuthHook, useCurrentUser, User } from "@/hooks/useAuth";
import { UserRole } from "@/types/user";

// Request/Response interfaces for backward compatibility
export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  designation?: string;
  phone?: string;
  country?: string;
  city?: string;
  stateOrRegion?: string;
  postCode?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Auth context type
type AuthContextType = {
  // User state
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  session: any;
  
  // Legacy methods for existing forms
  signInUser: (email: string, password: string) => Promise<any>;
  createUser: (email: string, password: string, displayName: string) => Promise<any>;
  logOut: () => Promise<any>;
  
  // New comprehensive auth methods
  register: (data: RegisterRequest) => Promise<LoginResponse | null>;
  login: (data: LoginRequest) => Promise<LoginResponse | null>;
  googleLogin: () => Promise<LoginResponse | null>;
  logout: () => Promise<void>;
  
  // Email verification
  verifyEmail: (data: VerifyEmailRequest) => Promise<{ message: string } | null>;
  resendVerificationEmail: (data: ResendVerificationRequest) => Promise<{ message: string } | null>;
  
  // Password management
  forgotPassword: (data: ForgotPasswordRequest) => Promise<{ message: string } | null>;
  resetPassword: (data: ResetPasswordRequest) => Promise<{ message: string } | null>;
  changePassword: (data: ChangePasswordRequest) => Promise<{ message: string } | null>;
  
  // Profile management
  getProfile: () => Promise<User | null>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<User | null>;
  uploadProfilePhoto: (file: File) => Promise<{ photoUrl: string } | null>;
  
  // Admin functions
  getAllUsers: (params?: { page?: number; limit?: number; search?: string }) => Promise<{ users: User[]; total: number } | null>;
  updateUserRole: (userId: string, role: UserRole) => Promise<{ message: string } | null>;
  updateUserStatus: (userId: string, isActive: boolean) => Promise<{ message: string } | null>;
  deleteUser: (userId: string) => Promise<{ message: string } | null>;
  
  // Utility functions
  clearError: () => void;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, isAuthenticated, session } = useAuthHook();
  const { data: currentUserData, error: currentUserError } = useCurrentUser();

  // Get the actual user data from either session or current user query
  const actualUser = user || currentUserData?.data?.user || null;
  const loading = isLoading || (isAuthenticated && !actualUser);
  const error = currentUserError?.message || null;

  // Store session secret when user is authenticated
  useEffect(() => {
    if (session?.user?.nextAuthSecret) {
      localStorage.setItem('nextAuthSecret', session.user.nextAuthSecret);
    }
  }, [session]);

  // Clear error function
  const clearError = () => {};

  // Check if user is admin
  const isAdmin = () => actualUser?.role === 'ADMIN' || actualUser?.role === 'SUPER_ADMIN';
  const isSuperAdmin = () => actualUser?.role === 'SUPER_ADMIN';

  // Legacy methods for existing forms (mock implementations)
  const signInUser = async (email: string, password: string) => {
    // This will be handled by NextAuth credentials provider
    console.log("Legacy signInUser called - use NextAuth signIn instead");
    return { user: actualUser };
  };

  const createUser = async (email: string, password: string, displayName: string) => {
    // This will be handled by NextAuth credentials provider
    console.log("Legacy createUser called - use NextAuth signIn instead");
    return { user: actualUser };
  };

  const logOut = async () => {
    // This will be handled by NextAuth signOut
    console.log("Legacy logOut called - use NextAuth signOut instead");
  };

  // New comprehensive auth methods (mock implementations for now)
  const register = async (data: RegisterRequest): Promise<LoginResponse | null> => {
    console.log("Register called - integrate with your backend API");
    return null;
  };

  const login = async (data: LoginRequest): Promise<LoginResponse | null> => {
    console.log("Login called - integrate with your backend API");
    return null;
  };

  const googleLogin = async (): Promise<LoginResponse | null> => {
    console.log("Google login called - integrate with your backend API");
    return null;
  };

  const logout = async (): Promise<void> => {
    console.log("Logout called - integrate with your backend API");
  };

  // Email verification (mock implementations)
  const verifyEmail = async (data: VerifyEmailRequest): Promise<{ message: string } | null> => {
    console.log("Verify email called - integrate with your backend API");
    return { message: "Email verified successfully" };
  };

  const resendVerificationEmail = async (data: ResendVerificationRequest): Promise<{ message: string } | null> => {
    console.log("Resend verification email called - integrate with your backend API");
    return { message: "Verification email sent successfully" };
  };

  // Password management (mock implementations)
  const forgotPassword = async (data: ForgotPasswordRequest): Promise<{ message: string } | null> => {
    console.log("Forgot password called - integrate with your backend API");
    return { message: "Password reset email sent successfully" };
  };

  const resetPassword = async (data: ResetPasswordRequest): Promise<{ message: string } | null> => {
    console.log("Reset password called - integrate with your backend API");
    return { message: "Password reset successfully" };
  };

  const changePassword = async (data: ChangePasswordRequest): Promise<{ message: string } | null> => {
    console.log("Change password called - integrate with your backend API");
    return { message: "Password changed successfully" };
  };

  // Profile management (mock implementations)
  const getProfile = async (): Promise<User | null> => {
    return actualUser;
  };

  const refreshProfile = async () => {
    console.log("Refresh profile called - integrate with your backend API");
  };

  const updateProfile = async (data: UpdateProfileRequest): Promise<User | null> => {
    console.log("Update profile called - integrate with your backend API");
    return actualUser;
  };

  const uploadProfilePhoto = async (file: File): Promise<{ photoUrl: string } | null> => {
    console.log("Upload profile photo called - integrate with your backend API");
    return { photoUrl: "https://via.placeholder.com/150" };
  };

  // Admin functions (mock implementations)
  const getAllUsers = async (params?: { page?: number; limit?: number; search?: string }): Promise<{ users: User[]; total: number } | null> => {
    console.log("Get all users called - integrate with your backend API");
    return { users: [], total: 0 };
  };

  const updateUserRole = async (userId: string, role: UserRole): Promise<{ message: string } | null> => {
    console.log("Update user role called - integrate with your backend API");
    return { message: "User role updated successfully" };
  };

  const updateUserStatus = async (userId: string, isActive: boolean): Promise<{ message: string } | null> => {
    console.log("Update user status called - integrate with your backend API");
    return { message: "User status updated successfully" };
  };

  const deleteUser = async (userId: string): Promise<{ message: string } | null> => {
    console.log("Delete user called - integrate with your backend API");
    return { message: "User deleted successfully" };
  };

  const authInfo: AuthContextType = {
    user: actualUser,
    loading,
    error,
    isAuthenticated,
    session,
    // Legacy methods for existing forms
    signInUser,
    createUser,
    logOut,
    // New comprehensive methods
    register,
    login,
    googleLogin,
    logout,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    getProfile,
    refreshProfile,
    updateProfile,
    uploadProfilePhoto,
    getAllUsers,
    updateUserRole,
    updateUserStatus,
    deleteUser,
    clearError,
    isAdmin,
    isSuperAdmin,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;