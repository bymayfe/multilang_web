"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import Marquee from "react-fast-marquee";

import sectionSVG from "@/images/svg/section.svg"; // 🔧 Arka plan SVG import

interface Skill {
  name: string;
  image: string;
}

function Skills({ skills }: { skills: Skill[] }) {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div
      id="skills"
      className="relative border-t my-12 lg:my-24 border-gray-300 dark:border-[#25213b] bg-gray-50 dark:bg-[#0d1224] px-5" // 🔧 Arka plan ve border tema duyarlı
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={sectionSVG}
          alt="Section Background"
          width={1572}
          height={795}
          className="w-full h-auto object-cover opacity-80 dark:opacity-50"
          // 🔧 Light modda daha belirgin mor degrade için opacity artırıldı
        />
      </div>

      <div className="w-[100px] h-[100px] bg-violet-300 dark:bg-violet-500 rounded-full absolute top-6 left-1/2 -translate-x-1/2 filter blur-3xl opacity-30" />
      {/* 🔧 Blur efekti ortalandı ve mor tonu kuvvetlendirildi */}

      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>

      <div
        className="flex justify-center my-5 lg:py-8"
        data-aos="fade-up"
        data-aos-anchor-placement="top-center"
      >
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-gray-300 dark:bg-[#1a1443]" />{" "}
          {/* 🔧 Tema uyumlu çizgi */}
          <span className="bg-white dark:bg-[#1a1443] text-gray-800 dark:text-white w-fit p-2 px-5 text-xl rounded-md shadow-sm">
            {/* 🔧 Başlık görünürlüğü arttırıldı */}
            Skills
          </span>
          <span className="w-24 h-[2px] bg-gray-300 dark:bg-[#1a1443]" />{" "}
          {/* 🔧 Tema uyumlu çizgi */}
        </div>
      </div>

      <div className="w-full my-12">
        <Marquee
          gradient={false}
          speed={100}
          pauseOnHover
          pauseOnClick
          direction="left"
        >
          {skills.map((skill, id) => (
            <div
              key={id}
              data-aos="fade-up"
              className="w-36 min-w-fit h-fit flex flex-col items-center justify-center transition-all duration-500 m-3 sm:m-5 rounded-lg group hover:scale-[1.15] cursor-pointer"
            >
              <div className="h-full w-full rounded-lg border border-gray-300 dark:border-[#1f223c] bg-white dark:bg-[#11152c] group-hover:border-violet-500 transition-all duration-500">
                {/* 🔧 Kart arkaplan ve border renkleri tema duyarlı */}
                <div className="flex justify-center -translate-y-[1px]">
                  <div className="w-3/4">
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 p-6">
                  <Image
                    src={skill.image}
                    alt={skill.name}
                    width={40}
                    height={40}
                    className="rounded-lg"
                    unoptimized
                  />
                  <p className="text-gray-800 dark:text-white text-sm sm:text-lg">
                    {/* 🔧 Yazı rengi tema uyumlu */}
                    {skill.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

export default Skills;
