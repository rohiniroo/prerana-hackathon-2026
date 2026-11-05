
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AppNavigation from "../src/components/AppNavigation";
export const metadata: Metadata = {
  title: "BioTrack | Every Trace Tells a Story of Care",
  description:
    "A healthcare waste management and tracking platform designed for safer, responsible and transparent waste handling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppNavigation />
        {children}
      </body>
    </html>
  );
}
