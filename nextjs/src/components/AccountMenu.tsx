"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import { MdAdminPanelSettings } from "react-icons/md";
import { PiSpotifyLogoBold } from "react-icons/pi";
import { FaSpotify } from "react-icons/fa";
import { RiLoginCircleLine, RiLogoutCircleRLine } from "react-icons/ri";
import Image from "next/image";

import { useAuth } from "@/providers/AuthProvider/hook"; // 🔻 EKLENDİ: Auth provider import edildi

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
    name: "Sign Out",
    href: "/user/logout",
    key: "logout",
    icon: <RiLogoutCircleRLine size="25px" />,
    showOnAuth: true,
    requireAuth: true,
  },
  {
    name: "Sign In",
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

const AccountMenu = ({ className, children, data }: AccountMenuProps) => {
  const { session, status } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
    console.log("Auth status changed:", status);
    if (status === "authenticated") {
      setIsLoaded(true);
      setIsAuthenticated(true);
    } else if (status === "unauthenticated") {
      setIsLoaded(true);
      setIsAuthenticated(false);
    }
  }, [status]);

  useEffect(() => {
    console.log("Session changed:", session);
  }, [session]);

  const handleAccountMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // const signOutFunction = () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return;
  //   localStorage.removeItem("token");
  //   signOut(token);
  // };

  return (
    <div className={`flex flex-col ${className}`} ref={buttonRef}>
      {isAuthenticated && session?.user?.image ? (
        <Image
          className="rounded-full cursor-pointer w-[30px] h-[30px]"
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
              {/* 
              {isAuthenticated && (
                <Link
                  // href="/logout"
                  href="#"
                  onClick={() => signOutFunction()}
                  className="flex flex-row justify-between cursor-pointer p-3 rounded-lg font-semibold hover:border-lime-300 border-l-transparent border-b-transparent border-b-4 border-l-4"
                >
                  <h3 className="w-full mr-2">Sign Out</h3>
                  <RiLogoutCircleRLine size="25px" />
                </Link>
              )} */}

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
