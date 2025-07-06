import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import React from "react";
import "./globals.css";
import "./homepage.css";
import mayfeNewLogo from "@/images/logos/mayfeLogoPNG_Pink.png";
import ThemeProvider from "@/providers/ThemeProvider";
import AuthProvider from "@/providers/AuthProviders";

// ✅ Title ve icon bilgileri burada
export const metadata: Metadata = {
  title: "ByMayFe",
  description: "ByMayFe's personal website",
  icons: {
    icon: mayfeNewLogo.src,
  },
};

// ✅ Viewport bilgisi artık metadata'da değil, ayrı export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange={true}
          >
            <AuthProvider>{children}</AuthProvider>
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
