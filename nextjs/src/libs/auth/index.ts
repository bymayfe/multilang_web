// ==========================================
// 📁 lib/auth/index.ts
// ==========================================

export { AuthProvider } from "./context";
export {
  useSession,
  useAuth,
  useAuthStatus,
  useCurrentUser,
  useIsAuthenticated,
} from "./hooks";
export {
  getSession,
  isAuthenticated,
  getAccessToken,
  isSessionExpired,
} from "./utils";
export type {
  User,
  AuthSession,
  RegisterData,
  AuthStatus,
  AuthConfig,
  AuthResult,
} from "./types";
