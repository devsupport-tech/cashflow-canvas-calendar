
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Log authentication status for debugging
  useEffect(() => {
    console.log("AuthGuard - isAuthenticated:", isAuthenticated, "isLoading:", isLoading, "path:", location.pathname);
  }, [isAuthenticated, isLoading, location]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  // Pass the current location in state to enable redirect back after login
  if (!isAuthenticated) {
    console.log("AuthGuard - Redirecting to login, not authenticated");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // User is authenticated, render the protected content
  console.log("AuthGuard - Rendering protected content");
  return <>{children}</>;
};
