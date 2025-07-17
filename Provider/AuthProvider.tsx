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
} from "firebase/auth";
import { createContext, useEffect, useState, ReactNode } from "react";
import { app } from "@/firebase.config";
import useAxiosPublic from "@/hooks/useAxiosPublic";

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
  const axiosPublic = useAxiosPublic();

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

      // 2. Send to backend
      const registerPayload: RegisterRequest = { displayName, email, password };
      await axiosPublic.post("/register", registerPayload);

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

      // 2. Send to backend
      const loginPayload: LoginRequest = { email, password };
      await axiosPublic.post("/login", loginPayload);

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

      const handleCreateToken = async () => {
        const email = { email: userEmail };
        await axiosPublic.post("/jwt", email, {
          withCredentials: true,
        });
      };
      handleCreateToken();

      // if (currentUser) {
      //   axios
      //     .post("https://localhost:5000/api/v1/access-token", loggedUser, {
      //       withCredentials: true,
      //     })
      //     .then((res) => {
      //       console.log(res.data);
      //     });
      // } else {
      //   axios
      //     .post("http://localhost:5000/api/v1/auth/logOut", loggedUser, {
      //       withCredentials: true,
      //     })
      //     .then((res) => {
      //       console.log(res.data);
      //     });
      // }
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
