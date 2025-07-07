import Link from "next/link";
import * as React from "react";

interface ProjectCardProps {
  project: Record<string, any>;
}

function ProjectCard({ project }: ProjectCardProps) {
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
    <div className="from-[#f9fafb] to-white dark:from-[#0d1224] dark:to-[#0a0d37] border border-gray-200 dark:border-[#1b2c68a0] rounded-lg bg-gradient-to-r w-full">
      {/* Dekoratif çizgiler */}
      <div className="flex flex-row">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500 to-violet-600" />
        <div className="h-[1px] w-full bg-gradient-to-r from-violet-600 to-transparent" />
      </div>

      {/* Başlık */}
      <div className="px-4 lg:px-8 py-3 lg:py-5 relative">
        <div className="flex flex-row space-x-1 lg:space-x-2 absolute top-1/2 -translate-y-1/2">
          <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-red-400" />
          <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-orange-400" />
          <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-green-200" />
        </div>
        <p className="text-center ml-3 text-[#0d9488] dark:text-[#16f2b3] text-base lg:text-xl">
          {project.name}
        </p>
      </div>

      {/* İçerik */}
      <div className="overflow-hidden border-t-[2px] border-indigo-200 dark:border-indigo-900 px-4 lg:px-8 py-4 lg:py-8">
        <code className="font-mono text-xs md:text-sm lg:text-base">
          <div className="blink">
            <span className="mr-2 text-pink-500">const</span>
            <span className="mr-2 text-gray-800 dark:text-white">project</span>
            <span className="mr-2 text-pink-500">=</span>
            <span className="text-gray-500 dark:text-gray-400">{"{"}</span>
          </div>

          {orderedKeys.map((key, i) =>
            project[key] !== "" && project[key] !== undefined ? (
              <div key={i} className="ml-4 lg:ml-8 mr-2">
                <span className="text-gray-800 dark:text-white">{key}:</span>{" "}
                {Array.isArray(project[key]) ? (
                  <>
                    <span className="text-gray-500 dark:text-gray-400">[</span>
                    {project[key].map((item: string, idx: number) => (
                      <React.Fragment key={idx}>
                        <span className="text-amber-500 dark:text-amber-300">{`'${item}'`}</span>
                        {idx < project[key].length - 1 && (
                          <span className="text-gray-500 dark:text-gray-400">
                            ,{" "}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                    <span className="text-gray-500 dark:text-gray-400">]</span>
                  </>
                ) : (
                  <span className="text-cyan-600 dark:text-cyan-400">{` '${project[key]}'`}</span>
                )}
                <span className="text-gray-500 dark:text-gray-400">,</span>
              </div>
            ) : null
          )}

          {/* GitHub */}
          {project.github && (
            <div className="ml-4 lg:ml-8 mr-2">
              <span className="text-gray-800 dark:text-white">github:</span>{" "}
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 dark:text-green-400 hover:underline"
              >
                {" " + project.github.replace("https://", "")}
              </Link>
              <span className="text-gray-500 dark:text-gray-400">,</span>
            </div>
          )}

          {/* Live */}
          {project.live && (
            <div className="ml-4 lg:ml-8 mr-2">
              <span className="text-red-500">LIVE:</span>{" "}
              <Link
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 dark:text-green-400 hover:underline"
              >
                {" " + project.live.replace("https://", "")}
              </Link>
              <span className="text-gray-500 dark:text-gray-400">,</span>
            </div>
          )}

          <div>
            <span className="text-gray-500 dark:text-gray-400">{"};"}</span>
          </div>
        </code>
      </div>
    </div>
  );
}

export default ProjectCard;
