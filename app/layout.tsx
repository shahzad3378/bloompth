import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BloomPath | Global Sourcing & Fulfillment",
    template: "%s | BloomPath",
  },
  description:
    "Source products across markets and coordinate wholesale, inventory handling and delivery with one fulfillment partner.",
  metadataBase: new URL("https://www.fulfillmena.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "https://www.fulfillmena.com",
    siteName: "BloomPath Global Sourcing",
    title: "BloomPath Global Sourcing | Source, Sell & Fulfill",
    description:
      "A connected sourcing and fulfillment partner for products, wholesale, warehousing and delivery across markets.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BloomPath Global Sourcing | Source, Sell & Fulfill",
    description:
      "A connected sourcing and fulfillment partner for products, wholesale, warehousing and delivery across markets.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#073E2A",
  colorScheme: "light",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en-AE">
      <body>{children}</body>
    </html>
  );
}
