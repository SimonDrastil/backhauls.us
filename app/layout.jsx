import "./globals.css";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Backhauls US | Marketplace",
  description:
    "Book return trips instantly with Backhauls US. Explore live capacity, sync with analytics, and keep your lanes running hot.",
  openGraph: {
    title: "Backhauls US",
    description: "Production-ready logistics marketplace for hotshot backhauls.",
    type: "website",
  },
  metadataBase: new URL("https://backhauls.us"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen`}>{children}</body>
    </html>
  );
}
