"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <Header />
            {children}
            <Footer />
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
