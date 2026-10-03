import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ErrorBoundary } from "@/components/error-boundary";

export const metadata: Metadata = {
  title: "[workup] — Virtual Professional Experience Platform",
  description:
    "Experience how professionals actually work inside companies through authentic business simulations, cloud workspaces, and AI code reviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <Footer />
      </body>
    </html>
  );
}
