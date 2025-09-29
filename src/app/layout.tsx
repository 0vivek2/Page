export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0,fontFamily: "sans-serif", background: "#000" }}>
        {children}
      </body>
    </html>
  );
}
