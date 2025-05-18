
import { useCallback } from 'react';
import { authService } from './authService';
import { User } from './types';

export function useAuthActions(
  user: User | null, 
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  // Login action
  const login = useCallback(async (email: string, password: string) => {
    console.log("Login attempt for:", email);
    try {
      await authService.login(email, password);
      // The auth state listener will handle setting the user and redirecting
      return Promise.resolve();
    } catch (error: any) {
      console.error("Login error:", error);
      setIsLoading(false);
      return Promise.reject(error);
    }
  }, [setIsLoading]);

  // Signup action
  const signup = useCallback(async (email: string, password: string, name?: string) => {
    console.log("Signup attempt for:", email);
    try {
      await authService.signup(email, password, name);
      setIsLoading(false);
      return Promise.resolve();
    } catch (error: any) {
      console.error("Signup error:", error);
      setIsLoading(false);
      return Promise.reject(error);
    }
  }, [setIsLoading]);

  // Logout action
  const logout = useCallback(async () => {
    console.log("Logout attempt");
    try {
      await authService.logout();
      // Auth state change listener will handle the rest
      return Promise.resolve();
    } catch (error: any) {
      console.error("Logout error:", error);
      return Promise.reject(error);
    }
  }, []);

  // Reset password action
  const resetPassword = useCallback(async (email: string) => {
    return authService.resetPassword(email);
  }, []);

  // Profile update action
  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      if (!user?.id) throw new Error("Not authenticated");
      await authService.updateProfile(user.id, data);
      // Update will be handled by the parent component
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }, [user]);

  return {
    login,
    signup,
    logout,
    resetPassword,
    updateProfile
  };
}
