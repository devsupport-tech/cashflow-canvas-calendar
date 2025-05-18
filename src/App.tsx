
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { ColorThemeProvider } from "./contexts/ColorThemeContext";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import { AuthProvider } from "./contexts/auth";
import { AuthGuard } from "./components/auth/AuthGuard";
import AppRoutes from "./routes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ColorThemeProvider>
        <AuthProvider>
          <WorkspaceProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </TooltipProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </ColorThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
