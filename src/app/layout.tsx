import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AccessHealth - Healthcare Accessibility Intelligence Platform",
  description: "Comprehensive database of healthcare facilities with detailed accessibility information for persons with disabilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased">
        <div className="min-h-screen flex flex-col bg-slate-50">
          {children}
        </div>
      </body>
    </html>
  );
}
