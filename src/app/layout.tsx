import React from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/hooks/useAuth";
import "./globals.css";
import NavbarWithDrawer from "@/components/navigation/NavbarWithDrawer";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export const metadata: Metadata = {
  title: "FlowChat",
  description:
    "A discussion forum designed to provide an engaging and user-friendly platform for individuals to connect, communicate, and share ideas.",
  icons: {
    icon: "/flowchat_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-['Inter'] font-semibold">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <NavbarWithDrawer />
            <main className="flex-1 bg-base-200 place-items-center place-content-center ">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}