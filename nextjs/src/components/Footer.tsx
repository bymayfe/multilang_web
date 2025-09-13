import Link from "next/link";
import { personalData } from "@/libs/homepage/data/personal-data";

function Footer() {
  return (
    <div className="relative border-t bg-gray-100 dark:bg-[#0d1224] border-gray-300 dark:border-[#353951] text-gray-800 dark:text-white">
      {/* 🔧 Arka plan, border ve yazı rengi tema uyumlu hale getirildi */}
      <div className="mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] py-6 lg:py-10">
        <div className="flex justify-center -z-40">
          <div className="absolute top-0 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center">
          <p className="text-sm">
            Developed by{" "}
            <Link
              target="_blank"
              href={personalData.github}
              className="text-teal-600 dark:text-[#16f2b3]" // 🔧 Link rengi tema uyumlu
            >
              MayFe
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
