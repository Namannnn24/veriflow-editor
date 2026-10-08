import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-brand-200 opacity-75"></div>
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-3xl font-bold text-white shadow-lg">
            V
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
