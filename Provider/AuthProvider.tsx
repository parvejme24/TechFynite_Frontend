"use client";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
  sendEmailVerification,
} from "firebase/auth";
import { createContext, useEffect, useState, ReactNode } from "react";
import { app } from "@/firebase.config";
import axios from "axios";
import useApiBaseUrl from "@/hooks/useApiBaseUrl";

const API_BASE_URL = useApiBaseUrl();

export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  createUser: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<any>;
  signInUser: (email: string, password: string) => Promise<any>;
  updateUserProfile: (name: string) => Promise<any>;
  googleLogin: () => Promise<any>;
  logOut: () => Promise<any>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
const auth = getAuth(app);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const createUser = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    setLoading(true);
    try {
      // 1. Firebase registration
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName });

      // 2. Send email verification
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
      }

      // 3. Save user to PostgreSQL via backend (direct axios)
      const registerPayload: RegisterRequest = { displayName, email, password };
      await axios.post(`${API_BASE_URL}/register`, registerPayload, {
        withCredentials: true,
      });

      return userCredential;
    } finally {
      setLoading(false);
    }
  };

  const signInUser = async (email: string, password: string) => {
    setLoading(true);
    try {
      // 1. Firebase login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2. Notify backend for login
      const loginPayload: LoginRequest = { email, password };
      const res = await axios.post(`${API_BASE_URL}/login`, loginPayload, {
        withCredentials: true,
      });

      // 3. Save tokens to localStorage
      if (res.data.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
      }
      if (res.data.refreshToken) {
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }

      return userCredential;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  function updateUserProfile(name: string) {
    if (!auth.currentUser) return Promise.reject("No user is logged in");
    return updateProfile(auth.currentUser, { displayName: name });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const userEmail = currentUser?.email || user?.email;
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const logOut = () => {
    return signOut(auth);
  };

  const authInfo = {
    user,
    loading,
    createUser,
    signInUser,
    updateUserProfile,
    googleLogin,
    logOut,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
