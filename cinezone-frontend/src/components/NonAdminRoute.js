import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NonAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

export default NonAdminRoute;
