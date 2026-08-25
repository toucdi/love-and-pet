import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Love&Pet — Allevamento Barboncini Toy a Roma",
  description:
    "Allevamento amatoriale di Barboncini Toy e Nano ai Colli di Enea, Roma. Toelettatura & Spa, addestramento e dog sitting. Cuccioli con pedigree ENC/FCI, cresciuti in casa.",
  keywords: [
    "barboncini toy",
    "allevamento barboncini Roma",
    "barboncino nano",
    "toelettatura cani Roma",
    "cuccioli con pedigree",
    "Colli di Enea",
  ],
  authors: [{ name: "Manuela Senzani" }],
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Love&Pet",
    title: "Love&Pet — Allevamento Barboncini Toy a Roma",
    description:
      "Barboncini Toy cresciuti con amore, a Roma. Allevamento amatoriale, toelettatura & spa, addestramento e dog sitting ai Colli di Enea.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#faf6ef",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
