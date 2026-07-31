import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router';
import type { UserRole } from '../../types/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRole
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]" aria-label="Loading authentication status">
        <div className="w-8 h-8 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-white border border-red-200 rounded-2xl shadow-sm my-12">
        <h3 className="text-xl font-semibold text-red-700 mb-2">403 Forbidden</h3>
        <p className="text-zinc-600">You do not have administrative privileges to access this section.</p>
      </div>
    );
  }

  return <>{children}</>;
};
