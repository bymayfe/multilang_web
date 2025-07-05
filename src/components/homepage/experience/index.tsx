"use client";
import { experiences } from "@/libs/homepage/data/experience";
import Image from "next/image";
import { BsPersonWorkspace } from "react-icons/bs";
import AnimationLottie from "@/components/homepage/helper/animation-lottie";
import GlowCard from "@/components/homepage/helper/glow-card";
import experience from "@/images/lottie/code.json";

import sectionSVG from "@/images/svg/section.svg";
import blur23SVG from "@/images/svg/blur-23.svg";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function Experience() {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div
      id="experience"
      className="relative border-t my-12 lg:my-24 border-[#25213b]"
      data-aos="fade-up"
    >
      <Image
        src={sectionSVG}
        alt="Hero"
        width={1572}
        height={795}
        className="absolute top-0 -z-10"
      />

      <div
        className="flex justify-center my-5 lg:py-8"
        data-aos="fade-up"
        data-aos-anchor-placement="top-center"
      >
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">
            Experiences
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="py-8" data-aos="fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex justify-center items-start">
            <div className="w-full h-full">
              <AnimationLottie animationPath={experience} />
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-6">
              {experiences.map((experience) => (
                <GlowCard
                  key={experience.id}
                  identifier={`experience-${experience.id}`}
                >
                  <div className="p-3 relative">
                    <Image
                      src={blur23SVG}
                      alt="Hero"
                      width={1080}
                      height={200}
                      className="absolute bottom-0 opacity-80"
                    />
                    <div className="flex justify-center">
                      <p className="text-xs sm:text-sm text-[#16f2b3]">
                        {experience.duration}
                      </p>
                    </div>
                    <div className="flex items-center gap-x-8 px-3 py-5">
                      <div className="text-violet-500  transition-all duration-300 hover:scale-125">
                        <BsPersonWorkspace size={36} />
                      </div>
                      <div>
                        <p className="text-base sm:text-xl mb-2 font-medium uppercase">
                          {experience.title}
                        </p>
                        <p className="text-sm sm:text-base">
                          {experience.company}
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

export default Experience;
