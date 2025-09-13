"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "@/providers/AuthProvider/hook";

type RegisterProps = {
  className?: string;
};

const Register = ({ className }: RegisterProps) => {
  const { signUp, session } = useAuth();
  const router = useRouter();

  const [hidden, setHidden] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const toggleEye = () => setHidden((prev) => !prev);
  const goLogin = () => router.push("/user/login");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signUp({ firstname, lastname, email, password });

      if (result.success) {
        setSuccess(true);
        setError(null);
        router.push("/home"); // başarılı kayıt sonrası yönlendirme
      } else {
        setSuccess(false);
        setError(result.message || "Kayıt başarısız!");
      }
    } catch (err) {
      console.error("SignUp error:", err);
      setSuccess(false);
      setError("Beklenmedik bir hata oluştu");
    }
  };

  // 🔑 Eğer session varsa → otomatik yönlendir
  useEffect(() => {
    if (session?.token) {
      router.push("/"); // istersen /home yapabilirsin
    }
  }, [session, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Eğer mount olmamış veya session varsa → null döndür
  if (!mounted || session?.token) return null;

  return (
    <div
      className={`flex flex-col absolute items-center justify-center dark:text-white text-black ${className}`}
    >
      <h2 className="text-5xl p-2 mb-6">Register</h2>

      {!success && error && (
        <h3 className="font-bold text-red-500 mb-2 text-lg">{error}</h3>
      )}
      {success && (
        <h3 className="font-bold text-green-500 mb-2 text-lg">
          Success! Wait for redirecting...
        </h3>
      )}

      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="flex flex-row mb-2">
          <div className="rounded-lg border py-2 px-3 mr-2">
            <input
              className="w-28 h-10 focus:outline-none bg-transparent"
              placeholder="Firstname"
              name="firstname"
              type="text"
              required
            />
          </div>
          <div className="rounded-lg border py-2 px-3">
            <input
              className="w-28 h-10 focus:outline-none bg-transparent"
              placeholder="Lastname"
              name="lastname"
              type="text"
              required
            />
          </div>
        </div>
        <div className="border rounded-lg py-2 px-3 mb-2">
          <input
            className="w-64 h-10 focus:outline-none bg-transparent"
            placeholder="Email"
            name="email"
            type="email"
            required
          />
        </div>
        <div className="flex items-center justify-center flex-row border rounded-lg p-2 mb-2">
          <input
            className="w-60 h-10 focus:outline-none bg-transparent"
            placeholder="Password"
            name="password"
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
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover/button:scale-x-100 transition-transform duration-1000 origin-left"></span>
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-indigo-400 rotate-12 transform scale-x-0 group-hover/button:scale-x-100 transition-transform duration-700 origin-left"></span>
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-indigo-600 rotate-12 transform scale-x-0 group-hover/button:scale-x-50 transition-transform duration-500 origin-left"></span>
              <span className="group-hover/button:opacity-100 duration-100 opacity-0 absolute top-2.5 left-6 z-10">
                Register!
              </span>
            </button>
          </div>
          <button
            className="cursor-not-allowed relative group overflow-hidden border-2 px-8 py-2 border-green-500 rounded-lg"
            type="button"
          >
            <span className="font-bold text-lg relative z-10 group-hover:text-green-500 duration-500">
              Spotify
            </span>
            <span className="absolute top-0 left-0 w-full bg-green-500 duration-500 group-hover:-translate-x-full h-full"></span>
            <span className="absolute top-0 left-0 w-full bg-green-500 duration-500 group-hover:translate-x-full h-full"></span>
            <span className="absolute top-0 left-0 w-full bg-green-500 duration-500 delay-300 group-hover:-translate-y-full h-full"></span>
            <span className="absolute delay-300 top-0 left-0 w-full bg-green-500 duration-500 group-hover:translate-y-full h-full"></span>
          </button>
        </div>
      </form>
      <div className="flex flex-row">
        <h2 className="text-lg mt-2 mr-2">Have an account ?</h2>
        <button
          onClick={goLogin}
          className="relative hover:text-[#778464] py-2 px-6 after:absolute after:h-1 after:hover:h-[200%] transition-all duration-500 overflow-hidden z-20 after:z-[-20] after:bg-[#abd373] after:rounded-t-full after:w-full after:bottom-0 after:left-0"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Register;
