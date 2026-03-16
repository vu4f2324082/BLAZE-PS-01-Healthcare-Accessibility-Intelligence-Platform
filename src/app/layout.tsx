import type { Metadata } from "next";
import "./globals.css";
import VoiceAssistant from "@/components/ui/VoiceAssistant";
import HighContrastProvider from "@/components/ui/HighContrastProvider";

export const metadata: Metadata = {
  title: "AccessHealth — Healthcare Accessibility Intelligence Platform",
  description: "Discover accessible hospitals, clinics, and diagnostic centers for persons with disabilities. Search by wheelchair access, sign language, braille signage, and more.",
  keywords: "accessible healthcare, wheelchair, hospitals Mumbai, disability, accessibility",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased min-h-screen flex flex-col bg-slate-50">
        {/* TASK-01/22: Skip-to-main for keyboard & screen-reader users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* TASK-06: High-contrast mode persisted in localStorage */}
        <HighContrastProvider />

        {/* Navbar is rendered per-page so each page controls its own header */}

        <div className="flex-grow">
          {children}
        </div>

        {/* TASK-09/21: Global floating Voice Assistant */}
        <VoiceAssistant />
      </body>
    </html>
  );
}
