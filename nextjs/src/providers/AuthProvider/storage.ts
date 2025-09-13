// providers/AuthProvider/storage.ts

export interface Session {
  user: any;
  token: string | null;
}

export const createStorageAdapter = (tokenKey: string = "auth_token") => ({
  localStorage: {
    getToken: (): string | null => {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(tokenKey);
    },

    setToken: (token: string): void => {
      if (typeof window === "undefined") return;
      localStorage.setItem(tokenKey, token);
    },

    removeToken: (): void => {
      if (typeof window === "undefined") return;
      localStorage.removeItem(tokenKey);
    },

    getSession: (): Session | null => {
      if (typeof window === "undefined") return null;
      const sessionData = localStorage.getItem(`${tokenKey}_session`);
      if (!sessionData) return null;
      try {
        return JSON.parse(sessionData);
      } catch {
        return null;
      }
    },

    setSession: (session: Session): void => {
      if (typeof window === "undefined") return;
      localStorage.setItem(`${tokenKey}_session`, JSON.stringify(session));
    },

    clear: (): void => {
      if (typeof window === "undefined") return;
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(`${tokenKey}_session`);
    },
  },

  httpOnly: {
    getToken: (): string | null => {
      if (typeof window !== "undefined") {
        const cookies = document.cookie.split(";");
        const tokenCookie = cookies.find((c) =>
          c.trim().startsWith(`${tokenKey}=`)
        );
        return tokenCookie ? tokenCookie.split("=")[1] : null;
      }
      return null;
    },

    setToken: (token: string): void => {
      if (typeof window !== "undefined") {
        const expires = new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000
        ).toUTCString();
        document.cookie = `${tokenKey}=${token}; expires=${expires}; path=/; SameSite=Strict; Secure`;
      }
    },

    removeToken: (): void => {
      if (typeof window !== "undefined") {
        document.cookie = `${tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    },

    getSession: (): Session | null => {
      if (typeof window !== "undefined") {
        const cookies = document.cookie.split(";");
        const sessionCookie = cookies.find((c) =>
          c.trim().startsWith(`${tokenKey}_session=`)
        );
        if (!sessionCookie) return null;
        try {
          return JSON.parse(decodeURIComponent(sessionCookie.split("=")[1]));
        } catch {
          return null;
        }
      }
      return null;
    },

    setSession: (session: Session): void => {
      if (typeof window !== "undefined") {
        const expires = new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000
        ).toUTCString();
        const sessionData = encodeURIComponent(JSON.stringify(session));
        document.cookie = `${tokenKey}_session=${sessionData}; expires=${expires}; path=/; SameSite=Strict; Secure`;
      }
    },

    clear: (): void => {
      if (typeof window !== "undefined") {
        document.cookie = `${tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${tokenKey}_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    },
  },

  memory: (() => {
    let token: string | null = null;
    let session: Session | null = null;

    return {
      getToken: (): string | null => token,
      setToken: (t: string): void => {
        token = t;
      },
      removeToken: (): void => {
        token = null;
      },
      getSession: (): Session | null => session,
      setSession: (s: Session): void => {
        session = s;
      },
      clear: (): void => {
        token = null;
        session = null;
      },
    };
  })(),
});

// Server-side helpers (SSR için)
const globalTokenKey = "auth_token";

export async function getServerToken(
  tokenKey: string = globalTokenKey
): Promise<string | null> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(tokenKey);
    return tokenCookie?.value || null;
  } catch {
    return null;
  }
}

export async function getServerSession(
  tokenKey: string = globalTokenKey
): Promise<Session | null> {
  try {
    const token = await getServerToken(tokenKey);
    if (!token) return null;

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      }/user/session`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return {
      user: data,
      token: token,
    };
  } catch {
    return null;
  }
}
