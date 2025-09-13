// ==========================================
// 📁 lib/auth/storage-manager.ts
// ==========================================

import type { User, AuthSession } from "./types";

export class AuthStorageManager {
  private storagePrefix: string;
  private isClientEnvironment: boolean;

  constructor(prefix: string = "auth") {
    this.storagePrefix = prefix;
    this.isClientEnvironment = typeof window !== "undefined";
  }

  private createStorageKey(key: string): string {
    return `${this.storagePrefix}_${key}`;
  }

  // Token yönetimi
  getAccessToken(): string | null {
    if (!this.isClientEnvironment) return null;

    try {
      return localStorage.getItem(this.createStorageKey("access_token"));
    } catch (error) {
      console.warn("[Auth] Token okuma hatası:", error);
      return null;
    }
  }

  setAccessToken(token: string | null): boolean {
    if (!this.isClientEnvironment) return false;

    try {
      if (token) {
        localStorage.setItem(this.createStorageKey("access_token"), token);
      } else {
        localStorage.removeItem(this.createStorageKey("access_token"));
      }
      return true;
    } catch (error) {
      console.warn("[Auth] Token kaydetme hatası:", error);
      return false;
    }
  }

  // User verisi yönetimi
  getUserData(): User | null {
    if (!this.isClientEnvironment) return null;

    try {
      const userData = localStorage.getItem(this.createStorageKey("user_data"));
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn("[Auth] User verisi okuma hatası:", error);
      return null;
    }
  }

  setUserData(user: User | null): boolean {
    if (!this.isClientEnvironment) return false;

    try {
      if (user) {
        localStorage.setItem(
          this.createStorageKey("user_data"),
          JSON.stringify(user)
        );
      } else {
        localStorage.removeItem(this.createStorageKey("user_data"));
      }
      return true;
    } catch (error) {
      console.warn("[Auth] User verisi kaydetme hatası:", error);
      return false;
    }
  }

  // Session metadata
  getSessionMetadata(): { expiresAt?: number } {
    if (!this.isClientEnvironment) return {};

    try {
      const metadata = localStorage.getItem(
        this.createStorageKey("session_meta")
      );
      return metadata ? JSON.parse(metadata) : {};
    } catch {
      return {};
    }
  }

  setSessionMetadata(metadata: { expiresAt?: number }): boolean {
    if (!this.isClientEnvironment) return false;

    try {
      localStorage.setItem(
        this.createStorageKey("session_meta"),
        JSON.stringify(metadata)
      );
      return true;
    } catch (error) {
      console.warn("[Auth] Session metadata kaydetme hatası:", error);
      return false;
    }
  }

  // Tüm auth verisini temizle
  clearAuthData(): boolean {
    if (!this.isClientEnvironment) return false;

    try {
      localStorage.removeItem(this.createStorageKey("access_token"));
      localStorage.removeItem(this.createStorageKey("user_data"));
      localStorage.removeItem(this.createStorageKey("session_meta"));
      return true;
    } catch (error) {
      console.warn("[Auth] Veri temizleme hatası:", error);
      return false;
    }
  }

  // Tam session'ı getir
  getStoredSession(): AuthSession {
    const user = this.getUserData();
    const accessToken = this.getAccessToken();
    const metadata = this.getSessionMetadata();

    return {
      user,
      accessToken,
      isAuthenticated: !!accessToken,
      expiresAt: metadata.expiresAt,
    };
  }

  // Session'ı tamamen kaydet
  storeSession(session: AuthSession): boolean {
    const tokenStored = this.setAccessToken(session.accessToken);
    const userStored = this.setUserData(session.user);
    const metaStored = this.setSessionMetadata({
      expiresAt: session.expiresAt,
    });

    return tokenStored && userStored && metaStored;
  }
}
