
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import React, { Suspense, lazy } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProtectedRoutes, PublicOnlyRoute } from "./routes/ProtectedRoutes";

// Route-based code splitting for faster initial load
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Documents = lazy(() => import("./pages/Documents"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Accounts = lazy(() => import("./pages/Accounts"));
const Budgets = lazy(() => import("./pages/Budgets"));
const Expenses = lazy(() => import("./pages/Expenses"));
const LayoutMockups = lazy(() => import("./pages/LayoutMockups"));

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
          <Routes location={location} key={location.pathname}>
            {/* Public routes - accessible when not logged in */}
            <Route 
              path="/login" 
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              } 
            />
            
            {/* Layout mockups route - can be accessed without auth for demo purposes */}
            <Route path="/mockups" element={<LayoutMockups />} />
            
            {/* Protected routes - require authentication */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </ErrorBoundary>
  );
};

export default AppRoutes;
