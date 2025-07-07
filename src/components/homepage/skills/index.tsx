"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import Marquee from "react-fast-marquee";

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
      className="relative border-t my-12 lg:my-24 border-[#25213b]"
    >
      <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl opacity-20" />

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
          <span className="w-24 h-[2px] bg-[#1a1443]" />
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">
            Skills
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]" />
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
              <div className="h-full w-full rounded-lg border border-[#1f223c] bg-[#11152c] group-hover:border-violet-500 transition-all duration-500">
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
                    className="rounded-lg" // 🔥 w-auto veya h-full gibi oran bozucu class yok
                    unoptimized // Eğer local dosya kullanıyorsan bu eklenmeli
                  />

                  <p className="text-white text-sm sm:text-lg">{skill.name}</p>
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
