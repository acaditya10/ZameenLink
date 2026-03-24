import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

const PREDICTION_COUNT_KEY = 'zameenlink_anon_predictions';
const MAX_ANONYMOUS_PREDICTIONS = 10;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      // Reset prediction counter when user logs in
      if (firebaseUser) {
        localStorage.removeItem(PREDICTION_COUNT_KEY);
        setShowAuthPrompt(false);
      }
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google sign-in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const incrementPredictionCount = () => {
    if (user) return true; // Logged in users get unlimited

    const count = parseInt(localStorage.getItem(PREDICTION_COUNT_KEY) || '0', 10);
    const newCount = count + 1;
    localStorage.setItem(PREDICTION_COUNT_KEY, String(newCount));

    if (newCount === MAX_ANONYMOUS_PREDICTIONS) {
      setShowAuthPrompt(true);
      return false; // Signal to show prompt
    }
    return true;
  };

  const dismissAuthPrompt = () => {
    setShowAuthPrompt(false);
  };

  const getPredictionCount = () => {
    return parseInt(localStorage.getItem(PREDICTION_COUNT_KEY) || '0', 10);
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    showAuthPrompt,
    dismissAuthPrompt,
    incrementPredictionCount,
    getPredictionCount,
    maxPredictions: MAX_ANONYMOUS_PREDICTIONS,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
