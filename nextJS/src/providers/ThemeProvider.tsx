"use client";
import React, { ReactNode } from "react";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// interface ThemeProviderProps {
//  children: React.ComponentProps<typeof NextThemesProvider>["children"];
//  // ✅ DÜZELTME: Tüm NextThemesProvider props'larını dahil etmek için props tipini genişlettim
//  attribute?: React.ComponentProps<typeof NextThemesProvider>["attribute"];
//  defaultTheme?: React.ComponentProps<typeof NextThemesProvider>["defaultTheme"];
//  enableSystem?: React.ComponentProps<typeof NextThemesProvider>["enableSystem"];
//  disableTransitionOnChange?: React.ComponentProps<typeof NextThemesProvider>["disableTransitionOnChange"];
// }

const ThemeProvider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
  return (
    // <NextThemesProvider enableSystem={true} attribute="class">
    <NextThemesProvider {...props}>{children}</NextThemesProvider>
  );
};

export default ThemeProvider;
