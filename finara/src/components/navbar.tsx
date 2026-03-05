"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const NavbarComponent = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

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

  const baseLinkStyle = "transition-all duration-200 cursor-pointer flex items-center gap-1";
  const inactiveStyle = "text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-[#f97316] hover:scale-105";
  const activeStyle = "text-orange-600 dark:text-orange-500 font-bold drop-shadow-[0_0_8px_rgba(249,115,22,0.3)] dark:drop-shadow-[0_0_8px_rgba(249,115,22,0.5)] scale-105";

  const getLinkClassName = (path: string) => {
    return `${baseLinkStyle} ${isActive(path) ? activeStyle : inactiveStyle}`;
  };

  return (
      <div className="w-full h-[90px] fixed top-0 z-[100] flex justify-center items-center pointer-events-none">
        <div className="pointer-events-auto w-[96%] max-w-[1250px] h-[70px] rounded-3xl backdrop-blur-md
                        bg-white/80 dark:bg-[#120a07]/80 
                        border border-slate-200 dark:border-white/5 
                        shadow-xl dark:shadow-2xl
                        flex items-center justify-between px-6 md:px-10 transition-all duration-300">

          {/* LOGO FINARA */}
          <Link href="/" className="flex items-center justify-center">
            <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white hover:scale-105 transition-transform cursor-pointer">
              FINARA<span className="text-orange-500">.</span>
            </div>
          </Link>

          {/* MENU DESKTOP */}
          <nav className="hidden md:flex justify-center flex-1 gap-8 lg:gap-12 text-[14px] font-medium tracking-wide">
            {/* Sobre Nós */}
            <Link href="/about" className={getLinkClassName("/about")}>Sobre Nós</Link>
            
            {/* Market */}
            <Link href="/market" className={getLinkClassName("/market")}>Market</Link>

            {/* Dropdown Vaults */}
            <div className="relative group">
              {/* O botão principal do dropdown */}
              <button className={`${getLinkClassName("/vaults")} py-2`}>
                Vaults <ChevronDownIcon className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              {/* O Menu invisível que aparece no hover */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-[#120a07] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden py-2 backdrop-blur-md">
                <Link 
                  href="/vaults/yields" 
                  className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 hover:text-orange-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  Yields
                </Link>
                <Link 
                  href="/vaults/lend" 
                  className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 hover:text-orange-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  Lend
                </Link>
                <Link 
                  href="/vaults/borrow" 
                  className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300 hover:text-orange-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  Borrow
                </Link>
              </div>
            </div>
          </nav>

          {/* BOTÕES E TEMA */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/80 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              {resolvedTheme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            <div className="hidden md:block">
              <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
            </div>
            
            {/* Menu Hambúrguer (Mobile) */}
            <button
                className="md:hidden text-slate-900 dark:text-white focus:outline-none p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {/* Ícone simples de menu em SVG para ficar mais elegante que o caractere ☰ */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* MENU MOBILE */}
        {isMobileMenuOpen && (
            <div className="pointer-events-auto absolute top-[85px] w-[90%] max-w-[400px] rounded-3xl bg-white/95 dark:bg-[#120a07]/95 border border-slate-200 dark:border-white/10 backdrop-blur-xl p-6 flex flex-col items-center text-slate-900 dark:text-white shadow-2xl animate-in slide-in-from-top-5">
              
              <Link href="/about" className="py-3 w-full text-center hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>Sobre Nós</Link>
              <Link href="/market" className="py-3 w-full text-center hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>Market</Link>
              
              {/* Bloco Vaults Mobile */}
              <div className="w-full mt-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <p className="py-2 text-center text-xs tracking-widest text-slate-400 dark:text-slate-500 uppercase font-bold">Vaults</p>
                <div className="flex flex-col gap-1 bg-slate-50 dark:bg-black/20 rounded-xl p-2">
                  <Link href="/vaults/yields" className="py-2 w-full text-center text-sm hover:text-orange-500 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Yields</Link>
                  <Link href="/vaults/lend" className="py-2 w-full text-center text-sm hover:text-orange-500 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Lend</Link>
                  <Link href="/vaults/borrow" className="py-2 w-full text-center text-sm hover:text-orange-500 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Borrow</Link>
                </div>
              </div>
              
              <div className="w-full h-px bg-slate-200 dark:bg-white/10 my-6"></div>
              
              <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
            </div>
        )}
      </div>
  );
};

export const Navbar = dynamic(() => Promise.resolve(NavbarComponent), { ssr: false });