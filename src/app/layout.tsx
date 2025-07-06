import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import React from "react";
// import Head from "next/head"; // ❌ KALDIRI: Next.js 15 App Router'da Head component'i kullanılmaz
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
  // ✅ EKLENDİ: viewport metadata'sı Head yerine buraya taşındı (Next.js 15 App Router standardı)
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // user-scalable=0 yerine false kullanıldı
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning lang="en">
      {/* ❌ KALDIRILDI: Head component'i App Router'da çalışmaz, metadata ile yapılır */}
      {/* <Head>
       <meta
         name="viewport"
         content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
       />
     </Head> */}
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
