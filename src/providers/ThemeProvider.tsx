"use client";
import React, { ReactNode } from "react";

import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ComponentProps<typeof NextThemesProvider>["children"];
  // props?: React.ComponentProps<typeof NextThemesProvider>;
}

const ThemeHandler = ({ children, ...props }: ThemeProviderProps) => {
  return (
    // <NextThemesProvider enableSystem={true} attribute="class">
    <NextThemesProvider {...props}>{children}</NextThemesProvider>
  );
};

export default ThemeHandler;

// "use client";

// import * as React from "react";
// import { ThemeProvider as NextThemesProvider } from "next-themes";

// export function ThemeProvider({
//   children,
//   ...props
// }: React.ComponentProps<typeof NextThemesProvider>) {
//   return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
// }
