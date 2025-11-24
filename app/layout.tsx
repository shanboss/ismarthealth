import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "iSmart Health",
  description: "iSmartHealth.in – Cloud-based healthcare management suite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function(){
              try {
                var stored = localStorage.getItem('theme');
                var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                var dark = stored ? stored === 'dark' : prefersDark;
                var root = document.documentElement;
                if (dark) {
                  root.classList.add('dark');
                  root.setAttribute('data-theme','dark');
                } else {
                  root.classList.remove('dark');
                  root.setAttribute('data-theme','light');
                }
              } catch (e) {}
            })();
          `}
        </Script>
        {/** Navbar and Footer are client-safe presentation components */}
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

import dynamic from "next/dynamic";
import { RoleProvider } from "./providers/role-provider";
const Navbar = dynamic(() => import("./components/Navbar"), { ssr: true });
const Footer = dynamic(() => import("./components/Footer"), { ssr: true });

function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <div className="min-h-dvh bg-background text-foreground">
        <Navbar />
        <main className="mx-auto w-full px-4 py-10">{children}</main>
        <Footer />
      </div>
    </RoleProvider>
  );
}
