import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return (
      <div className="max-w-md mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-red-800 font-semibold">Access Denied</h2>
        <p className="text-red-600">
          This page is only accessible to {role}s.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;