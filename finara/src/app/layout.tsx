import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finara | Creditcoin DeFi Ecosystem",
  description: "Secure, scalable, and reliable on-chain finance. Access yield, manage liquidity, and trade assets on the Creditcoin L1.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0705] text-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}