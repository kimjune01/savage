import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Savage - AI-Powered SVG Generator",
  description: "Generate SVG graphics with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}