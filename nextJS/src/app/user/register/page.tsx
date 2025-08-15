// "use client";
// import React from "react";
// import Register from "@/components/user/Register";
// import MainCredant from "@/components/user/MainCredant";
// import { useSession } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Navbar from "@/components/NavBar";

// const Page = () => {
//   const router = useRouter();
//   const session = useSession();

//   if (session.status === "authenticated") return router.push("/");
//   return (
//     session.status === "unauthenticated" && (
//       <div className="flex flex-col items-center justify-center w-full h-full dark:bg-[#111]">
//         <Navbar className={"py-2 px-10 w-full"} />
//         <MainCredant className="z-0">
//           <Register className="z-10" />
//         </MainCredant>
//       </div>
//     )
//   );
// };

// export default Page;

// "use client"

import React from "react";
import Register from "@/components/user/Register";
import MainCredant from "@/components/user/MainCredant";
// import { useSession } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/NavBar";

const app = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full dark:bg-[#111]">
      <Navbar className={"py-2 px-10 w-full"} />
      <MainCredant className="z-0">
        <Register className="z-10" />
      </MainCredant>
    </div>
  );
};

export default app;
