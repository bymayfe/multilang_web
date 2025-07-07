"use client";
import { useEffect } from "react";
import { projectsData } from "@/libs/homepage/data/projects-data";
import ProjectCard from "./project-card";

import AOS from "aos";
import "aos/dist/aos.css";

import Image from "next/image"; // 🔧 Görsel bileşen import edildi
import sectionSVG from "@/images/svg/section.svg"; // 🔧 Arka plan SVG import edildi

const Projects = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div
      id="projects"
      className="relative my-12 lg:my-24 bg-gray-50 dark:bg-[#0d1224]" // 🔧 Arka plan tema uyumlu şekilde eklendi
      data-aos="fade-up"
    >
      <Image
        src={sectionSVG}
        alt="Projects Background"
        width={1572}
        height={795}
        className="absolute top-0 -z-10"
      />{" "}
      {/* 🔧 Arka plan görseli yerleştirildi */}
      {/* ✨ BAŞLIK ALANI DÜZENLENDİ */}
      <div
        className="sticky top-10 z-10"
        data-aos="fade-up"
        data-aos-anchor-placement="top-right"
      >
        {/* Glow efekti */}
        <div className="w-[80px] h-[80px] bg-violet-200 dark:bg-violet-400 rounded-full absolute -top-3 left-0 translate-x-1/2 filter blur-3xl opacity-40" />
        {/* 🔧 Light mode'da daha açık, dark'ta biraz doygun blur eklendi */}

        <div className="flex items-center justify-start relative">
          {/* BAŞLIK BLOĞU */}
          <span className="z-10 relative bg-white dark:bg-[#1a1443] text-gray-800 dark:text-white px-5 py-3 text-xl rounded-md shadow-md">
            {/* 🔧 Tema uyumlu arka plan ve yazı rengi + gölge */}
            PROJECTS
          </span>
          <div className="flex-1 h-[2px] ml-2 bg-gray-300 dark:bg-violet-800 rounded-sm" />
          {/* 🔧 Çizgi çizimi tema uyumlu hale getirildi */}
        </div>
      </div>
      {/* PROJE KARTLARI */}
      <div className="mt-10 space-y-12">
        {projectsData.map((project, index) => (
          <div
            key={index}
            className="sticky-card w-full mx-auto max-w-2xl sticky"
            style={{ "--StickyIndex": index + 1 } as React.CSSProperties}
          >
            <div className="box-border flex items-center justify-center rounded shadow-md dark:shadow-lg transition-all duration-500">
              <ProjectCard project={project} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
