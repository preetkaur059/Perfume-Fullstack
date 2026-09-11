import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "@/hooks/auth/useAuth";

const AdminProtectedRoute = () => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (user.isAdmin !== true) {
    return <Navigate to="/" replace />;
  }

  // Admin
  return <Outlet />;
};

export default AdminProtectedRoute;
