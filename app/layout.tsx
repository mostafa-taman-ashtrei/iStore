import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import ModalProvider from "@/providers/ModalProvider";
import NextThemeProvider from "@/providers/NextThemeProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "iStore | Admin",
  description: "The best admin dashboard to manage an e-commerce platform.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <NextThemeProvider>
            <ModalProvider />
            <Toaster />
            {children}
          </NextThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
