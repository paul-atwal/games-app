import type { Metadata } from "next";
import { Libre_Franklin, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout";

const libreFranklin = Libre_Franklin({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Puzzles - Daily Word Games",
  description:
    "Play Wordle, Connections, and Crossword puzzles. Free daily brain games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${libreFranklin.variable} ${sourceSerif.variable} antialiased`}
      >
        <Header />
        <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
      </body>
    </html>
  );
}
