import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import DashboardNavbar from "@/components/nav/DashboardNavbar";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import NextThemeProvider from "@/providers/NextThemeProvider";

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
            <DashboardNavbar />
            {children}
          </NextThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
