"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import AOS from "aos";
import "aos/dist/aos.css";

// interface ChangeThemeProps {
//   className?: string;
// }

const ChangeTheme = ({ className }: { className?: string }) => {
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  const themeMode = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className={className} data-aos="fade-down">
      {mounted &&
        (themeMode === "dark" ? (
          <BsFillMoonStarsFill
            className="cursor-pointer"
            size={25}
            onClick={() => setTheme("light")}
            data-aos="flip-down"
          />
        ) : (
          <BsFillSunFill
            color="black"
            className="cursor-pointer"
            size={25}
            onClick={() => setTheme("dark")}
            data-aos="flip-up"
          />
        ))}
    </div>
  );
};

export default ChangeTheme;
