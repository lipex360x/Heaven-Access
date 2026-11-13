import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heaven Access",
  description: "Visitor access prototype",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
