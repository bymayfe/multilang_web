// BUNU NASIL YAPTIRDIM BEN DE BILMIYOM BUNU SONRA KULLANICAM XDD
// ==========================================
// 📁 lib/auth/auth-service.ts
// ==========================================

import {
  fetchSession,
  signIn as apiSignIn,
  signOut as apiSignOut,
  signUp as apiSignUp,
} from "@/scripts/services/auth";
import type {
  User,
  RegisterData,
  AuthSession,
  AuthStatus,
  AuthResult,
  AuthConfig,
} from "./types";
import { AuthStorageManager } from "./storage-manager";
import { AuthRefreshScheduler } from "./refresh-scheduler";

export class AuthService {
  private storageManager: AuthStorageManager;
  private refreshScheduler: AuthRefreshScheduler;
  private config: Required<AuthConfig>;

  // Callback fonksiyonları
  private onSessionUpdate: ((session: AuthSession) => void) | null = null;
  private onStatusUpdate: ((status: AuthStatus) => void) | null = null;

  constructor(config: AuthConfig = {}) {
    // Default değerlerle config'i tamamla
    this.config = {
      autoRefreshInterval: config.autoRefreshInterval ?? 15,
      refreshOnWindowFocus: config.refreshOnWindowFocus ?? true,
      enablePersistence: config.enablePersistence ?? true,
      storagePrefix: config.storagePrefix ?? "auth",
      onSessionExpired: config.onSessionExpired ?? (() => {}),
      onAuthError: config.onAuthError ?? (() => {}),
    };

    this.storageManager = new AuthStorageManager(this.config.storagePrefix);
    this.refreshScheduler = new AuthRefreshScheduler({
      intervalMinutes: this.config.autoRefreshInterval,
      enableFocusRefresh: this.config.refreshOnWindowFocus,
    });

    // Refresh callback'ini ayarla
    this.refreshScheduler.setRefreshCallback(async () => {
      await this.performSessionRefresh();
    });
  }

  // Callback fonksiyonlarını ayarla
  setUpdateCallbacks(
    sessionCallback: (session: AuthSession) => void,
    statusCallback: (status: AuthStatus) => void
  ): void {
    this.onSessionUpdate = sessionCallback;
    this.onStatusUpdate = statusCallback;
  }

  private updateSessionState(session: AuthSession): void {
    this.onSessionUpdate?.(session);
  }

  private updateAuthStatus(status: AuthStatus): void {
    this.onStatusUpdate?.(status);
  }

  private handleAuthError(error: string): void {
    console.error("[Auth] Hata:", error);
    this.config.onAuthError(error);
  }

  // Auth service'i başlat
  async initializeAuth(): Promise<AuthSession> {
    this.updateAuthStatus("initializing");

    if (this.config.enablePersistence) {
      const storedSession = this.storageManager.getStoredSession();

      if (storedSession.accessToken) {
        // Stored session varsa refresh ile kontrol et
        await this.performSessionRefresh(storedSession);
        this.refreshScheduler.startPeriodicRefresh();
        return storedSession;
      }
    }

    // Session yok
    const emptySession = {
      user: null,
      accessToken: null,
      isAuthenticated: false,
    };
    this.updateSessionState(emptySession);
    this.updateAuthStatus("unauthenticated");
    return emptySession;
  }

  // Kullanıcı girişi
  async authenticateUser(email: string, password: string): Promise<AuthResult> {
    this.updateAuthStatus("initializing");

    try {
      const apiResponse = await apiSignIn(email, password);

      if (apiResponse.success) {
        const session: AuthSession = {
          user: apiResponse.data.user,
          accessToken: apiResponse.data.token,
          isAuthenticated: true,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 saat
        };

        // Session'ı kaydet
        if (this.config.enablePersistence) {
          this.storageManager.storeSession(session);
        }

        this.updateSessionState(session);
        this.updateAuthStatus("authenticated");
        this.refreshScheduler.startPeriodicRefresh();

        return { success: true, session };
      } else {
        this.handleAuthError("Giriş başarısız");
        const emptySession = {
          user: null,
          accessToken: null,
          isAuthenticated: false,
        };
        this.updateSessionState(emptySession);
        this.updateAuthStatus("unauthenticated");
        return { success: false, error: "Giriş bilgileri geçersiz" };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Bilinmeyen hata";
      this.handleAuthError(errorMessage);

      const emptySession = {
        user: null,
        accessToken: null,
        isAuthenticated: false,
      };
      this.updateSessionState(emptySession);
      this.updateAuthStatus("unauthenticated");
      return { success: false, error: errorMessage };
    }
  }

  // Kullanıcı kaydı
  async registerUser(data: RegisterData): Promise<AuthResult> {
    this.updateAuthStatus("initializing");

    try {
      const apiResponse = await apiSignUp(data);

      if (apiResponse.success) {
        const session: AuthSession = {
          user: apiResponse.data.user,
          accessToken: apiResponse.data.token,
          isAuthenticated: true,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };

        if (this.config.enablePersistence) {
          this.storageManager.storeSession(session);
        }

        this.updateSessionState(session);
        this.updateAuthStatus("authenticated");
        this.refreshScheduler.startPeriodicRefresh();

        return { success: true, session };
      } else {
        this.handleAuthError("Kayıt başarısız");
        const emptySession = {
          user: null,
          accessToken: null,
          isAuthenticated: false,
        };
        this.updateSessionState(emptySession);
        this.updateAuthStatus("unauthenticated");
        return { success: false, error: "Kayıt işlemi başarısız" };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Bilinmeyen hata";
      this.handleAuthError(errorMessage);

      const emptySession = {
        user: null,
        accessToken: null,
        isAuthenticated: false,
      };
      this.updateSessionState(emptySession);
      this.updateAuthStatus("unauthenticated");
      return { success: false, error: errorMessage };
    }
  }

  // Çıkış işlemi
  async logoutUser(): Promise<void> {
    const currentToken = this.storageManager.getAccessToken();

    try {
      if (currentToken) {
        await apiSignOut(currentToken);
      }
    } catch (error) {
      console.warn("[Auth] Çıkış API hatası:", error);
    } finally {
      // Her durumda temizle
      this.storageManager.clearAuthData();
      this.refreshScheduler.stopPeriodicRefresh();

      const emptySession = {
        user: null,
        accessToken: null,
        isAuthenticated: false,
      };
      this.updateSessionState(emptySession);
      this.updateAuthStatus("unauthenticated");
    }
  }

  // Session refresh
  async performSessionRefresh(currentSession?: AuthSession): Promise<void> {
    const token =
      currentSession?.accessToken || this.storageManager.getAccessToken();

    if (!token) {
      this.updateAuthStatus("unauthenticated");
      const emptySession = {
        user: null,
        accessToken: null,
        isAuthenticated: false,
      };
      this.updateSessionState(emptySession);
      this.refreshScheduler.stopPeriodicRefresh();
      return;
    }

    try {
      const apiResponse = await fetchSession(token);

      if (apiResponse.success) {
        const refreshedSession: AuthSession = {
          user: apiResponse.data.user,
          accessToken: token,
          isAuthenticated: true,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };

        if (this.config.enablePersistence) {
          this.storageManager.setUserData(refreshedSession.user);
          this.storageManager.setSessionMetadata({
            expiresAt: refreshedSession.expiresAt,
          });
        }

        this.updateSessionState(refreshedSession);
        this.updateAuthStatus("authenticated");
      } else {
        // Token geçersiz - session expired
        this.config.onSessionExpired();
        this.storageManager.clearAuthData();
        this.refreshScheduler.stopPeriodicRefresh();

        const emptySession = {
          user: null,
          accessToken: null,
          isAuthenticated: false,
        };
        this.updateSessionState(emptySession);
        this.updateAuthStatus("unauthenticated");
      }
    } catch (error) {
      console.error("[Auth] Session refresh hatası:", error);
      this.handleAuthError("Session refresh başarısız");

      this.storageManager.clearAuthData();
      this.refreshScheduler.stopPeriodicRefresh();

      const emptySession = {
        user: null,
        accessToken: null,
        isAuthenticated: false,
      };
      this.updateSessionState(emptySession);
      this.updateAuthStatus("unauthenticated");
    }
  }

  // Manuel refresh - component'ten çağrılabilir
  async triggerManualRefresh(): Promise<void> {
    await this.refreshScheduler.triggerManualRefresh();
  }

  // Service'i temizle
  cleanup(): void {
    this.refreshScheduler.destroy();
  }
}
