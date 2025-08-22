// scripts/services/auth.ts
// -------------------------
// Bu dosya tüm authentication işlemlerini içerir: register, login (signIn), logout (signOut) ve session kontrolü.
// fetchSession: JWT token ile kullanıcının hâlâ aktif session'da olup olmadığını kontrol eder.

interface RegisterProps {
  name?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  password?: string;
  age?: number;
  userID?: number;
  createdAt?: string;
  updatedAt?: string;
}

// -------------------------
// Kullanıcı kaydı (register)
export async function signUp(data: RegisterProps) {
  try {
    const res = await fetch("http://localhost:3001/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    let json: any = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }

    if (res.ok) return { success: true as const, data: json };

    // Beklenen hatalar (HTTP 400, 401, 403, 404, 409, 500+)
    if ([400, 401, 403, 404, 409].includes(res.status) || res.status >= 500) {
      return {
        success: false as const,
        status: res.status,
        message:
          json?.message ||
          (res.status === 409
            ? "Bu email zaten kayıtlı"
            : `Register failed: ${res.status} ${res.statusText}`),
        data: json,
      };
    }

    throw new Error(
      `Beklenmeyen register hatası: ${res.status} ${res.statusText}`
    );
  } catch (err: any) {
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      return {
        success: false as const,
        status: 0,
        message:
          "Sunucuya ulaşılamıyor. Lütfen bağlantınızı veya sunucuyu kontrol edin.",
        data: null,
      };
    }
    throw err; // beklenmedik → overlay
  }
}

// -------------------------
// Kullanıcı giriş işlemi (signIn)
export async function signIn(email: string, password: string) {
  try {
    const res = await fetch("http://localhost:3001/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    let json: any = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }

    if (res.ok) return { success: true as const, data: json };

    if ([400, 401, 403, 404, 429].includes(res.status) || res.status >= 500) {
      return {
        success: false as const,
        status: res.status,
        message:
          json?.message || `Login failed: ${res.status} ${res.statusText}`,
        data: json,
      };
    }

    throw new Error(
      `Beklenmeyen login hatası: ${res.status} ${res.statusText}`
    );
  } catch (err: any) {
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      return {
        success: false as const,
        status: 0,
        message:
          "Sunucuya ulaşılamıyor. Lütfen bağlantınızı veya sunucuyu kontrol edin.",
        data: null,
      };
    }
    throw err;
  }
}

// -------------------------
// Aktif session kontrolü (fetchSession)
export async function fetchSession(token: string) {
  try {
    const res = await fetch("http://localhost:3001/user/session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (res.ok) return { success: true as const, data };

    if ([401, 403, 404, 429].includes(res.status) || res.status >= 500) {
      return {
        success: false as const,
        status: res.status,
        message: data?.message || `Hata: ${res.status} ${res.statusText}`,
        data,
      };
    }

    throw new Error(`Beklenmeyen HTTP hatası: ${res.status} ${res.statusText}`);
  } catch (err: any) {
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      return {
        success: false as const,
        status: 0,
        message:
          "Sunucuya ulaşılamıyor. Lütfen bağlantınızı veya sunucuyu kontrol edin.",
        data: null,
      };
    }
    throw err;
  }
}

// -------------------------
// Kullanıcı çıkış işlemi (signOut)
export async function signOut(token: string) {
  try {
    const res = await fetch("http://localhost:3001/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (res.ok) return { success: true as const, data };

    if ([401, 403, 404, 429].includes(res.status) || res.status >= 500) {
      return {
        success: false as const,
        status: res.status,
        message: data?.message || `Hata: ${res.status} ${res.statusText}`,
        data,
      };
    }

    throw new Error(`Beklenmeyen HTTP hatası: ${res.status} ${res.statusText}`);
  } catch (err: any) {
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      return {
        success: false as const,
        status: 0,
        message:
          "Sunucuya ulaşılamıyor. Lütfen bağlantınızı veya sunucuyu kontrol edin.",
        data: null,
      };
    }
    throw err;
  }
}
