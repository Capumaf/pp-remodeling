// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

// Shell
import Header from "./components/Header";
import Footer from "./components/Footer";

// Animations (sistema homogéneo)
import { MotionProvider } from "./components/anim";

// UX helpers
import BackToTop from "./components/BackToTop"; // opcional
import { Toaster } from "sonner";               // toasts

export const metadata: Metadata = {
  title: "P&P Remodeling",
  description: "Quality remodeling services in Maryland.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-white text-[#1F2937] antialiased">
        <MotionProvider>
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
          <BackToTop />
          <Toaster richColors />
        </MotionProvider>
      </body>
    </html>
  );
}

