// ==========================================
// 📁 lib/auth/hooks.ts
// ==========================================

import { useContext } from "react";
import { AuthContext } from "./context";
import type {
  AuthSession,
  AuthStatus,
  AuthResult,
  RegisterData,
} from "./types";

export const useSession = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within AuthProvider");
  }

  return {
    data: context.session,
    status: context.status,
    update: context.refreshSession,
  };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return {
    signIn: context.signIn,
    signUp: context.signUp,
    signOut: context.signOut,
    refresh: context.refreshSession,
  };
};

// Özel hook'lar
export const useAuthStatus = (): AuthStatus => {
  const { status } = useSession();
  return status;
};

export const useCurrentUser = () => {
  const { data } = useSession();
  return data.user;
};

export const useIsAuthenticated = (): boolean => {
  const { data } = useSession();
  return data.isAuthenticated;
};
