import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useCurrentUser } from "@/hooks/auth/useAuth";
import Loading from "../Loading";

const ProtectedRoute = ({ children }) => {
  const { data: user, isLoading } = useCurrentUser();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
