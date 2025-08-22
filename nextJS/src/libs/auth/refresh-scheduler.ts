// ==========================================
// 📁 lib/auth/refresh-scheduler.ts
// ==========================================

export class AuthRefreshScheduler {
  private refreshTimer: NodeJS.Timeout | null = null;
  private isRefreshInProgress = false;
  private refreshCallback: (() => Promise<void>) | null = null;
  private configuration: {
    intervalMinutes: number;
    enableFocusRefresh: boolean;
  };
  private eventListenerCleanup: (() => void) | null = null;

  constructor(config: {
    intervalMinutes: number;
    enableFocusRefresh: boolean;
  }) {
    this.configuration = config;
    this.initializeWindowEventListeners();
  }

  setRefreshCallback(callback: () => Promise<void>): void {
    this.refreshCallback = callback;
  }

  startPeriodicRefresh(): void {
    this.stopPeriodicRefresh();

    if (this.configuration.intervalMinutes > 0) {
      this.refreshTimer = setInterval(async () => {
        await this.executeRefresh();
      }, this.configuration.intervalMinutes * 60 * 1000);
    }
  }

  stopPeriodicRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  async executeRefresh(): Promise<void> {
    if (this.isRefreshInProgress || !this.refreshCallback) return;

    this.isRefreshInProgress = true;

    try {
      await this.refreshCallback();
    } catch (error) {
      console.error("[Auth] Otomatik refresh hatası:", error);
    } finally {
      this.isRefreshInProgress = false;
    }
  }

  // Manuel refresh - kullanıcı tetikleyebilir
  async triggerManualRefresh(): Promise<void> {
    await this.executeRefresh();
  }

  private initializeWindowEventListeners(): void {
    if (
      !this.configuration.enableFocusRefresh ||
      typeof window === "undefined"
    ) {
      return;
    }

    const handleWindowFocus = () => {
      this.executeRefresh();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        this.executeRefresh();
      }
    };

    // Event listener'ları ekle
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup fonksiyonu
    this.eventListenerCleanup = () => {
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }

  destroy(): void {
    this.stopPeriodicRefresh();
    this.eventListenerCleanup?.();
    this.eventListenerCleanup = null;
    this.refreshCallback = null;
  }
}
