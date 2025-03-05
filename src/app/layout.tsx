import React from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/hooks/useAuth";
import NavBar from "@/components/navigation/NavBar";
import "./globals.css";

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
      <body className="font-['Inter'] font-normal">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-1 bg-base-200 place-items-center place-content-center ">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}