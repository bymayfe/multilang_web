// providers/AuthProvider/index.tsx
"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import {
  fetchSession,
  signIn as apiSignIn,
  signOut as apiSignOut,
  signUp as apiSignUp,
} from "@/scripts/services/auth";
import { createStorageAdapter } from "./storage";

// 💡 Status ve Storage tipleri
type AuthStatus = "loading" | "authenticated" | "unauthenticated";
type StorageType = "localStorage" | "httpOnly" | "memory";

interface User {
  userID?: number;
  name?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  role?: string;
  age?: number;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
}

interface RegisterProps {
  name?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  password?: string;
  age?: number;
}

interface Session {
  user: User | null;
  token: string | null;
}

export interface AuthContextType {
  session: Session;
  status: AuthStatus;
  signUp: (
    data: RegisterProps
  ) => Promise<
    | { success: true; data: { user: any; token: string } }
    | { success: false; status: number; message: string; data: any }
  >;

  signIn: (
    type: "credential",
    email: string,
    password: string
  ) => Promise<
    | { success: true; data: { user: any; token: string } }
    | { success: false; status: number; message: string; data: any }
  >;

  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
  storage?: StorageType;
  tokenKey?: string;
  refreshInterval?: number; // dakika cinsinden
  initialSession?: Session | null; // SSR için
}

export const AuthProvider = ({
  children,
  storage = "localStorage",
  tokenKey = "auth_token",
  refreshInterval = 10,
  initialSession = null,
}: AuthProviderProps) => {
  const [session, setSession] = useState<Session>(
    initialSession || { user: null, token: null }
  );
  const [status, setStatus] = useState<AuthStatus>(
    initialSession ? "authenticated" : "loading"
  );
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  // Storage adapter
  const storageAdapter = createStorageAdapter(tokenKey)[storage];

  // 🔄 Session refresh
  const refreshSession = async () => {
    if (isRefreshingRef.current) return;

    if (!session.token) {
      setStatus("unauthenticated");
      setSession({ user: null, token: null });
      clearRefreshInterval();
      return;
    }

    isRefreshingRef.current = true;

    try {
      const res = await fetchSession(session.token);
      console.log("Session refreshed:", res);

      if (res.success) {
        // Backend’den user verisini düzgün al
        const userData = res.data.user || res.data || null;
        setSession({ user: userData, token: session.token });
        storageAdapter.setSession({ user: userData, token: session.token });
        setStatus("authenticated");
      } else {
        // Token geçersiz veya hata durumunda logout yap
        setSession({ user: null, token: null });
        setStatus("unauthenticated");
        storageAdapter.clear();
        clearRefreshInterval();
      }
    } catch (error) {
      console.error("Session refresh error:", error);
      setSession({ user: null, token: null });
      setStatus("unauthenticated");
      storageAdapter.clear();
      clearRefreshInterval();
    } finally {
      isRefreshingRef.current = false;
    }
  };

  // 🕐 Otomatik refresh interval başlat
  const startRefreshInterval = () => {
    clearRefreshInterval();
    refreshIntervalRef.current = setInterval(() => {
      refreshSession();
    }, refreshInterval * 60 * 1000);
  };

  // 🛑 Interval temizle
  const clearRefreshInterval = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };

  // 📝 Sign Up
  type SignUpResult =
    | { success: true; data: { user: any; token: string } }
    | { success: false; status: number; message: string; data: any };

  const signUp = async (data: RegisterProps): Promise<SignUpResult> => {
    setStatus("loading");

    const res = await apiSignUp(data);

    if (res.success) {
      const newSession = { user: res.data.user, token: res.data.token };
      setSession(newSession);
      setStatus("authenticated");
      storageAdapter.setToken(res.data.token);
      storageAdapter.setSession(newSession);
      startRefreshInterval();

      return {
        success: true,
        data: newSession,
      };
    }

    // Hatalı kayıt
    setSession({ user: null, token: null });
    setStatus("unauthenticated");
    storageAdapter.clear();
    clearRefreshInterval();

    return {
      success: false,
      status: res.status,
      message: res.message || "Kayıt başarısız",
      data: res.data,
    };
  };

  // 🔐 Sign In
  const signIn = async (
    type: "credential",
    email: string,
    password: string
  ) => {
    setStatus("loading");

    if (type !== "credential") {
      return {
        success: false as const,
        status: 400,
        message: "Unsupported sign-in type",
        data: null,
      };
    }

    const res = await apiSignIn(email, password);

    if (res.success) {
      const newSession = { user: res.data.user, token: res.data.token };
      setSession(newSession);
      setStatus("authenticated");
      storageAdapter.setToken(res.data.token);
      storageAdapter.setSession(newSession);
      startRefreshInterval();
      return { success: true as const, data: newSession };
    }

    // Hatalı login
    setSession({ user: null, token: null });
    setStatus("unauthenticated");
    storageAdapter.clear();
    clearRefreshInterval();

    return {
      success: false as const,
      status: res.status,
      message: res.message || "Giriş başarısız",
      data: res.data,
    };
  };

  // 🚪 Sign Out
  const signOut = async () => {
    try {
      if (session.token) await apiSignOut(session.token);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setSession({ user: null, token: null });
      setStatus("unauthenticated");
      storageAdapter.clear();
      clearRefreshInterval(); // Otomatik refresh durdur
    }
  };

  // 🚀 Component mount edildiğinde ve token değiştiğinde
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // SSR’den gelen session varsa onu kullan
        if (initialSession) {
          setSession(initialSession);
          await refreshSession();
          setStatus("authenticated");
          startRefreshInterval();
          return;
        }

        // Storage’dan token kontrol et
        const savedToken = storageAdapter.getToken();
        if (savedToken) {
          await refreshSession(); // Backend doğrula
          startRefreshInterval();
        } else {
          setStatus("unauthenticated");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setStatus("unauthenticated");
      }
    };

    initializeAuth();

    // Component unmount olduğunda interval’ı temizle
    return () => clearRefreshInterval();
  }, []);

  // 👁️ Sayfa odak durumu kontrol et
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && session.token) refreshSession();
    };

    const handleFocus = () => {
      if (session.token) refreshSession();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [session.token]);

  return (
    <AuthContext.Provider
      value={{ session, status, signUp, signIn, signOut, refreshSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};
