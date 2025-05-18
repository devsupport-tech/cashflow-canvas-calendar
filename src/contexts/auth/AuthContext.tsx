
import React, { createContext, useMemo } from 'react';
import { User, AuthContextType } from './types';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get auth state from hook
  const { user, setUser, isLoading, setIsLoading } = useAuthState();
  
  // Get auth actions from hook
  const { login, signup, logout, resetPassword, updateProfile } = useAuthActions(user, setIsLoading);

  // Wrap updateProfile to update local state
  const handleUpdateProfile = async (data: Partial<User>) => {
    try {
      await updateProfile(data);
      // Update local state
      setUser(current => current ? { ...current, ...data } : null);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile: handleUpdateProfile,
  }), [user, isLoading, login, signup, logout, resetPassword, handleUpdateProfile]);

  console.log("Auth context state:", { 
    isAuthenticated: !!user, 
    isLoading, 
    user: user ? `${user.email} (${user.id})` : 'none' 
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
