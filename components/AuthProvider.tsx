'use client';

import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/types/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, vorname: string, nachname: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<Omit<User, 'id' | 'createdAt' | 'email'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  const contextValue: AuthContextType = {
    user: auth.user,
    userProfile: auth.userProfile,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    signIn: auth.signIn,
    signInWithGoogle: auth.signInWithGoogle,
    signUp: auth.signUp,
    signOut: auth.signOut,
    resetPassword: auth.resetPassword,
    updateProfile: auth.updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
} 