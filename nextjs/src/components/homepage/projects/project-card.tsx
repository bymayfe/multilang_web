import Link from "next/link";
import * as React from "react";

interface ProjectCardProps {
  project: Record<string, any>;
}

function ProjectCard({ project }: ProjectCardProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  const orderedKeys = [
    "name",
    "mainLanguage",
    "description",
    "tools",
    "role",
    ...Object.keys(project).filter(
      (key) =>
        ![
          "id",
          "name",
          "mainLanguage",
          "description",
          "tools",
          "github",
          "live",
          "role",
        ].includes(key) &&
        project[key] !== "" &&
        project[key] !== undefined
    ),
  ];

  return (
    <div className="from-[#f9fafb] to-white dark:from-[#0d1224] dark:to-[#0a0d37] border border-gray-200 dark:border-[#1b2c68a0] rounded-lg bg-gradient-to-r w-full relative">
      {/* Başlık ve toggle butonu */}
      <div className="flex items-center justify-between px-4 lg:px-8 py-3 lg:py-5 relative">
        <div className="flex flex-row space-x-1 lg:space-x-2 items-center">
          <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-red-400" />
          <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-orange-400" />
          <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-green-200" />
          <p className="ml-3 text-[#0d9488] dark:text-[#16f2b3] text-base lg:text-xl font-semibold">
            {project.name}
          </p>
        </div>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls={`project-content-${project.name}`}
          className="px-3 py-1 bg-violet-600 text-white rounded-md shadow hover:bg-violet-700 transition"
        >
          {isOpen ? "Hide" : "Show"}
        </button>
      </div>

      {/* İçerik */}
      <div
        id={`project-content-${project.name}`}
        className={`overflow-hidden border-t-[2px] border-indigo-200 dark:border-indigo-900 px-4 lg:px-8 py-4 lg:py-8 transition-all duration-500 ${
          isOpen ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ transitionProperty: "max-height, opacity" }}
      >
        <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm lg:text-base text-gray-800 dark:text-white">
          <span className="text-pink-500">const</span>{" "}
          <span className="text-white">project</span>{" "}
          <span className="text-pink-500">=</span>{" "}
          <span className="text-gray-500">{"{"}</span>
          {"\n"}
          {orderedKeys.map((key, i) =>
            project[key] !== "" && project[key] !== undefined ? (
              <span key={i} className="ml-4 block">
                <span className="text-white">{key}</span>:{" "}
                {Array.isArray(project[key]) ? (
                  <>
                    <span className="text-gray-500">[</span>
                    {project[key].map((item: string, idx: number) => (
                      <React.Fragment key={idx}>
                        <span className="text-amber-500">{`'${item}'`}</span>
                        {idx < project[key].length - 1 && (
                          <span className="text-gray-500">, </span>
                        )}
                      </React.Fragment>
                    ))}
                    <span className="text-gray-500">]</span>
                  </>
                ) : (
                  <span className="text-cyan-400">{` '${project[key]}'`}</span>
                )}
                <span className="text-gray-500">,</span>
                {"\n"}
              </span>
            ) : null
          )}
          {project.github && (
            <span className="ml-4 block">
              github:{" "}
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 underline"
              >
                {project.github.replace("https://", "")}
              </Link>
              <span className="text-gray-500">,</span>
              {"\n"}
            </span>
          )}
          {project.live && (
            <span className="ml-4 block">
              <span className="text-red-400">LIVE</span>:{" "}
              <Link
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 underline"
              >
                {project.live.replace("https://", "")}
              </Link>
              <span className="text-gray-500">,</span>
              {"\n"}
            </span>
          )}
          <span className="text-gray-500">{"};"}</span>
        </pre>
      </div>
    </div>
  );
}

export default ProjectCard;
