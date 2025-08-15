// const register = async (data) => {
//   const response = await fetch("/api/auth/database", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   return response.json();
//   //   console.log(data);
// };

// export { register };

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
  const res = await fetch("http://localhost:3001/user/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log("Register response:", res);

  if (res.status === 409) {
    throw new Error("Bu email zaten kayıtlı");
  }
  if (!res.ok) {
    throw new Error(`Register failed: ${res.status}`);
  }

  const json = await res.json();

  console.log("Register response data:", json);
  return json; // data içindeki token ve user bilgisi
}

// export async function loginUser(email: string, password: string) {
//   const res = await fetch("http://localhost:3001/user/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ email, password }),
//   });

//   console.log("Login response:", res);

//   if (res.status === 401) {
//     throw new Error("Geçersiz email veya şifre");
//   }
//   if (!res.ok) {
//     throw new Error(`Login failed: ${res.status}`);
//   }

//   const json = await res.json();

//   console.log("Login response data:", json);
//   return json; // data içindeki token ve user bilgisi
// }

// utils/auth.ts
export async function fetchSession(token: string) {
  try {
    const res = await fetch("http://localhost:3001/user/session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("checkAuth response: AAAAAAAAAAAA ", res);

    // ❌ Token geçersiz (401 Unauthorized)
    if (res.status === 401) {
      throw new Error("Geçersiz token");
    }

    // ❌ Diğer hata durumları (500, 404 vs.)
    if (!res.ok) {
      throw new Error(`Sunucu hatası: ${res.status}`);
    }

    // ✅ JSON parse et
    const json = await res.json();

    console.log("📡 Kullanıcı bilgileri:", json);
    return json; // → kullanıcı verisi döner
  } catch (err) {
    console.error("🚫 checkAuth hatası:", err);
    throw err; // useEffect içindeki try/catch yakalayacak
  }
}
