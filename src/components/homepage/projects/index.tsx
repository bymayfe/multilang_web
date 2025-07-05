"use client";
import { projectsData } from "@/libs/homepage/data/projects-data";
import ProjectCard from "./project-card";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Projects = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div id="projects" className="relative my-12 lg:my-24" data-aos="fade-up">
      <div
        className="sticky top-10"
        data-aos="fade-up"
        data-aos-anchor-placement="top-right"
      >
        <div className="w-[80px] h-[80px] bg-violet-100 rounded-full absolute -top-3 left-0 translate-x-1/2 filter blur-3xl  opacity-30"></div>
        <div className="flex items-center justify-start relative">
          <span className="bg-[#1a1443] absolute left-0  w-fit text-white px-5 py-3 text-xl rounded-md">
            PROJECTS
          </span>
          <span className="w-full h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="pt-24">
        <div className="flex flex-col gap-6">
          {projectsData.slice(0, 5).map((project, index) => (
            <div
              id={`sticky-card-${index + 1}`}
              key={index}
              className="sticky-card w-full mx-auto max-w-2xl sticky"
            >
              <div className="box-border flex items-center justify-center rounded shadow-[0_0_30px_0_rgba(0,0,0,0.3)] transition-all duration-[0.5s]">
                <ProjectCard project={project} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
