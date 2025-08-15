"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import { MdAdminPanelSettings } from "react-icons/md";
import { PiSpotifyLogoBold } from "react-icons/pi";
import { FaSpotify } from "react-icons/fa";
import { RiLoginCircleLine, RiLogoutCircleRLine } from "react-icons/ri";
import Image from "next/image";

import { fetchSession } from "@/scripts/services/auth";
// 🔻 KALDIRILDI: NextAuth kullanılmıyor ama ileride alternatif auth gelirse tekrar eklenebilir
// import { signOut, useSession } from "next-auth/react"; // 💡 auth sistemi eklendiğinde burası yeniden aktif edilecek

const Items = [
  {
    name: "Spotify Project v1",
    href: "/stats/100000",
    key: "spotifyv1",
    icon: <PiSpotifyLogoBold size="25px" />,
    showOnAuth: true,
    requireAuth: false,
  },
  {
    name: "Spotify Project v2",
    href: "/spotify/100000",
    key: "spotifyv2",
    icon: <FaSpotify size="25px" />,
    showOnAuth: true,
    requireAuth: false,
  },
  {
    name: "Management",
    href: "/user/management",
    key: "management",
    icon: <MdAdminPanelSettings size="25px" />,
    showOnAuth: true,
    requireAuth: true,
    role: ["admin"],
  },
  {
    name: "Log In",
    href: "/user/login",
    key: "login",
    icon: <RiLoginCircleLine size="25px" />,
    showOnAuth: false,
    requireAuth: false,
  },
];

interface AccountMenuProps {
  className?: string;
  children?: React.ReactNode;
  data?: string;
}

interface User {
  userID: number;
  email: string;
  role: string; // admin, user gibi roller
  username?: string;
  firstname?: string;
  lastname?: string;
  age?: number;
  createdAt?: string;
  updatedAt?: string;
  image?: string; // profil fotoğrafı varsa
}

interface Session {
  user: User | null;
  isAuthenticated: boolean;
}

const AccountMenu = ({ className, children, data }: AccountMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [session, setSession] = useState<Session>({
    user: null,
    isAuthenticated: false,
  });

  const [isLoaded, setIsLoaded] = useState(true);

  const buttonRef = useRef<HTMLDivElement | null>(null);

  // 🔻 KALDIRILDI: NextAuth yerine manuel kontrol gelecek, dummy session var
  // const { data: session, status } = useSession(); // 💡 backend auth tamamlandığında yeniden eklenecek

  // 🔧 Şimdilik boş session objesi (Go veya başka sistemden alınacak veri buraya bağlanabilir)
  // const session: any = null;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setSession({ user: null, isAuthenticated: false });
        return;
      }

      try {
        const userData = await fetchSession(token);
        // console.log("Session verisi1111:", userData);
        setSession({ user: userData, isAuthenticated: true });
      } catch (err) {
        console.error("🚫 Session doğrulama hatası:", err);
        setSession({ user: null, isAuthenticated: false });
        localStorage.removeItem("token");
      }
    };
    getSession(); // sayfa yüklenince token doğrula
  }, []);

  useEffect(() => {
    console.log("Session güncellendi:", session);
    if (session.isAuthenticated) {
      setIsAuthenticated(true);
    }
  }, [session]);

  // 🔻 KALDIRILDI: session.status kontrolü artık yok, ama benzeri logic Go auth geldiğinde tekrar eklenebilir
  /*
  useEffect(() => {
    if (status === "authenticated") {
      setIsAuthenticated(true);
      setIsLoaded(true);
    } else if (status === "unauthenticated") {
      setIsAuthenticated(false);
      setIsLoaded(true);
    } else if (status === "loading") {
      setIsLoaded(false);
    }
  }, [status]);
  */

  const handleAccountMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={`flex flex-col ${className}`} ref={buttonRef}>
      {/* 🔻 KALDIRILDI: session.user.image koşulu yerine null kontrolü */}
      {/* 💡 Auth eklendiğinde burası yeniden açılır */}
      {isAuthenticated && session?.user?.image ? (
        <Image
          className="rounded-full cursor-pointer"
          src={session.user.image}
          width={30}
          height={30}
          onClick={handleAccountMenu}
          alt="User Image"
        />
      ) : (
        <BiUserCircle
          className="cursor-pointer dark:text-white text-black"
          size="30"
          onClick={handleAccountMenu}
        />
      )}

      {!isLoaded
        ? isOpen && <div>Yükleniyor...</div>
        : isOpen && (
            <div className="z-50 absolute flex flex-col w-auto top-20 right-7 py-2 px-2 rounded-xl dark:bg-slate-900 bg-slate-400">
              {Items.map((item, i) => {
                if (item.requireAuth && !isAuthenticated) return null;
                if (
                  item.role &&
                  !item.role.includes(session?.user?.role?.toLowerCase() ?? "")
                )
                  return null;
                if (!item.showOnAuth && isAuthenticated) return null;

                return (
                  <Link
                    key={i}
                    href={item.href}
                    className="flex flex-row justify-between cursor-pointer p-3 rounded-lg font-semibold hover:border-lime-300 border-l-transparent border-b-transparent border-b-4 border-l-4"
                  >
                    <h3 className="w-full mr-2">{item.name}</h3>
                    {item.icon}
                  </Link>
                );
              })}

              {isAuthenticated && (
                <Link
                  href="/logout" // 🔧 signOut yerine kendi çıkış yönlendirmen eklenecek
                  // onClick={() => signOut()} // ❌ kaldırıldı, backend'e logout endpoint gelince düzenlenir
                  className="flex flex-row justify-between cursor-pointer p-3 rounded-lg font-semibold hover:border-lime-300 border-l-transparent border-b-transparent border-b-4 border-l-4"
                >
                  <h3 className="w-full mr-2">Sign Out</h3>
                  <RiLogoutCircleRLine size="25px" />
                </Link>
              )}

              <div className="border-2 border-red-500 rounded-lg p-4 animate-pulse mt-2">
                <h1 className="text-lg font-bold">
                  {isAuthenticated
                    ? `Hello ${
                        session?.user?.firstname ??
                        session?.user?.username ??
                        "user"
                      }`
                    : "Hello User"}
                </h1>
                <p>This is Project Page</p>
              </div>
            </div>
          )}

      {data === "role" && session?.user?.role && (
        <span className="text-md font-semibold">{session.user.role}</span>
      )}

      {children}
    </div>
  );
};

export default AccountMenu;
