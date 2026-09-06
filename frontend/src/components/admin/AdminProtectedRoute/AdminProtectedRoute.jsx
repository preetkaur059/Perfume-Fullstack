import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../../../api/client"; 

const AdminProtectedRoute = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const { data } = await api.get("/users/me");

        
        setUser(data.user);
        console.log("CURRENT USER:", data.user);
        console.log("IS ADMIN:", data.user.isAdmin);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  

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