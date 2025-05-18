
import React, { useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/auth";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // If authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
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

export default Login;
