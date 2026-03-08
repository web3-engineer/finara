import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// IMPORTANTE: Verifique se o caminho destas importações bate com as suas pastas
import { Providers } from "./providers"; 
import { Navbar } from "../components/navbar"; // Ou "@/components/Navbar", dependendo do seu setup

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finara | On-Chain Finance",
  description: "Redefina as finanças on-chain com a infraestrutura robusta da Creditcoin.",
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
          <Navbar /> {/* Ela entra aqui, antes das páginas */}
          {children}
        </Providers>
      </body>
    </html>
  );
}