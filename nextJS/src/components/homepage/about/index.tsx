"use client";
import { personalData } from "@/libs/homepage/data/personal-data";
import Image from "next/image";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function AboutSection() {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div id="about" className="my-12 lg:my-16 relative" data-aos="fade-down">
      <div
        className="hidden lg:flex flex-col items-center absolute top-16 -right-8"
        data-aos="fade-left"
      >
        <span className="bg-gray-200 dark:bg-[#1a1443] text-gray-800 dark:text-white rotate-90 px-5 py-2 text-xl rounded-md shadow-sm">
          ABOUT ME
        </span>
        <span className="h-36 w-[2px] bg-[#1a1443]"></span>
      </div>
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16"
        data-aos="fade-up"
      >
        <div className="order-2 lg:order-1">
          <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">
            Who I am?
          </p>
          <p className="dark:text-gray-200 text-black text-sm lg:text-lg">
            {personalData.description}
          </p>
        </div>
        <div className="flex justify-center order-1 lg:order-2">
          <Image
            src={personalData.profile}
            width={280}
            height={280}
            alt="Seyfettin Budak"
            className="rounded-lg transition-all duration-1000 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
