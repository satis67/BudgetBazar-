import type { Metadata } from "next";
import { StoreProvider } from "../lib/store";
import { AuthProvider } from "@/context/AuthContext";
import Header from "../components/Header";
import AIChat from "../components/AIChat";
import "./globals.css";

export const metadata: Metadata = {
  title: "Budget Bazar — AI-Powered Smart Marketplace",
  description: "Shop smarter with India's most advanced AI marketplace. Real-time auctions, budget intelligence, and personalized deals.",
  keywords: "online shopping, AI marketplace, budget shopping, deals, electronics, fashion",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <StoreProvider>
            <Header />
            {children}
            <AIChat />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
