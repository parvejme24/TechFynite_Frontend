"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/hooks/useAuth';

interface AuthStatusProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthStatus: React.FC<AuthStatusProps> = ({ children, fallback = null }) => {
  const { data: session, status } = useSession();
  const { isAuthenticated, user } = useAuth();

  // Show loading state while session is being determined
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // Show fallback if not authenticated
  if (!isAuthenticated || !session) {
    return <>{fallback}</>;
  }

  // Show children if authenticated
  return <>{children}</>;
};

export default AuthStatus;

