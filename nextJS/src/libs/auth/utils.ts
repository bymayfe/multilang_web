// ==========================================
// 📁 lib/auth/utils.ts
// ==========================================

import type { AuthSession } from "./types";
import { AuthStorageManager } from "./storage-manager";

// Server-side için session getter
export const getSession = (): AuthSession | null => {
  if (typeof window === "undefined") return null;

  const storage = new AuthStorageManager();
  return storage.getStoredSession();
};

// Authentication durumu kontrol
export const isAuthenticated = (): boolean => {
  const session = getSession();
  return session?.isAuthenticated ?? false;
};

// Token getter
export const getAccessToken = (): string | null => {
  const session = getSession();
  return session?.accessToken ?? null;
};

// Session expire kontrolü
export const isSessionExpired = (): boolean => {
  const session = getSession();
  if (!session?.expiresAt) return false;

  return Date.now() > session.expiresAt;
};
