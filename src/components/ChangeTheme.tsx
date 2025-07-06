"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from "next-themes";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { LuMonitor } from "react-icons/lu";
import AOS from "aos";
import "aos/dist/aos.css";

const themes = ["light", "dark", "system"] as const;

const ChangeTheme = ({ className }: { className?: string }) => {
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    AOS.init();
  }, []);

  const currentTheme = useMemo(() => {
    return theme === "system" ? systemTheme : theme;
  }, [theme, systemTheme]);

  if (!mounted) return null;

  const handleClick = () => {
    const currentIndex = themes.indexOf(theme as (typeof themes)[number]);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <div
      className={`cursor-pointer transition-transform hover:scale-110 ${className}`}
      onClick={handleClick}
      title={`Change Theme (Current: ${theme})`}
      data-aos="fade-down"
    >
      {theme === "light" ? (
        <BsFillSunFill
          size={24}
          color="#eab308" // Sarı
          data-aos="fade-up"
        />
      ) : theme === "dark" ? (
        <BsFillMoonStarsFill
          size={22}
          color="#60a5fa" // Mavi
          data-aos="fade-up"
        />
      ) : (
        <LuMonitor
          size={23}
          color="#9ca3af" // Gri
          data-aos="fade-up"
        />
      )}
    </div>
  );
};

export default ChangeTheme;

// "use client";

// import React, { useEffect, useState, useMemo } from "react";
// import { useTheme } from "next-themes";
// import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
// import { LuMonitor } from "react-icons/lu";
// import AOS from "aos";
// import "aos/dist/aos.css";

// const ChangeTheme = ({ className }: { className?: string }) => {
//   const [mounted, setMounted] = useState(false);
//   const { systemTheme, theme, setTheme } = useTheme();

//   useEffect(() => {
//     setMounted(true);
//     AOS.init();
//   }, []);

//   const currentTheme = useMemo(() => {
//     return theme === "system" ? systemTheme : theme;
//   }, [theme, systemTheme]);

//   if (!mounted) return null;

//   return (
//     <div
//       className={`flex items-center gap-3 ${className}`}
//       data-aos="fade-down"
//     >
//       {/* Light mode */}
//       <button
//         onClick={() => setTheme("light")}
//         title="Light Mode"
//         className={`transition transform hover:scale-110 ${
//           theme === "light" ? "opacity-100" : "opacity-50"
//         }`}
//       >
//         <BsFillSunFill
//           size={24}
//           color="#eab308" // 👈 Sarı tonu sabit (yellow-500)
//           data-aos="fade-up"
//         />
//       </button>

//       {/* Dark mode */}
//       <button
//         onClick={() => setTheme("dark")}
//         title="Dark Mode"
//         className={`transition transform hover:scale-110 ${
//           theme === "dark" ? "opacity-100" : "opacity-50"
//         }`}
//       >
//         <BsFillMoonStarsFill
//           size={22}
//           color={currentTheme === "dark" ? "#60a5fa" : "#6b7280"} // blue-400 veya gray-500
//           data-aos="fade-up"
//         />
//       </button>

//       {/* System mode */}
//       <button
//         onClick={() => setTheme("system")}
//         title="System Theme"
//         className={`transition transform hover:scale-110 ${
//           theme === "system" ? "opacity-100" : "opacity-50"
//         }`}
//       >
//         <LuMonitor
//           size={23}
//           color={theme === "system" ? "#9ca3af" : "#6b7280"} // gray-400 ya da gray-500
//           data-aos="fade-up"
//         />
//       </button>
//     </div>
//   );
// };

// export default ChangeTheme;
