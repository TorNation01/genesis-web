import "./globals.css";

export const metadata = {
  title: "Genesis — Echoes of Creation",
  description:
    "An AI-powered tabletop RPG. From landing to playing in ninety seconds.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
