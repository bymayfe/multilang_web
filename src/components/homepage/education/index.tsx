"use client";
import Image from "next/image";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { educations } from "@/libs/homepage/data/educations";
import AnimationLottie from "@/components/homepage/helper/animation-lottie";
import GlowCard from "@/components/homepage/helper/glow-card";

import lottieFile from "@/images/lottie/study.json";
import sectionSVG from "@/images/svg/section.svg";
import blur23SVG from "@/images/svg/blur-23.svg";

function Education() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div
      id="education"
      className="relative border-t my-12 lg:my-24 border-gray-300 dark:border-[#25213b] bg-gray-50 dark:bg-[#0d1224] px-5" // ✨ değişiklik: arka plan ve border tema uyumlu hale getirildi
      data-aos="fade-down"
    >
      <Image
        src={sectionSVG}
        alt="Section Decor"
        width={1572}
        height={795}
        className="absolute top-0 -z-10"
      />

      {/* Gradient divider */}
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>

      {/* Section Heading */}
      <div
        className="flex justify-center my-5 lg:py-8"
        data-aos="fade-up"
        data-aos-anchor-placement="top-center"
      >
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-gray-300 dark:bg-[#1a1443]" />{" "}
          {/* ✨ değişiklik: çizgi rengi tema duyarlı */}
          <span className="bg-gray-100 dark:bg-[#1a1443] text-gray-800 dark:text-white w-fit p-2 px-5 text-xl rounded-md shadow-sm">
            {" "}
            {/* ✨ değişiklik: başlık arka planı ve metin rengi tema uyumlu */}
            Educations
          </span>
          <span className="w-24 h-[2px] bg-gray-300 dark:bg-[#1a1443]" />{" "}
          {/* ✨ değişiklik: çizgi rengi tema duyarlı */}
        </div>
      </div>

      {/* Body */}
      <div className="py-8" data-aos="fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Lottie */}
          <div className="flex justify-center items-start">
            <div className="w-3/4 h-3/4">
              <AnimationLottie animationPath={lottieFile} />
            </div>
          </div>

          {/* Education cards */}
          <div>
            <div className="flex flex-col gap-6">
              {educations.map((education) => (
                <GlowCard
                  key={education.id}
                  identifier={`education-${education.id}`}
                >
                  <div className="p-3 relative text-gray-800 dark:text-white">
                    {" "}
                    {/* ✨ değişiklik: kart içi metin rengi tema uyumlu */}
                    <Image
                      src={blur23SVG}
                      alt="Card Glow"
                      width={1080}
                      height={200}
                      className="absolute bottom-0 opacity-80 pointer-events-none"
                    />
                    <div className="flex justify-center">
                      <p className="text-xs sm:text-sm text-teal-600 dark:text-[#16f2b3]">
                        {" "}
                        {/* ✨ değişiklik: tarih yazısı tema uyumlu */}
                        {education.duration}
                      </p>
                    </div>
                    <div className="flex items-center gap-x-8 px-3 py-5">
                      {/* Logo */}
                      <div className="text-violet-600 dark:text-violet-400 transition-all duration-300 hover:scale-110">
                        {" "}
                        {/* ✨ değişiklik: logo rengi tema uyumlu */}
                        <div className="w-15 h-15 rounded-full overflow-hidden">
                          <Image
                            src={education.logo}
                            alt="Logo"
                            width={80}
                            height={80}
                            className="opacity-80"
                          />
                        </div>
                      </div>

                      {/* School Info */}
                      <div>
                        <p className="text-base sm:text-xl mb-2 font-medium uppercase">
                          {education.title}
                        </p>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                          {" "}
                          {/* ✨ değişiklik: okul adı daha soft, tema uyumlu */}
                          {education.institution}
                        </p>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Education;
