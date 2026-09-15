import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RoleRoute({ allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== allowedRole) {
    // Redirect user to their appropriate role home
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
