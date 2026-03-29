"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  User, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { updateUserProfile } from "@/lib/firestore";
import { User as AppUser } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  setupRecaptcha: (containerId: string) => void;
  signInWithPhone: (phoneNumber: string) => Promise<ConfirmationResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Sync to Firestore
        const profileData: Partial<AppUser> = {
          id: user.uid,
          name: user.displayName || "New User",
          email: user.email || "",
          avatar: user.photoURL || "",
          role: "buyer", // Default role
          onboarded: true,
        };
        await updateUserProfile(user.uid, profileData);
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const signInWithGoogle = async () => {
    if (!auth) {
      alert("Firebase is not configured. Please add your API keys to .env.local");
      return;
    }
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const setupRecaptcha = (containerId: string) => {
    if (!auth) return;
    if (!recaptchaVerifier) {
      try {
        const verifier = new RecaptchaVerifier(auth, containerId, {
          size: "invisible",
        });
        setRecaptchaVerifier(verifier);
      } catch (error) {
        console.error("Recaptcha initialization failed:", error);
      }
    }
  };

  const signInWithPhone = async (phoneNumber: string) => {
    if (!auth) {
      throw new Error("Firebase is not configured");
    }
    if (!recaptchaVerifier) {
      throw new Error("Recaptcha not initialized");
    }
    return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, signInWithGoogle, setupRecaptcha, signInWithPhone }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
