"use client";

import { useEffect } from "react";
import { projectsData } from "@/libs/homepage/data/projects-data";
import ProjectCard from "./project-card";

import AOS from "aos";
import "aos/dist/aos.css";

import Image from "next/image";
import sectionSVG from "@/images/svg/section.svg";

const Projects = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div
      id="projects"
      className="relative my-12 lg:my-24 bg-gray-50 dark:bg-[#0d1224] py-5"
      data-aos="fade-up"
    >
      {/* 🔧 Arka plan SVG */}
      <Image
        src={sectionSVG}
        alt="Projects Background"
        width={1572}
        height={795}
        className="absolute top-0 -z-10"
      />

      {/* 🔥 Başlık alanı */}
      <div
        className="sticky top-10 z-10 px-4"
        data-aos="fade-up"
        data-aos-anchor-placement="top-right"
      >
        <div className="w-[80px] h-[80px] bg-violet-200 dark:bg-violet-400 rounded-full absolute -top-3 left-0 translate-x-1/2 filter blur-3xl opacity-40" />

        <div className="flex items-center justify-start relative">
          <span className="z-10 relative bg-white dark:bg-[#1a1443] text-gray-800 dark:text-white px-5 py-3 text-xl rounded-md shadow-md">
            PROJECTS
          </span>
          <div className="flex-1 h-[2px] ml-2 bg-gray-300 dark:bg-violet-800 rounded-sm" />
        </div>
      </div>

      {/* ✅ Kartlar mobilde üst üste, kesinti olmadan */}
      <div className="mt-10 flex flex-col items-center gap-10 px-4 sm:px-0">
        {projectsData.map((project, index) => (
          <div key={index} className="w-full max-w-2xl">
            <div className="rounded shadow-md dark:shadow-lg transition-all duration-500 overflow-hidden">
              <ProjectCard project={project} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
