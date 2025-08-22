"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider/hook";
import { useRouter } from "next/navigation";

type LogoutProps = {
  delay?: number; // opsiyonel (varsayılan 3 sn)
  redirectTo?: string; // opsiyonel (varsayılan "/")
};

const Logout = ({ delay = 3, redirectTo = "/" }: LogoutProps) => {
  const { session, signOut } = useAuth();
  const router = useRouter();
  const [countdown, setCountdown] = useState(delay);

  useEffect(() => {
    const logoutAndRedirect = async () => {
      if (session?.token) {
        await signOut();

        let timeLeft = delay;
        const interval = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);
          if (timeLeft <= 0) {
            clearInterval(interval);
            router.push(redirectTo);
          }
        }, 1000);
      } else {
        router.push(redirectTo);
      }
    };

    logoutAndRedirect();
  }, [session, signOut, router, delay, redirectTo]);

  return (
    <div className="flex items-center justify-center min-h-screen text-lg">
      {session?.token
        ? `Çıkış yapılıyor... ${countdown} saniye içinde yönlendirileceksiniz.`
        : "Yönlendiriliyorsunuz..."}
    </div>
  );
};

export default Logout;
