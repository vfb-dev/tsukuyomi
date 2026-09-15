"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { getCurrentUser } from "@/lib/api";
import { getAuthToken, removeAuthToken } from "@/lib/auth";
import { AuthUser } from "@/types/auth";

type AuthContextValue = {
  currentUser: AuthUser | null;
  isLoading: boolean;
  setAuthenticatedUser: (user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInitialUser() {
      const token = getAuthToken();

      if (!token) {
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const user = await getCurrentUser(token);
        setCurrentUser(user);
      } catch {
        removeAuthToken();
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialUser();
  }, []);

  function setAuthenticatedUser(user: AuthUser) {
    setCurrentUser(user);
    setIsLoading(false);
  }

  function logout() {
    removeAuthToken();
    setCurrentUser(null);
    setIsLoading(false);
  }

  const value = {
    currentUser,
    isLoading,
    setAuthenticatedUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
