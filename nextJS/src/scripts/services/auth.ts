// // const register = async (data) => {
// //   const response = await fetch("/api/auth/database", {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify(data),
// //   });

// //   return response.json();
// //   //   console.log(data);
// // };

// // export { register };

// interface RegisterProps {
//   name?: string;
//   firstname?: string;
//   lastname?: string;
//   username?: string;
//   email?: string;
//   password?: string;
//   age?: number;
//   userID?: number;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export async function registerUser(data: RegisterProps) {
//   const res = await fetch("http://localhost:3001/user/signup", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   let json: any = null;
//   try {
//     json = await res.json();
//   } catch {
//     json = null;
//   }

//   // ✅ Başarılı durum
//   if (res.ok) {
//     return { success: true as const, data: json };
//   }

//   // ⚠️ Beklenen hatalar → return
//   if ([400, 401, 403, 404, 409].includes(res.status) || res.status >= 500) {
//     return {
//       success: false as const,
//       status: res.status,
//       message:
//         json?.message ||
//         (res.status === 409
//           ? "Bu email zaten kayıtlı"
//           : `Register failed: ${res.status} ${res.statusText}`),
//       data: json,
//     };
//   }

//   // ❌ Beklenmeyen hata → throw
//   throw new Error(
//     `Beklenmeyen register hatası: ${res.status} ${res.statusText}`
//   );
// }

// // export async function loginUser(email: string, password: string) {
// //   const res = await fetch("http://localhost:3001/user/login", {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify({ email, password }),
// //   });

// //   console.log("Login response:", res);

// //   if (res.status === 401) {
// //     throw new Error("Geçersiz email veya şifre");
// //   }
// //   if (!res.ok) {
// //     throw new Error(`Login failed: ${res.status}`);
// //   }

// //   const json = await res.json();

// //   console.log("Login response data:", json);
// //   return json; // data içindeki token ve user bilgisi
// // }

// // utils/auth.ts
// export async function fetchSession(token: string) {
//   try {
//     const res = await fetch("http://localhost:3001/user/session", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     let data: any = null;
//     try {
//       data = await res.json();
//     } catch {
//       data = null;
//     }

//     // ✅ Başarılı durum
//     if (res.ok) {
//       return { success: true, data };
//     }

//     // ⚠️ Beklenen hata kodları
//     if ([401, 403, 404, 429].includes(res.status) || res.status >= 500) {
//       return {
//         success: false,
//         status: res.status,
//         message: data?.message || `Hata: ${res.status} ${res.statusText}`,
//         data,
//       };
//     }

//     // ❌ Beklenmeyen bir hata → throw
//     throw new Error(`Beklenmeyen hata: ${res.status} ${res.statusText}`);
//   } catch (err: any) {
//     // Ağ/CORS hatası ise return
//     if (err.message === "Failed to fetch") {
//       return {
//         success: false,
//         status: 0,
//         message: "Sunucuya ulaşılamıyor (ağ hatası veya CORS problemi)",
//         data: null,
//       };
//     }

//     // ❌ Gerçekten beklenmeyen bir şey → patlasın
//     throw err;
//   }
// }

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

export async function registerUser(data: RegisterProps) {
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

    // Beklenen hatalar
    if ([401, 403, 404, 429].includes(res.status) || res.status >= 500) {
      return {
        success: false as const,
        status: res.status,
        message: data?.message || `Hata: ${res.status} ${res.statusText}`,
        data,
      };
    }

    // Beklenmeyen HTTP hatası
    throw new Error(`Beklenmeyen HTTP hatası: ${res.status} ${res.statusText}`);
  } catch (err: any) {
    // fetch failed → sunucuya ulaşılamıyor
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      return {
        success: false as const,
        status: 0,
        message:
          "Sunucuya ulaşılamıyor. Lütfen bağlantınızı veya sunucuyu kontrol edin.",
        data: null,
      };
    }

    // Beklenmedik hata → overlay
    throw err;
  }
}

export async function signOut(token: string) {
  try {
    const res = await fetch("http://localhost:3001/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Sign out response:", res);

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (res.ok) return { success: true as const, data };

    // Beklenen hatalar
    if ([401, 403, 404, 429].includes(res.status) || res.status >= 500) {
      return {
        success: false as const,
        status: res.status,
        message: data?.message || `Hata: ${res.status} ${res.statusText}`,
        data,
      };
    }

    // Beklenmeyen HTTP hatası
    throw new Error(`Beklenmeyen HTTP hatası: ${res.status} ${res.statusText}`);
  } catch (err: any) {
    // fetch failed → sunucuya ulaşılamıyor
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      return {
        success: false as const,
        status: 0,
        message:
          "Sunucuya ulaşılamıyor. Lütfen bağlantınızı veya sunucuyu kontrol edin.",
        data: null,
      };
    }

    // Beklenmedik hata → overlay
    throw err;
  }
}
