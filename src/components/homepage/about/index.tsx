"use client";
import { personalData } from "@/libs/homepage/data/personal-data";
import Image from "next/image";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import sectionSVG from "@/images/svg/section.svg"; // 🔧 Arka plan görseli eklendi

function AboutSection() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div
      id="about"
      className="my-12 lg:my-16 relative bg-gray-50 dark:bg-[#0d1224]" // 🔧 arka plan tema uyumlu hale getirildi
      data-aos="fade-down"
    >
      <Image
        src={sectionSVG}
        alt="Section Background"
        width={1572}
        height={795}
        className="absolute top-0 -z-10"
      />{" "}
      {/* 🔧 SVG arka plan görseli yerleştirildi */}
      <div
        className="hidden lg:flex flex-col items-center absolute top-16 -right-8"
        data-aos="fade-left"
      >
        <span className="bg-white dark:bg-[#1a1443] text-gray-800 dark:text-white w-fit rotate-90 p-2 px-5 text-xl rounded-md shadow-sm">
          {/* 🔧 başlık kutusu tema uyumlu */}
          ABOUT ME
        </span>
        <span className="h-36 w-[2px] bg-gray-300 dark:bg-[#1a1443]" />
        {/* 🔧 çizgi tema uyumlu */}
      </div>
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16"
        data-aos="fade-up"
      >
        <div className="order-2 lg:order-1">
          <p className="font-medium mb-5 text-teal-600 dark:text-[#16f2b3] text-xl uppercase">
            {/* 🔧 vurgu rengi tema uyumlu */}
            Who I am?
          </p>
          <p className="text-gray-800 dark:text-gray-200 text-sm lg:text-lg">
            {/* 🔧 açıklama metni renkleri tema uyumlu */}
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
