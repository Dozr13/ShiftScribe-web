'use client';

import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

// Create the AuthContext
const AuthContext = createContext<Partial<AuthContextType>>({});

// Define the AuthContext type
type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (
    username: string,
    email: string,
    password: string,
  ) => Promise<UserCredential>;
  signOut: () => Promise<void>;
};

// Create a custom hook to access the AuthContext
export const useAuth = (): AuthContextType =>
  useContext(AuthContext) as AuthContextType;

// Create the AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (
    email: string,
    password: string,
  ): Promise<UserCredential> => {
    try {
      const auth = getAuth();
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      // Handle sign-in error
      throw error;
    }
  };

  const signUp = async (
    username: string,
    email: string,
    password: string,
  ): Promise<UserCredential> => {
    try {
      const auth = getAuth();
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      if (result.user) {
        await updateProfile(result.user, { displayName: username });
      }
      return result;
    } catch (error) {
      // Handle sign-up error
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      router.push('/login');
    } catch (error) {
      // Handle sign-out error
      throw error;
    }
  };

  const authContextValue: AuthContextType = {
    user,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
