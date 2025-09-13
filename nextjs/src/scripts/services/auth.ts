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
// API base URL env değişkeni ile
const API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;

// -------------------------
// Kullanıcı kaydı (register)
export async function signUp(data: RegisterProps) {
  try {
    const res = await fetch(`${API_URL}/user/signup`, {
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
    throw err;
  }
}

// -------------------------
// Kullanıcı giriş işlemi (signIn)
export async function signIn(email: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/user/login`, {
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

    switch (res.status) {
      case 400:
        return {
          success: false as const,
          status: 400,
          message: "Eksik veya hatalı giriş bilgileri",
          data: json,
        };
      case 401:
        return {
          success: false as const,
          status: 401,
          message: "Hatalı e-posta veya şifre",
          data: json,
        };
      case 403:
        return {
          success: false as const,
          status: 403,
          message: "Bu işlem için yetkiniz yok",
          data: json,
        };
      case 404:
        return {
          success: false as const,
          status: 404,
          message: "Kullanıcı bulunamadı",
          data: json,
        };
      case 429:
        return {
          success: false as const,
          status: 429,
          message: "Çok fazla giriş denemesi. Lütfen biraz bekleyin.",
          data: json,
        };
      default:
        if (res.status >= 500)
          return {
            success: false as const,
            status: res.status,
            message: "Sunucu hatası. Daha sonra tekrar deneyin.",
            data: json,
          };
        return {
          success: false as const,
          status: res.status,
          message:
            json?.message || `Login failed: ${res.status} ${res.statusText}`,
          data: json,
        };
    }
  } catch (err: any) {
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      return {
        success: false as const,
        status: 0,
        message:
          "Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı veya sunucuyu kontrol edin.",
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
    const res = await fetch(`${API_URL}/user/session`, {
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

    switch (res.status) {
      case 401:
        return {
          success: false as const,
          status: 401,
          message: "Oturum geçersiz veya süresi dolmuş",
          data,
        };
      case 403:
        return {
          success: false as const,
          status: 403,
          message: "Bu oturuma erişim yetkiniz yok",
          data,
        };
      case 404:
        return {
          success: false as const,
          status: 404,
          message: "Oturum bulunamadı",
          data,
        };
      case 429:
        return {
          success: false as const,
          status: 429,
          message: "Sunucuya çok fazla istek gönderildi. Lütfen bekleyin",
          data,
        };
      default:
        if (res.status >= 500)
          return {
            success: false as const,
            status: res.status,
            message: "Sunucu hatası. Daha sonra tekrar deneyin",
            data,
          };
        return {
          success: false as const,
          status: res.status,
          message: data?.message || `Hata: ${res.status} ${res.statusText}`,
          data,
        };
    }
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
    const res = await fetch(`${API_URL}/user/logout`, {
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
