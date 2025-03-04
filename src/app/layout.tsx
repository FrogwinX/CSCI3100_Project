import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "../components/ClientLayout"; // 導入客戶端佈局組件

export const metadata: Metadata = {
  title: "FlowChat",
  description: "A discussion forum designed to provide an engaging and user-friendly platform for individuals to connect, communicate, and share ideas.",
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
      <body className="font-sans antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}