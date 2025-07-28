"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@/types/user";
import { useAuth } from "@/hooks/useAuth";

interface UserDataContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};

interface UserDataProviderProps {
  children: React.ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getCurrentUser } = useAuth();

        const fetchUser = async () => {
        setLoading(true);
        setError(null);
        try {
          const userData = await getCurrentUser();
          if (userData) {
            setUser(userData);
          } else {
            setError("Failed to fetch user data");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to fetch user data");
        } finally {
          setLoading(false);
        }
      };

  const refreshUser = async () => {
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    loading,
    error,
    refreshUser,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}; 