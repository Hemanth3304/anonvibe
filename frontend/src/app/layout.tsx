import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnonVibe — Meet New People. Chat Anonymously. Join Communities.",
  description:
    "AnonVibe is a modern social discovery platform combining anonymous chat, dating, nearby people, communities, living rooms, and events. Safe, private, and fun.",
  keywords: ["anonymous chat", "dating", "communities", "nearby people", "living rooms", "events", "social discovery"],
  openGraph: {
    title: "AnonVibe — Meet New People. Chat Anonymously.",
    description: "The modern social discovery platform. Chat anonymously, find nearby people, join communities & more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
