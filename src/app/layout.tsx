import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { cn } from "@/lib/utils";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Hotel Book Management | Premium Experience",
  description: "Book your luxury stay with ease.",
};

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/providers/AuthProvider";

// ... imports

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          outfit.variable
        )}
      >
        <QueryProvider>
          <Toaster position="top-right" richColors />
          <AuthProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
