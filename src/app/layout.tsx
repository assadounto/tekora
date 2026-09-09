import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tekora — Learn. Build. Prove. Work.",
  description: "Practical learning, projects, creators, communities and opportunities.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
