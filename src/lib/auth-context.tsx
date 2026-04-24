'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, updateProfile, type User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuthStore } from '@/lib/store';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setUser: setStoreUser, setLoading: setStoreLoading } = useAuthStore();

  useEffect(() => {
    // Safety check: Don't subscribe if Firebase Auth isn't initialized (build phase)
    if (!auth || !auth.app) {
      setLoading(false);
      setStoreLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      setStoreUser(firebaseUser ? {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'User',
        photoURL: firebaseUser.photoURL,
      } : null);
      setStoreLoading(false);
    });
    return () => unsubscribe();
  }, [setStoreUser, setStoreLoading]);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(message);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign in';
      if (message.includes('invalid-credential') || message.includes('wrong-password')) {
        setError('Invalid email or password.');
      } else if (message.includes('user-not-found')) {
        setError('No account found with this email.');
      } else {
        setError(message);
      }
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create account';
      if (message.includes('email-already-in-use')) {
        setError('An account with this email already exists.');
      } else if (message.includes('weak-password')) {
        setError('Password should be at least 6 characters.');
      } else {
        setError(message);
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign out';
      setError(message);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
