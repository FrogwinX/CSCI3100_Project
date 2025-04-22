import React from "react";
import type { Metadata } from "next";
import { SessionProvider } from "@/hooks/useSession";
import NavbarWithDrawer from "@/components/navigation/NavbarWithDrawer";
import { Inter } from "next/font/google";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "FlowChat",
  description:
    "A discussion forum designed to provide an engaging and user-friendly platform for individuals to connect, communicate, and share ideas.",
  icons: {
    icon: "/favicon.ico",
  },
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="font-semibold">
        <SessionProvider>
          <div className="flex flex-col bg-base-200 text-base-content h-screen">
            <NavbarWithDrawer />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
