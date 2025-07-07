import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import React from "react";
import "./globals.css";
import "./homepage.css";
import mayfeNewLogo from "@/images/logos/mayfeLogoPNG_Pink.png";
import ThemeHandler from "@/providers/ThemeProvider";
import AuthProvider from "@/providers/AuthProviders";

export const metadata: Metadata = {
  title: "ByMayFe",
  description: "ByMayFe's personal website",
  icons: {
    icon: mayfeNewLogo.src,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <ThemeHandler
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Analytics />
        </ThemeHandler>
      </body>
    </html>
  );
}
