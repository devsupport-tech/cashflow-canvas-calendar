
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/layouts/MainLayout";

/**
 * ProtectedRoutes component wraps authenticated routes with:
 * - Authentication check via AuthGuard
 * - Main layout with sidebar, header, etc.
 */
export const ProtectedRoutes = () => {
  return (
    <AuthGuard>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </AuthGuard>
  );
};

/**
 * PublicOnlyRoute prevents authenticated users from accessing 
 * routes that are meant for non-authenticated users (like login)
 */
export const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const from = (location.state as any)?.from || "/";
  
  // Check if the user is already authenticated through local storage
  // This is a quick check before the full auth state is loaded
  const isAuthenticated = (() => {
    try {
      const stored = localStorage.getItem('cashflow_user');
      if (stored) return true;
      // Fallback for Supabase persisted session
      const supabaseToken = localStorage.getItem('supabase.auth.token');
      return supabaseToken !== null;
    } catch {
      return false;
    }
  })();
  
  if (isAuthenticated) {
    console.log("PublicOnlyRoute - User already authenticated, redirecting to:", from);
    return <Navigate to={from} replace />;
  }
  
  return <>{children}</>;
};
