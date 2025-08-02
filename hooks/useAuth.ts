'use client';

import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { AuthService } from '@/services/firebase/authService';
import { User } from '@/types/firebase';

interface AuthState {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userProfile: null,
    loading: false, // Commencer avec false pour éviter le spinner infini
    error: null
  });

  useEffect(() => {
    // On commence par vérifier l'utilisateur actuel
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setAuthState(prev => ({ ...prev, user: currentUser, loading: false }));
    }

    // Puis on écoute les changements
    const unsubscribe = AuthService.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Utilisateur connecté
          setAuthState(prev => ({ ...prev, loading: true }));
          
          try {
            const userProfile = await AuthService.getUserDocument(firebaseUser.uid);
            setAuthState({
              user: firebaseUser,
              userProfile,
              loading: false,
              error: null
            });
          } catch (profileError) {
            console.warn('Could not load user profile:', profileError);
            // Continuer sans le profil
            setAuthState({
              user: firebaseUser,
              userProfile: null,
              loading: false,
              error: null
            });
          }
        } else {
          // Utilisateur déconnecté
          setAuthState({
            user: null,
            userProfile: null,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Authentifizierungsfehler'
        }));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      await AuthService.signIn(email, password);
      // State will be updated by onAuthStateChanged
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Anmeldung fehlgeschlagen' 
      }));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      await AuthService.signInWithGoogle();
      // State will be updated by onAuthStateChanged
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Google-Anmeldung fehlgeschlagen' 
      }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, vorname: string, nachname: string) => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      await AuthService.signUp(email, password, vorname, nachname);
      // State will be updated by onAuthStateChanged
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Registrierung fehlgeschlagen' 
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      await AuthService.signOut();
      // State will be updated by onAuthStateChanged
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Abmeldung fehlgeschlagen' 
      }));
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      await AuthService.resetPassword(email);
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Passwort-Reset fehlgeschlagen' 
      }));
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Omit<User, 'id' | 'createdAt' | 'email'>>) => {
    try {
      if (!authState.user) throw new Error('Kein Benutzer angemeldet');
      
      setAuthState(prev => ({ ...prev, error: null }));
      await AuthService.updateUserProfile(authState.user.uid, updates);
      
      // Refresh user profile
      const updatedProfile = await AuthService.getUserDocument(authState.user.uid);
      setAuthState(prev => ({ ...prev, userProfile: updatedProfile }));
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Profil-Update fehlgeschlagen' 
      }));
      throw error;
    }
  };

  return {
    user: authState.user,
    userProfile: authState.userProfile,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated: !!authState.user,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    updateProfile
  };
} 