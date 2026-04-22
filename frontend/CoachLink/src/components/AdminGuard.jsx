import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * AdminGuard — wraps admin routes.
 * If role !== 'admin', redirect to the login page.
 */
const AdminGuard = ({ children }) => {
  const role = useSelector((s) => s.auth.role);

  if (role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminGuard;
