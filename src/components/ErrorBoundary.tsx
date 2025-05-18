
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error("Error boundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="text-sm mb-4">
                  An unexpected error occurred in the application.
                </p>
                {this.state.error && (
                  <pre className="bg-destructive/10 p-2 rounded text-xs overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </pre>
                )}
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={this.handleReset}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    Try again
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    size="sm"
                    variant="destructive"
                  >
                    Reload page
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Create a hook to allow throwing errors from functional components
export function useErrorBoundary() {
  const [, setError] = React.useState<Error | null>(null);
  
  const throwError = React.useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);

  return { throwError };
}
