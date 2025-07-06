// "use client";
// import React, { ReactNode } from "react";

// import { ThemeProvider as NextThemesProvider } from "next-themes";

// // interface ThemeProviderProps {
// //  children: React.ComponentProps<typeof NextThemesProvider>["children"];
// //  // ✅ DÜZELTME: Tüm NextThemesProvider props'larını dahil etmek için props tipini genişlettim
// //  attribute?: React.ComponentProps<typeof NextThemesProvider>["attribute"];
// //  defaultTheme?: React.ComponentProps<typeof NextThemesProvider>["defaultTheme"];
// //  enableSystem?: React.ComponentProps<typeof NextThemesProvider>["enableSystem"];
// //  disableTransitionOnChange?: React.ComponentProps<typeof NextThemesProvider>["disableTransitionOnChange"];
// // }

// const ThemeProvider = ({
//   children,
//   ...props
// }: React.ComponentProps<typeof NextThemesProvider>) => {
//   return (
//     // <NextThemesProvider enableSystem={true} attribute="class">
//     <NextThemesProvider {...props}>{children}</NextThemesProvider>
//   );
// };

// export default ThemeProvider;

// "use client";

// import * as React from "react";
// import { ThemeProvider as NextThemesProvider } from "next-themes";

// export function ThemeProvider({
//   children,
//   ...props
// }: React.ComponentProps<typeof NextThemesProvider>) {
//   return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
// }
// export default ThemeProvider;

"use client";

import React, { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

const HtmlClassUpdater = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (resolvedTheme === "light") root.classList.add("light");
    else if (resolvedTheme === "dark") root.classList.add("dark");
  }, [resolvedTheme]);

  return null;
};

const ThemeProvider: React.FC<
  React.ComponentProps<typeof NextThemesProvider>
> = ({ children, ...props }) => {
  return (
    <NextThemesProvider {...props}>
      <HtmlClassUpdater />
      {children}
    </NextThemesProvider>
  );
};

export default ThemeProvider;
