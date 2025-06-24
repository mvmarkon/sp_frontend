import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, getCurrentUser } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !isAuthenticated && !isLoading) {
      getCurrentUser().catch((err) => {
        // Handle error during initial user fetch, e.g., token expired
        console.error("Failed to fetch user on route load:", err);
        toast.error("Your session has expired. Please log in again.");
      });
    }
  }, [isAuthenticated, isLoading, getCurrentUser]);

  if (isLoading) {
    // Optionally render a loading spinner or component
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
