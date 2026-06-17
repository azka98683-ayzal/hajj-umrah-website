import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";

// Premium dynamic typography ke liye Inter aur Amiri fonts select kiye hain
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Al-Maqam | Premium Hajj & Umrah Luxury Services",
  description:
    "Begin your sacred pilgrimage with absolute peace of mind. Ministry authorized Hajj & Umrah luxury travel services.",
  keywords: ["Hajj 2026", "Umrah Packages", "Luxury Hajj Pakistan", "Premium Umrah Services"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${amiri.variable} scroll-smooth`}>
      <body className="antialiased bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}