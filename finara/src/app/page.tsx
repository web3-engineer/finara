'use client';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, Variants, AnimatePresence } from 'framer-motion';
import {
  WalletIcon,
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  BanknotesIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  GlobeAltIcon,
  BuildingLibraryIcon,
  CubeTransparentIcon,
  CpuChipIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

// --- IMPORTANDO NOSSO FUNDO ANIMADO 3D ---
import FinaraWaves from '../components/FinaraWaves';

// --- DADOS DO MENU E PARCEIROS ---
const MENU_ITEMS = [
  { label: "MERCADOS DE LEND", href: "/lend", icon: BanknotesIcon, desc: "EMPRESTE E TOME EMPRESTADO" },
  { label: "TRADING DESCENTRALIZADO", href: "/trade", icon: ArrowsRightLeftIcon, desc: "Trocas rápidas na Creditcoin" },
  { label: "YIELD FARMING", href: "/yield", icon: SparklesIcon, desc: "Maximize seus rendimentos" },
  { label: "MEU DASHBOARD", href: "/dashboard", icon: AdjustmentsHorizontalIcon, desc: "Gestão do seu portfólio" },
];

const PARTNERS = [
  { name: "Creditcoin Foundation", icon: GlobeAltIcon, logoPath: "" },
  { name: "Gluwa Capital", icon: BuildingLibraryIcon, logoPath: "" },
  { name: "Aave Protocol", icon: CubeTransparentIcon, logoPath: "" },
  { name: "Chainlink Oracles", icon: CpuChipIcon, logoPath: "" },
  { name: "Web3 Nodes", icon: CloudIcon, logoPath: "" },
];

// --- VARIANTES DE ANIMAÇÃO ---
const letterAnimation: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.05 } }
};

const cardAnimation: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2 } }
};

const flowItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.4 } }
};

// ==========================================
// COMPONENTE ISOLADO PARA WEB3 (A MÁGICA DO SSR)
// ==========================================
function Web3ActionButtons({ setHoveredButton }: { setHoveredButton: (val: 'launch' | 'learn' | null) => void }) {
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleLaunchClick = () => {
    if (!mounted) return;
    if (!isConnected) {
      if (openConnectModal) openConnectModal();
    } else {
      router.push('/lend');
    }
  };

  return (
    <motion.div className="flex flex-row gap-4">
      <button
        onClick={handleLaunchClick}
        onMouseEnter={() => setHoveredButton('launch')}
        onMouseLeave={() => setHoveredButton(null)}
        className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-emerald-50 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-2"
      >
        <span>Iniciar App</span><ArrowRightIcon className="w-3 h-3" />
      </button>
      <button
        onMouseEnter={() => setHoveredButton('learn')}
        onMouseLeave={() => setHoveredButton(null)}
        className="px-6 py-2.5 bg-emerald-700 text-white border border-emerald-600 hover:bg-emerald-600 hover:scale-105 shadow-[0_0_20px_rgba(4,120,87,0.3)] text-xs font-bold uppercase tracking-widest rounded-full transition-all flex items-center gap-2"
      >
        <span>Documentação</span>
      </button>
    </motion.div>
  );
}

// ==========================================
// PÁGINA PRINCIPAL
// ==========================================
export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredButton, setHoveredButton] = useState<'launch' | 'learn' | null>(null);
  const router = useRouter();

  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0.33, 1]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowUp", "KeyW"].includes(e.code)) {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
      }
      if (["ArrowDown", "KeyS"].includes(e.code)) {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % MENU_ITEMS.length);
      }
      if (e.code === "Enter") {
        const item = MENU_ITEMS[activeIndex];
        if (item) router.push(item.href);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, router]);

  const titleText = "ON-CHAIN FINANCE";

  return (
    // Removido o min-h-screen padrão, adicionei pt-28 para compensar o espaço da navbar que agora é fixa globalmente
    <div className="relative min-h-screen pt-28 bg-[#0a0705] text-white selection:bg-emerald-600/30 overflow-x-hidden font-sans flex flex-col">

      {/* --- BARRA DE PROGRESSO COM NOVAS CORES (VERDE -> LARANJA) --- */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-700 via-orange-600 to-[#3b2313] z-[100] origin-left shadow-[0_0_10px_#047857]" style={{ scaleX }} />

      {/* --- CONTAINER DO BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* AQUI ESTÁ A NOSSA ONDA 3D */}
        <FinaraWaves />

        {/* Efeitos de luz sutilmente ajustados para a nova paleta */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#2c1a12 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-800/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-700/10 rounded-full blur-[100px]" />
      </div>

      {/* --- O HEADER FOI COMPLETAMENTE REMOVIDO DAQUI --- */}

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 w-full min-h-[75vh] flex items-center justify-center pb-20">
        <main className="max-w-[1600px] mx-auto flex flex-col-reverse lg:flex-row items-center justify-center px-6 lg:gap-32 gap-12 w-full">

          {/* ESQUERDA: MENU */}
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="w-full max-w-[450px]">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#120a07]/60 backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-600/50 to-transparent"></div>
              <div className="p-8">
                <h2 className="text-[10px] font-bold text-emerald-500/80 tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Terminal de Protocolo
                </h2>
                <div className="space-y-2">
                  {MENU_ITEMS.map((item, i) => {
                    const Icon = item.icon;
                    const isActive = (hoveredIndex !== null ? hoveredIndex === i : activeIndex === i);
                    return (
                      <div key={item.label} onClick={() => router.push(item.href)} onMouseEnter={() => { setHoveredIndex(i); setActiveIndex(i); }} onMouseLeave={() => setHoveredIndex(null)} className={`group relative flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all duration-300 border border-transparent ${isActive ? 'bg-emerald-950/30 border-emerald-600/20' : 'hover:bg-white/[0.03]'}`}>
                        {isActive && <motion.div layoutId="activeBar" className="absolute left-0 w-0.5 h-6 bg-emerald-500 rounded-r-full shadow-[0_0_10px_#10b981]" />}
                        <div className={`w-8 h-8 rounded flex items-center justify-center transition-all duration-300 ${isActive ? 'text-emerald-500' : 'text-white/40'}`}><Icon className="w-5 h-5" /></div>
                        <div className="flex-1">
                          <h3 className={`text-sm font-bold tracking-wider transition-colors uppercase ${isActive ? 'text-white' : 'text-white/60'}`}>{item.label}</h3>
                          {isActive && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] text-emerald-200/70 uppercase tracking-widest mt-0.5">{item.desc}</motion.p>}
                        </div>
                        <ChevronRightIcon className={`w-3 h-3 text-white/30 transition-transform duration-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="px-8 py-3 bg-black/60 border-t border-white/5 flex justify-between items-center text-[9px] text-white/30 uppercase tracking-widest font-mono">
                <span>Creditcoin Network</span><span className="text-emerald-500">● Sincronizado</span>
              </div>
            </div>
          </motion.div>

          {/* DIREITA: HERO TEXT E BOTÕES */}
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="flex-1 text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] text-white mb-6">
              REDEFINA AS <br />
              {/* GRADIENTE DO TÍTULO ATUALIZADO PARA VERDE -> LARANJA -> MARROM */}
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-orange-500 to-[#6b3e21] animate-gradient-x tracking-widest">
                {titleText.split("").map((char, index) => <motion.span key={index} variants={letterAnimation}>{char}</motion.span>)}
              </span>
            </h1>

            <div className="h-32 mb-4 w-full max-w-lg relative">
              <AnimatePresence mode="wait">
                {hoveredButton === 'launch' && (
                  <motion.div key="launch-card" variants={cardAnimation} initial="hidden" animate="visible" exit="exit" className="absolute inset-0 p-5 rounded-2xl bg-[#0a120e]/90 border border-emerald-600/20 backdrop-blur-md shadow-[0_0_30px_rgba(4,120,87,0.1)] flex items-start gap-4">
                    <WalletIcon className="w-6 h-6 text-emerald-500 animate-pulse flex-shrink-0 mt-1" />
                    <p className="text-sm text-gray-200 font-light leading-relaxed">Conecte sua carteira para acessar <span className="text-emerald-400 font-normal">empréstimos, liquidez e rendimentos</span> suportados pela infraestrutura robusta da Creditcoin.</p>
                  </motion.div>
                )}
                {hoveredButton === 'learn' && (
                  <motion.div key="learn-card" variants={cardAnimation} initial="hidden" animate="visible" exit="exit" className="absolute inset-0 p-5 rounded-2xl bg-[#120a07]/90 border border-white/10 backdrop-blur-md shadow-2xl flex items-start gap-4">
                    <InformationCircleIcon className="w-6 h-6 text-white/50 flex-shrink-0 mt-1" />
                    <p className="text-sm text-gray-300 font-light leading-relaxed">Entenda como a Finara utiliza o ecossistema L1 para garantir escalabilidade, segurança e taxas mínimas para suas operações financeiras.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AQUI RENDERIZAMOS OS BOTÕES */}
            <Web3ActionButtons setHoveredButton={setHoveredButton} />

          </motion.div>
        </main>
      </section>

      {/* --- SEÇÃO PARCEIROS --- */}
      <section className="relative w-full bg-black/40 backdrop-blur-sm py-16 overflow-hidden border-t border-white/5 flex flex-col justify-center gap-8 z-20">
        <div className="max-w-[1600px] mx-auto px-6 relative z-10">
          <h3 className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.4em] text-center flex items-center justify-center gap-4">
            <span className="w-8 h-[1px] bg-emerald-500/30"></span>
            ECOSSISTEMA & INTEGRAÇÕES
            <span className="w-8 h-[1px] bg-emerald-500/30"></span>
          </h3>
        </div>
        <div className="flex overflow-hidden select-none cursor-grab active:cursor-grabbing w-full relative z-10 mask-gradient-x">
          <motion.div
            className="flex gap-20 items-center flex-nowrap pl-20"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
            drag="x" dragConstraints={{ left: -1000, right: 0 }}
          >
            {[...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, idx) => (
              <div key={idx} className="group flex flex-col items-center gap-3 opacity-30 hover:opacity-100 transition-all duration-500 hover:scale-110 min-w-[150px]">
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 group-hover:border-emerald-600/30 group-hover:bg-emerald-600/10 transition-colors">
                  <partner.icon className="w-8 h-8 text-white group-hover:text-emerald-500" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- INFRAESTRUTURA DeFi --- */}
      <section className="relative w-full py-32 overflow-hidden z-10 bg-[#0a0705]">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-left self-start mt-10">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
              INFRAESTRUTURA <br /> PENSADA PARA <br />
              {/* GRADIENTE ATUALIZADO AQUI TAMBÉM */}
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-orange-500 animate-gradient-x">ESCALABILIDADE.</span>
            </motion.h2>
            <p className="text-white/50 mt-6 max-w-md font-light leading-relaxed text-sm">
              A Finara utiliza a rede Creditcoin como sua espinha dorsal, garantindo que operações sejam executadas com segurança inigualável.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] bg-[#0c120f] border border-white/5 p-8 lg:p-10 overflow-hidden shadow-2xl w-full max-w-xl mx-auto"
          >
            <div className="absolute bottom-0 right-0 w-[80%] h-[80%] bg-gradient-to-tl from-emerald-600/10 via-orange-600/10 to-transparent blur-[100px] pointer-events-none"></div>
            <div className="relative grid grid-cols-2 gap-4 lg:gap-6 z-10">
              <motion.div variants={flowItemVariants} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#111a15] border border-white/5 text-center aspect-square hover:border-emerald-500/20 transition-colors">
                <div className="w-12 h-12 bg-emerald-950/30 rounded-xl flex items-center justify-center mb-3 border border-emerald-500/20">
                  <BanknotesIcon className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="text-[10px] font-bold uppercase text-white tracking-wider mb-1">Liquidez</h4>
              </motion.div>

              <motion.div variants={flowItemVariants} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#111a15] border border-emerald-600/20 text-center aspect-square">
                <ShieldCheckIcon className="w-8 h-8 text-emerald-500 animate-pulse mb-3" />
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Creditcoin L1</h5>
              </motion.div>

              <motion.div variants={flowItemVariants} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#111a15] border border-white/5 text-center aspect-square">
                <ChartBarIcon className="w-6 h-6 text-white/60 mb-3" />
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-white">Smart Engine</h5>
              </motion.div>

              <motion.div variants={flowItemVariants} className="relative group flex flex-col items-center justify-center p-4 rounded-2xl bg-[#0d1410] border border-emerald-600/40 text-center aspect-square overflow-hidden">
                <WalletIcon className="w-10 h-10 text-emerald-500 mx-auto mb-2 relative z-10" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white relative z-10">Sua Carteira</h4>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}