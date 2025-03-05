import type { Metadata } from "next";
import "./globals.css";
import NavbarWithDrawer from "../components/NavbarWithDrawer";

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
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="font-sans antialiased">
        <div className="fixed top-0 left-0 right-0 z-50">
          <NavbarWithDrawer />
        </div>
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}