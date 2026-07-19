import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BloomPath Dropshipping | UAE Dropshipping & Fulfillment",
  description:
    "BloomPath connects online sellers with trusted dropshipping and fulfillment services across the UAE. Source products, manage inventory, and grow your eCommerce business.",
  keywords: [
    "BloomPath",
    "Dropshipping UAE",
    "UAE Fulfillment",
    "Online Sellers",
    "Wholesale UAE",
    "eCommerce",
    "Inventory",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}