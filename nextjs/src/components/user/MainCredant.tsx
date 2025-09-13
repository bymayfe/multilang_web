import React from "react";

interface MainCredantProps {
  children: React.ReactNode;
  className?: string;
}

const MainCredant = ({ children, className }: MainCredantProps) => {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden w-full h-full ${className}`}
    >
      <div className="flex relative items-center justify-center w-[26rem] h-[30rem] group/circle">
        <i className=" inset-0 absolute transition-[0.5s] border-2 border-solid dark:border-white border-black animate-rotateRing rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%] group-hover/circle:border-[#00ff0a] group-hover/circle:border-4"></i>
        <i className=" inset-0 absolute transition-[0.5s] border-2 border-solid dark:border-white border-black animate-rotateRing2 rounded-[41%_44%_56%_59%/38%_62%_63%_37%] group-hover/circle:border-[#ff0057] group-hover/circle:border-4"></i>
        <i className=" inset-0 absolute transition-[0.5s] border-2 border-solid dark:border-white border-black animate-rotateRingReverse rounded-[41%_44%_56%_59%/38%_62%_63%_37%] group-hover/circle:border-[#fffd44] group-hover/circle:border-4"></i>
        {children}
      </div>
    </div>
  );
};

export default MainCredant;
