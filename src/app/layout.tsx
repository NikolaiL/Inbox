import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./polyfills";
import { ClientProviders } from "./ClientProviders";
import { NotificationProvider } from "./components/notifications/NotificationProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "INBOX - Decentralized Messaging",
  description: "A decentralized inbox web app leveraging XMTP protocol",
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
        <ClientProviders>
          <NotificationProvider />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
