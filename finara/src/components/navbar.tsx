"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// Se você for usar o ThemeToggle depois, basta descomentar a importação
// import ThemeToggle from "@/components/sub/ThemeToggle";

const NavbarComponent = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-[90px] fixed top-0 z-[100]" />;
  }

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const baseLinkStyle = "transition-all duration-200 hover:scale-105 cursor-pointer";
  const inactiveStyle = "text-slate-300 hover:text-blue-500 dark:hover:text-[#5fb4ff]";
  const activeStyle = "text-blue-500 font-bold drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] scale-105";

  const getLinkClassName = (path: string) => {
    return `${baseLinkStyle} ${isActive(path) ? activeStyle : inactiveStyle}`;
  };

  return (
      <div className="w-full h-[90px] fixed top-0 z-[100] flex justify-center items-center pointer-events-none">
        <div className="pointer-events-auto w-[96%] max-w-[1250px] h-[70px] rounded-3xl backdrop-blur-md
                        bg-slate-900/80 border border-slate-700/50 shadow-lg
                        flex items-center justify-between px-6 md:px-10 transition-all duration-300">

          {/* LOGO FINARA */}
          <Link href="/" className="flex items-center justify-center">
            <div className="text-2xl font-black tracking-tight text-white hover:scale-105 transition-transform cursor-pointer">
              FINARA<span className="text-blue-500">.</span>
            </div>
          </Link>

          {/* MENU DESKTOP */}
          <nav className="hidden md:flex justify-center flex-1 gap-12 text-[14px] font-medium tracking-wide">
            <Link href="/lend" className={getLinkClassName("/lend")}>
              Lend
            </Link>
            <Link href="/trade" className={getLinkClassName("/trade")}>
              Trade
            </Link>
            <Link href="/yield" className={getLinkClassName("/yield")}>
              Yield
            </Link>
          </nav>

          {/* BOTÃO CONECTAR CARTEIRA & EXTRAS */}
          <div className="flex items-center gap-4">
            {/* <ThemeToggle /> */}
            <button className="hidden md:block bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
              Connect Wallet
            </button>
            <button
                className="md:hidden text-white focus:outline-none text-2xl"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* MENU MOBILE */}
        {isMobileMenuOpen && (
            <div className="pointer-events-auto absolute top-[85px] w-[90%] max-w-[400px] rounded-2xl bg-slate-900/95 border border-slate-700/50 backdrop-blur-xl p-6 flex flex-col items-center text-white shadow-2xl animate-in slide-in-from-top-5">
              <Link href="/lend" className="py-3 w-full text-center hover:bg-slate-800 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                Lend
              </Link>
              <Link href="/trade" className="py-3 w-full text-center hover:bg-slate-800 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                Trade
              </Link>
              <Link href="/yield" className={`py-3 w-full text-center rounded-lg ${isActive("/yield") ? "text-blue-500 font-bold" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
                Yield
              </Link>
              
              <div className="w-full h-px bg-slate-700/50 my-2"></div>
              
              <button className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-semibold transition-all">
                Connect Wallet
              </button>
            </div>
        )}
      </div>
  );
};

export const Navbar = dynamic(() => Promise.resolve(NavbarComponent), { ssr: false });