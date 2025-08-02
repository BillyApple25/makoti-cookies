'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function LoginPage() {
  const { signInWithGoogle, user, loading, error } = useAuthContext();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
      // La redirection se fera via useEffect
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Header />
      
      <main className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="w-full max-w-md">
          {/* Card de connexion */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-amber-100">
            {/* Logo/Titre */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍪</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Willkommen bei Makoti Cookies
              </h1>
              <p className="text-gray-600">
                Melden Sie sich an, um auf Ihr Konto zuzugreifen
              </p>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Bouton Google Sign-In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningIn ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Anmeldung läuft...</span>
                </>
              ) : (
                <>
                  {/* Google Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Mit Google anmelden</span>
                </>
              )}
            </button>

            {/* Avantages de la connexion */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
                Mit Ihrem Konto genießen Sie:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3"></span>
                  Schnelle Bestellungen und Verlauf
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3"></span>
                  Personalisierte Angebote
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3"></span>
                  Bewertungen und Empfehlungen
                </li>
              </ul>
            </div>
          </div>

          {/* Note de sécurité */}
          <p className="text-center text-xs text-gray-500 mt-6">
            🔒 Sichere Anmeldung über Google
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 