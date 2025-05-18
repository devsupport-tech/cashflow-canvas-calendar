
import React, { memo } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/auth";
import { Navigate, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Get the redirect path from location state or default to root
  const from = (location.state as any)?.from || "/";
  
  console.log("Login component - isAuthenticated:", isAuthenticated, "redirectTo:", from);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  // If authenticated, redirect to the intended page or dashboard
  if (isAuthenticated) {
    console.log("Redirecting authenticated user to:", from);
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">FlowFinance</h1>
          <p className="text-muted-foreground">
            Simplify your financial management
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(Login);
