import "./global.css"
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Travio",
  description: "Discover amazing places with Travio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
