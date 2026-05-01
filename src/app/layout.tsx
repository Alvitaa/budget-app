import type { Metadata } from "next";
import "./globals.css";
import { Figtree, Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Budget App",
  description: "App to track your personal finances",
};

const inter = Inter();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="w-full h-full bg-neutral-100">
        {children}
      </body>
    </html>
  );
}
