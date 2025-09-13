"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "@/providers/AuthProvider/hook";

type LoginProps = {
  className?: string;
};

const Login = ({ className }: LoginProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signIn, session } = useAuth();

  const toggleEye = () => setHidden((prev) => !prev);

  const goRegister = () => router.push("/user/register");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget[0] as HTMLInputElement).value;
    const password = (e.currentTarget[1] as HTMLInputElement).value;

    try {
      const result = await signIn("credential", email, password);

      if (result.success) {
        setSuccess(true);
        setError(null);

        // 1.5-2 saniye success mesajı gösterip yönlendir
        setTimeout(() => router.push("/"), 3000);
      } else {
        setSuccess(false);
        setError(result.message || "Giriş başarısız");
      }
    } catch (err) {
      setSuccess(false);
      setError("Beklenmedik bir hata oluştu");
      console.error("Login catch error:", err);
    }
  };

  // 🔑 Eğer session varsa direkt redirect
  useEffect(() => {
    if (session?.token) {
      router.push("/"); // istersen dashboard veya home
    }
  }, [session, router]);

  useEffect(() => setMounted(true), []);

  if (!mounted || session?.token) return null; // burası success yazısını bypass ediyor

  const ErrCrd = searchParams.get("error")?.replace("Error: ", "");

  return (
    <div
      className={`flex flex-col absolute items-center justify-center dark:text-white text-black ${className}`}
    >
      <h2 className="text-5xl p-2 mb-6">Login</h2>

      {ErrCrd && (
        <h3 className="font-bold text-red-500 mb-2 text-lg">{ErrCrd}</h3>
      )}
      {error && !success && (
        <h3 className="font-bold text-red-500 mb-2 text-lg">{error}</h3>
      )}
      {success && (
        <h3 className="font-bold text-green-500 mb-2 text-lg">
          Başarıyla giriş yapıldı! Yönlendiriliyorsunuz...
        </h3>
      )}

      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="border rounded-lg p-2 mb-2">
          <input
            className="w-60 h-10 focus:outline-none bg-transparent"
            placeholder="Email"
            type="text"
            required
          />
        </div>
        <div className="flex items-center justify-center flex-row border rounded-lg p-2 mb-2">
          <input
            className="w-60 h-10 focus:outline-none bg-transparent"
            placeholder="Password"
            type={hidden ? "text" : "password"}
            required
          />
          {hidden ? (
            <FaEyeSlash
              size={25}
              className="hover:bg-slate-600 rounded-full duration-300 cursor-pointer"
              onClick={toggleEye}
            />
          ) : (
            <FaEye
              size={25}
              className="hover:bg-slate-600 rounded-full duration-300 cursor-pointer"
              onClick={toggleEye}
            />
          )}
        </div>
        <div className="flex flex-row">
          <div className="border rounded-lg p-2 mr-2">
            <button
              className="overflow-hidden w-32 p-2 h-12 bg-black text-white border-none rounded-md text-xl font-bold cursor-pointer relative z-10 group/button"
              type="submit"
            >
              I'm Ready
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover/button:scale-x-100 transition-transform group-hover/button:duration-500 duration-1000 origin-left"></span>
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-indigo-400 rotate-12 transform scale-x-0 group-hover/button:scale-x-100 transition-transform group-hover/button:duration-700 duration-700 origin-left"></span>
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-indigo-600 rotate-12 transform scale-x-0 group-hover/button:scale-x-50 transition-transform group-hover/button:duration-1000 duration-500 origin-left"></span>
              <span className="group-hover/button:opacity-100 group-hover/button:duration-1000 duration-100 opacity-0 absolute top-2.5 left-6 z-10">
                Log In!
              </span>
            </button>
          </div>
        </div>
      </form>

      <div className="flex flex-row mt-2">
        <h2 className="text-lg mt-2 mr-2">Haven't an account?</h2>
        <button
          onClick={goRegister}
          className="relative hover:text-[#778464] py-2 px-6 after:absolute after:h-1 after:hover:h-[200%] transition-all duration-500 overflow-hidden z-20 after:z-[-20] after:bg-[#abd373] after:rounded-t-full after:w-full after:bottom-0 after:left-0"
        >
          Register
        </button>
      </div>
      <h3 className="hover:underline text-lg mt-2">Forgot your password?</h3>
    </div>
  );
};

export default Login;
