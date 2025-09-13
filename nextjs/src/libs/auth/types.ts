// ==========================================
// 📁 lib/auth/types.ts
// ==========================================

export type AuthStatus = "initializing" | "authenticated" | "unauthenticated";

export interface User {
  id?: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  role?: string;
  age?: number;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterData {
  name?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  age?: number;
}

export interface AuthSession {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  expiresAt?: number;
}

export interface AuthContextValue {
  session: AuthSession;
  status: AuthStatus;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (data: RegisterData) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  session?: AuthSession;
}

export interface AuthConfig {
  autoRefreshInterval?: number; // dakika cinsinden
  refreshOnWindowFocus?: boolean;
  enablePersistence?: boolean;
  storagePrefix?: string;
  onSessionExpired?: () => void;
  onAuthError?: (error: string) => void;
}
