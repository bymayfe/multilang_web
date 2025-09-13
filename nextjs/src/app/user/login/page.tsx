// app/login/page.tsx
// import { redirect } from "next/navigation";
// import { getServerSession } from "@/providers/AuthProvider/storage"; // SSR session fonksiyonun

import MainCredant from "@/components/user/MainCredant";
import Login from "@/components/user/Login";
import Navbar from "@/components/NavBar";

export default async function Page() {
  //   const session = await getServerSession();

  //   if (session) {
  //     redirect("/"); // SSR yönlendirme
  //   }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full dark:bg-[#111]">
      <Navbar className={"py-2 px-10 w-full"} />
      <MainCredant className="z-0">
        <Login className="z-10" />
      </MainCredant>
    </div>
  );
}
