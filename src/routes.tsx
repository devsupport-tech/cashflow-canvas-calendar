
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Transactions from "./pages/Transactions";
import Calendar from "./pages/Calendar";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Accounts from "./pages/Accounts";
import Budgets from "./pages/Budgets";
import Expenses from "./pages/Expenses";
import LayoutMockups from "./pages/LayoutMockups";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProtectedRoutes, PublicOnlyRoute } from "./routes/ProtectedRoutes";

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
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
      </AnimatePresence>
    </ErrorBoundary>
  );
};

export default AppRoutes;
