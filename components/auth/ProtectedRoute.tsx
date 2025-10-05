"use client";
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthGuard, useAdminGuard } from '@/hooks/useAuth';
import { UserRole } from '@/types/user';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
  redirectTo?: string;
  fallback?: ReactNode;
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  requireSuperAdmin = false,
  redirectTo = '/login',
  fallback = <div>Loading...</div>,
}: ProtectedRouteProps) => {
  const router = useRouter();
  
  // Use appropriate guard based on requirements
  const authGuard = useAuthGuard();
  const adminGuard = useAdminGuard();
  
  const { isAuthenticated, isLoading, user } = requireAdmin || requireSuperAdmin 
    ? adminGuard 
    : authGuard;

  useEffect(() => {
    if (!isLoading) {
      // Check authentication requirement
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Check admin requirement
      if (requireAdmin && !adminGuard.isAdmin) {
        router.push('/dashboard'); // Redirect to dashboard if not admin
        return;
      }

      // Check super admin requirement
      if (requireSuperAdmin && !adminGuard.isSuperAdmin) {
        router.push('/dashboard'); // Redirect to dashboard if not super admin
        return;
      }
    }
  }, [isLoading, isAuthenticated, requireAuth, requireAdmin, requireSuperAdmin, redirectTo, router, adminGuard.isAdmin, adminGuard.isSuperAdmin]);

  // Show fallback while loading
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Check if user meets all requirements
  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (requireAdmin && !adminGuard.isAdmin) {
    return null; // Will redirect in useEffect
  }

  if (requireSuperAdmin && !adminGuard.isSuperAdmin) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

// Convenience components for common use cases
export const AuthRequired = ({ children, ...props }: Omit<ProtectedRouteProps, 'requireAuth'>) => (
  <ProtectedRoute requireAuth={true} {...props}>
    {children}
  </ProtectedRoute>
);

export const AdminRequired = ({ children, ...props }: Omit<ProtectedRouteProps, 'requireAuth' | 'requireAdmin'>) => (
  <ProtectedRoute requireAuth={true} requireAdmin={true} {...props}>
    {children}
  </ProtectedRoute>
);

export const SuperAdminRequired = ({ children, ...props }: Omit<ProtectedRouteProps, 'requireAuth' | 'requireSuperAdmin'>) => (
  <ProtectedRoute requireAuth={true} requireSuperAdmin={true} {...props}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute; 