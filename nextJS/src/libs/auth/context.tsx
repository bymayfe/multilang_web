// ==========================================
// 📁 lib/auth/context.tsx
// ==========================================

"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { AuthService } from "./auth-service";
import type {
  AuthContextValue,
  AuthSession,
  RegisterData,
  AuthStatus,
  AuthConfig,
  AuthResult,
} from "./types";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  config?: AuthConfig;
}

export const AuthProvider = ({ children, config = {} }: AuthProviderProps) => {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
  });
  const [status, setStatus] = useState<AuthStatus>("initializing");
  const authServiceRef = useRef<AuthService | null>(null);

  // Auth service'i başlat
  useEffect(() => {
    const authService = new AuthService(config);
    authServiceRef.current = authService;

    // Callback'leri ayarla
    authService.setUpdateCallbacks(setSession, setStatus);

    // Initialize
    authService.initializeAuth();

    // Cleanup
    return () => {
      authService.cleanup();
    };
  }, []);

  // API wrapper metodları
  const signIn = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    if (!authServiceRef.current) {
      return { success: false, error: "Auth service bulunamadı" };
    }
    return await authServiceRef.current.authenticateUser(email, password);
  };

  const signUp = async (data: RegisterData): Promise<AuthResult> => {
    if (!authServiceRef.current) {
      return { success: false, error: "Auth service bulunamadı" };
    }
    return await authServiceRef.current.registerUser(data);
  };

  const signOut = async (): Promise<void> => {
    if (!authServiceRef.current) return;
    await authServiceRef.current.logoutUser();
  };

  const refreshSession = async (): Promise<void> => {
    if (!authServiceRef.current) return;
    await authServiceRef.current.triggerManualRefresh();
  };

  const contextValue: AuthContextValue = {
    session,
    status,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthContext };
