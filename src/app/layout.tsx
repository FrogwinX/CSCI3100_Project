import React from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/hooks/useAuth";
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
    icon: "/flowchat_logo.png",
  },
};

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-['Inter'] font-semibold">
        <AuthProvider>
          <div className="flex flex-col bg-base-200 text-base-content min-h-screen">
            <NavbarWithDrawer />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
