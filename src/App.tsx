
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ColorThemeProvider } from "./contexts/ColorThemeContext";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import { AuthProvider } from "./contexts/auth";
import { ErrorBoundary } from "./components/ErrorBoundary";
import AppRoutes from "./routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
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
  </ErrorBoundary>
);

export default App;
