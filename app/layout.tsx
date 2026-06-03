import type { Metadata } from "next";
import { Fredoka, M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-rounded",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const mPlusRounded1c = M_PLUS_Rounded_1c({
  variable: "--font-m-plus-rounded",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Fix Your Ears",
  description: "A Spicy Spelling Challenge - Can you spell what you hear?",
  icons: {
    icon: "/images/favicon.jpeg",
    shortcut: "/images/favicon.jpeg",
    apple: "/images/favicon.jpeg",
  },
  openGraph: {
    title: "Fix Your Ears",
    description: "A Spicy Spelling Challenge - Can you spell what you hear?",
    images: [
      {
        url: "/images/thumbnail.jpeg?v=2",
        width: 1200,
        height: 630,
        alt: "Fix Your Ears",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fix Your Ears",
    description: "A Spicy Spelling Challenge - Can you spell what you hear?",
    images: ["/images/thumbnail.jpeg?v=2"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} ${mPlusRounded1c.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
