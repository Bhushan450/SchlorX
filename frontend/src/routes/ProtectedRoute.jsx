import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TableSkeleton } from '../components/common/TableSkeleton';

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-4 text-center">
          <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading academic session...</p>
          <TableSkeleton rows={3} columns={2} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
