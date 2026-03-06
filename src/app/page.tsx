"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowTrendingUpIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030805] overflow-hidden bg-mesh">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] glow-emerald opacity-50 animate-pulse-soft" />
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] glow-gold opacity-30 animate-pulse-soft" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] glow-emerald opacity-25" />
      <div className="absolute bottom-[10%] left-[0%] w-[30%] h-[30%] glow-gold opacity-15 animate-float" />

      {/* Floating Particles */}
      <div className="absolute top-[25%] left-[20%] w-1.5 h-1.5 rounded-full bg-emerald-400/20 animate-float" />
      <div className="absolute top-[45%] right-[25%] w-2 h-2 rounded-full bg-amber-400/15 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[65%] left-[65%] w-1 h-1 rounded-full bg-emerald-300/20 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[35%] right-[35%] w-0.5 h-0.5 rounded-full bg-amber-300/30 animate-float" style={{ animationDelay: '3s' }} />

      <main className="relative z-10 pt-36 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center">

        {/* Hero Section */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="text-center mb-28 max-w-4xl"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 text-sm font-semibold mb-10 tracking-wide"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            LIVE ON CREDITCOIN TESTNET
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]"
          >
            Institutional <br />
            <span className="text-gradient-premium">
              DeFi on Creditcoin
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            The premier decentralized ecosystem for institutional-grade finance.
            Access native yield, manage liquidity, and trade RWA backed assets with
            unrivaled scalability and security.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <Link href="/trade" className="px-10 py-4.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-900/30 hover:shadow-emerald-500/20 hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2 group">
              Start Trading
              <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/docs" className="px-10 py-4.5 glass-card text-white font-bold rounded-2xl hover:bg-white/5 transition-all flex items-center justify-center">
              Documentation
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          {/* Card Lend */}
          <motion.div variants={fadeInUp} className="glass-card p-10 rounded-[2.5rem] group">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/5 flex items-center justify-center mb-8 border border-emerald-500/10 group-hover:bg-emerald-500/10 transition-all duration-500">
              <BanknotesIcon className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-100">Lend</h3>
            <p className="text-slate-400 mb-8 font-medium leading-relaxed">
              Supply liquidity and earn competitive native yield through
              fully transparent on-chain lending pools on Creditcoin.
            </p>
            <Link href="/lend" className="text-emerald-400 font-bold flex items-center gap-2 group-hover:gap-3 transition-all hover:text-amber-400">
              Explore Liquidity <ChevronRightIcon className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Card Trade */}
          <motion.div variants={fadeInUp} className="glass-card p-10 rounded-[2.5rem] group">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/5 flex items-center justify-center mb-8 border border-emerald-500/10 group-hover:bg-emerald-500/10 transition-all duration-500">
              <ArrowsRightLeftIcon className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-100">Trade</h3>
            <p className="text-slate-400 mb-8 font-medium leading-relaxed">
              Experience institucional-grade trading with minimal slippage
              and lightning fast settlement on our high-performance DEX.
            </p>
            <Link href="/trade" className="text-emerald-400 font-bold flex items-center gap-2 group-hover:gap-3 transition-all hover:text-amber-400">
              Launch Exchange <ChevronRightIcon className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Card Yield */}
          <motion.div variants={fadeInUp} className="glass-card p-10 rounded-[2.5rem] group">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/5 flex items-center justify-center mb-8 border border-emerald-500/10 group-hover:bg-emerald-500/10 transition-all duration-500">
              <ArrowTrendingUpIcon className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-100">Yield</h3>
            <p className="text-slate-400 mb-8 font-medium leading-relaxed">
              Maximize capital efficiency with automated RWA-backed
              yield strategies powered by Creditcoin's L1 security.
            </p>
            <Link href="/yield" className="text-emerald-400 font-bold flex items-center gap-2 group-hover:gap-3 transition-all hover:text-amber-400">
              View Strategies <ChevronRightIcon className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-28 w-full grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: "Total Value Locked", value: "$34.8M" },
            { label: "Active Users", value: "12,500+" },
            { label: "Transactions", value: "284K" },
            { label: "Partner Protocols", value: "24" }
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-3xl p-8 text-center border-emerald-500/5">
              <div className="text-3xl md:text-4xl font-black text-gradient-premium mb-2 tracking-tight">{stat.value}</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Footer Polish */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 pt-12 border-t border-emerald-500/10 w-full flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm gap-8"
        >
          <div className="font-medium tracking-tight">
            © 2026 <span className="text-emerald-500 font-bold">FINARA</span> Ecosystem. Powered by Creditcoin Network.
          </div>
          <div className="flex gap-10">
            <a href="#" className="hover:text-emerald-400 font-bold transition-all hover:scale-105">Twitter</a>
            <a href="#" className="hover:text-emerald-400 font-bold transition-all hover:scale-105">Discord</a>
            <a href="#" className="hover:text-emerald-400 font-bold transition-all hover:scale-105">Docs</a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
