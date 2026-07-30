import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRole,
  fallback
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]" aria-label="Loading authentication status">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md">
        <h3 className="text-xl font-semibold text-white mb-2">Authentication Required</h3>
        <p className="text-slate-400 mb-4">Please log in to your account to view this page.</p>
      </div>
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="p-8 text-center bg-red-950/40 border border-red-800/60 rounded-xl backdrop-blur-md">
        <h3 className="text-xl font-semibold text-red-400 mb-2">403 Forbidden</h3>
        <p className="text-slate-300">You do not have administrative privileges to access this section.</p>
      </div>
    );
  }

  return <>{children}</>;
};
