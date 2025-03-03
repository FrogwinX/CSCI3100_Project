import type { Metadata } from "next";
import "./globals.css";
import Navbar from '../components/Navbar'; // 確保導入路徑正確

export const metadata: Metadata = {
  title: "FlowChat",
  description: "A discussion forum designed to provide an engaging and user-friendly platform for individuals to connect, communicate, and share ideas.",
  icons: {
    icon: "/flowchat_logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navbar />  {/* 在這裡插入導航欄 */}
        {children}
      </body>
    </html>
  );
}