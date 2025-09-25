import "./globals.css"; // Make sure this path matches your file

export const metadata = {
  title: "Travio",
  description: "Travel website",
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