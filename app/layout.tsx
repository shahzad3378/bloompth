import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BloomPath UAE | Dropshipping, Sourcing & Fulfillment",
    template: "%s | BloomPath",
  },
  description:
    "Launch and grow your UAE e-commerce business with local product sourcing, wholesale supply, dropshipping, warehousing, COD support and last-mile fulfillment.",
  metadataBase: new URL("https://www.fulfillmena.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "https://www.fulfillmena.com",
    siteName: "BloomPath UAE",
    title: "BloomPath UAE | Source, Sell & Fulfill",
    description:
      "A practical UAE e-commerce partner for products, dropshipping, warehousing, COD and last-mile fulfillment.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BloomPath UAE | Source, Sell & Fulfill",
    description:
      "A practical UAE e-commerce partner for products, dropshipping, warehousing, COD and last-mile fulfillment.",
  },
};

export const viewport: Viewport = {
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
