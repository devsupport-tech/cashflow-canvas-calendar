/**
 * Centralized Error Handling System
 * Provides consistent error handling, logging, and user feedback across the application
 */

import { toast } from '@/components/ui/use-toast';

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  context?: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle and log errors with user-friendly messages
   */
  handleError(error: any, context?: string, showToast = true): AppError {
    const appError: AppError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: this.getUserFriendlyMessage(error),
      details: error,
      timestamp: new Date(),
      context
    };

    // Log error for debugging
    this.logError(appError);

    // Show user-friendly toast notification
    if (showToast) {
      this.showErrorToast(appError);
    }

    return appError;
  }

  /**
   * Handle success operations with optional toast
   */
  handleSuccess(message: string, description?: string, showToast = true) {
    if (showToast) {
      toast({
        title: "Success",
        description: description || message,
        variant: "default",
        duration: 3000,
      });
    }
  }

  /**
   * Handle network/connection errors
   */
  handleNetworkError(error: any, context?: string): AppError {
    const isOffline = !navigator.onLine;
    const message = isOffline 
      ? "You're offline. Changes will be saved when connection is restored."
      : "Connection error. Please check your internet connection.";

    const appError: AppError = {
      code: 'NETWORK_ERROR',
      message,
      details: error,
      timestamp: new Date(),
      context
    };

    this.logError(appError);
    
    toast({
      title: isOffline ? "Offline Mode" : "Connection Error",
      description: message,
      variant: isOffline ? "default" : "destructive",
      duration: 5000,
    });

    return appError;
  }

  /**
   * Handle authentication errors
   */
  handleAuthError(error: any, context?: string): AppError {
    const appError: AppError = {
      code: 'AUTH_ERROR',
      message: this.getAuthErrorMessage(error),
      details: error,
      timestamp: new Date(),
      context
    };

    this.logError(appError);
    
    toast({
      title: "Authentication Error",
      description: appError.message,
      variant: "destructive",
      duration: 5000,
    });

    return appError;
  }

  /**
   * Handle validation errors
   */
  handleValidationError(errors: Record<string, string>, context?: string): AppError {
    const errorMessages = Object.values(errors).join(', ');
    
    const appError: AppError = {
      code: 'VALIDATION_ERROR',
      message: `Please fix the following errors: ${errorMessages}`,
      details: errors,
      timestamp: new Date(),
      context
    };

    this.logError(appError);
    
    toast({
      title: "Validation Error",
      description: appError.message,
      variant: "destructive",
      duration: 5000,
    });

    return appError;
  }

  /**
   * Get user-friendly error messages
   */
  private getUserFriendlyMessage(error: any): string {
    if (typeof error === 'string') return error;
    
    if (error.message) {
      // Map common error messages to user-friendly ones
      const message = error.message.toLowerCase();
      
      if (message.includes('network') || message.includes('fetch')) {
        return "Network connection error. Please check your internet connection.";
      }
      
      if (message.includes('unauthorized') || message.includes('403')) {
        return "You don't have permission to perform this action.";
      }
      
      if (message.includes('not found') || message.includes('404')) {
        return "The requested resource was not found.";
      }
      
      if (message.includes('timeout')) {
        return "The request timed out. Please try again.";
      }
      
      if (message.includes('validation') || message.includes('invalid')) {
        return "Please check your input and try again.";
      }
      
      return error.message;
    }
    
    return "An unexpected error occurred. Please try again.";
  }

  /**
   * Get authentication-specific error messages
   */
  private getAuthErrorMessage(error: any): string {
    if (typeof error === 'string') return error;
    
    if (error.message) {
      const message = error.message.toLowerCase();
      
      if (message.includes('invalid login credentials')) {
        return "Invalid email or password. Please try again.";
      }
      
      if (message.includes('email not confirmed')) {
        return "Please check your email and confirm your account before logging in.";
      }
      
      if (message.includes('user not found')) {
        return "No account found with this email address.";
      }
      
      if (message.includes('password')) {
        return "Password is required and must meet security requirements.";
      }
      
      if (message.includes('email')) {
        return "Please enter a valid email address.";
      }
      
      return error.message;
    }
    
    return "Authentication failed. Please try again.";
  }

  /**
   * Log errors for debugging
   */
  private logError(error: AppError) {
    // Add to in-memory log
    this.errorLog.push(error);
    
    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }
    
    // Console log for development
    console.error(`[${error.code}] ${error.context || 'Unknown'}:`, error.message, error.details);
    
    // In production, you might want to send to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error tracking service
      // this.sendToErrorService(error);
    }
  }

  /**
   * Show error toast notification
   */
  private showErrorToast(error: AppError) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
      duration: 5000,
    });
  }

  /**
   * Get recent errors for debugging
   */
  getRecentErrors(limit = 10): AppError[] {
    return this.errorLog.slice(-limit);
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * Retry mechanism for failed operations
   */
  async retry<T>(
    operation: () => Promise<T>,
    maxAttempts = 3,
    delay = 1000,
    context?: string
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxAttempts) {
          this.handleError(error, `${context} (failed after ${maxAttempts} attempts)`);
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError;
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Utility functions for common error handling patterns
export const handleAsyncError = async <T>(
  operation: () => Promise<T>,
  context?: string,
  showToast = true
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    errorHandler.handleError(error, context, showToast);
    return null;
  }
};

export const handleAsyncErrorWithRetry = async <T>(
  operation: () => Promise<T>,
  context?: string,
  maxAttempts = 3
): Promise<T | null> => {
  try {
    return await errorHandler.retry(operation, maxAttempts, 1000, context);
  } catch (error) {
    return null;
  }
};
