import type { Metadata } from "next";
import { Fredoka, Schoolbell } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["300", "400", "500", "600", "700"],
});

const schoolbell = Schoolbell({
  subsets: ["latin"],
  variable: "--font-schoolbell",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Fix Your Ears",
  description: "A dictation game to improve your English listening skills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} ${schoolbell.variable}`}>
        {children}
      </body>
    </html>
  );
}
