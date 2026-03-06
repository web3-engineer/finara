'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BanknotesIcon,
    ArrowPathIcon,
    ChevronRightIcon,
    ShieldCheckIcon,
    StarIcon,
    UserCircleIcon,
    ClockIcon,
    CheckBadgeIcon,
    ArrowTrendingUpIcon,
    LockClosedIcon,
    FireIcon,
} from '@heroicons/react/24/outline';
import FinaraWaves from '../../../components/FinaraWaves';

// --- DADOS MOCKADOS ---
const BORROWERS = [
    { address: '0x7a3F…e9D1', score: 98, loans: 12, repaid: 12, amount: 5000, risk: 'Baixo', badge: 'AAA', collateral: '180%', history: '+24 txns', avatar: '🟢' },
    { address: '0xB4c2…3fA8', score: 85, loans: 8, repaid: 7, amount: 3200, risk: 'Baixo', badge: 'AA', collateral: '160%', history: '+15 txns', avatar: '🔵' },
    { address: '0x1De5…7bC0', score: 72, loans: 15, repaid: 13, amount: 8500, risk: 'Médio', badge: 'A', collateral: '150%', history: '+32 txns', avatar: '🟡' },
    { address: '0x9Ff1…2eD4', score: 61, loans: 5, repaid: 4, amount: 1800, risk: 'Médio', badge: 'BBB', collateral: '145%', history: '+8 txns', avatar: '🟠' },
    { address: '0x3Ac8…6dB7', score: 45, loans: 3, repaid: 2, amount: 900, risk: 'Alto', badge: 'BB', collateral: '200%', history: '+4 txns', avatar: '🔴' },
];

const POOL_STATS = [
    { label: 'TVL do Pool', value: '$2.4M', change: '+12.3%', up: true },
    { label: 'APY Médio', value: '8.4%', change: '+0.6%', up: true },
    { label: 'Empréstimos Ativos', value: '43', change: '+5', up: true },
    { label: 'Taxa Repagamento', value: '97.2%', change: '-0.1%', up: false },
];

// --- COMPONENTE GAUGE DE CRÉDITO (SVG) ---
function CreditGauge({ score, size = 80 }: { score: number; size?: number }) {
    const radius = (size - 8) / 2;
    const circumference = Math.PI * radius; // semicírculo
    const progress = (score / 100) * circumference;

    const color = score >= 80 ? '#10b981' : score >= 60 ? '#f97316' : '#ef4444';
    const bgColor = score >= 80 ? 'rgba(16,185,129,0.1)' : score >= 60 ? 'rgba(249,115,22,0.1)' : 'rgba(239,68,68,0.1)';

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size / 2 + 16 }}>
            <svg width={size} height={size / 2 + 8} viewBox={`0 0 ${size} ${size / 2 + 8}`}>
                {/* Background arc */}
                <path
                    d={`M 4 ${size / 2 + 4} A ${radius} ${radius} 0 0 1 ${size - 4} ${size / 2 + 4}`}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="6"
                    strokeLinecap="round"
                />
                {/* Progress arc */}
                <motion.path
                    d={`M 4 ${size / 2 + 4} A ${radius} ${radius} 0 0 1 ${size - 4} ${size / 2 + 4}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - progress }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{ filter: `drop-shadow(0 0 6px ${color})` }}
                />
            </svg>
            <div className="absolute bottom-0 text-center">
                <motion.span
                    className="text-xl font-black"
                    style={{ color }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {score}
                </motion.span>
            </div>
        </div>
    );
}

// --- COMPONENTE COUNTER ANIMADO ---
function AnimatedCounter({ value, prefix = '' }: { value: number; prefix?: string }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const duration = 1200;
        const steps = 30;
        const increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [value]);
    return <span>{prefix}{count.toLocaleString()}</span>;
}

function getScoreColor(score: number) {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
}

function getScoreBarColor(score: number) {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
}

function getRiskBadge(risk: string) {
    if (risk === 'Baixo') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (risk === 'Médio') return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
}

export default function LendPage() {
    const [amount, setAmount] = useState('');
    const [selectedBorrower, setSelectedBorrower] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleLend = () => {
        if (!amount || parseFloat(amount) <= 0 || selectedBorrower === null) return;
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setShowSuccess(true);
            setAmount('');
            setSelectedBorrower(null);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="relative min-h-screen pt-28 bg-[#0a0705] text-white selection:bg-emerald-600/30 overflow-x-hidden font-sans">

            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <FinaraWaves />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#2c1a12 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-800/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-700/5 rounded-full blur-[100px]" />
            </div>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                        </span>
                        <span className="text-[10px] font-bold text-emerald-500/80 tracking-[0.2em] uppercase">Creditcoin Network • Live</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-1">
                        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400">Lend</span> — Emprestar
                    </h1>
                    <p className="text-white/40 text-sm max-w-lg">
                        Empreste seus ativos com segurança. O sistema de reputação de crédito da Creditcoin analisa cada tomador.
                    </p>
                </motion.div>

                {/* Pool Stats - Animated */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
                >
                    {POOL_STATS.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15 + i * 0.08 }}
                            className="group p-5 rounded-2xl bg-[#120a07]/60 border border-white/5 backdrop-blur-xl hover:border-emerald-500/15 transition-all duration-500"
                        >
                            <div className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">{stat.value}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{stat.label}</span>
                                <span className={`text-[9px] font-bold ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {stat.up ? '↑' : '↓'} {stat.change}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* LEFT: Borrowers with Reputation */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3 p-6 rounded-[2rem] bg-[#120a07]/60 border border-white/5 backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                                <h2 className="text-xs font-bold text-white/60 uppercase tracking-widest">Reputação de Crédito</h2>
                            </div>
                            <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Clique para selecionar</div>
                        </div>

                        <div className="space-y-3">
                            {BORROWERS.map((borrower, i) => (
                                <motion.div
                                    key={borrower.address}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1, type: 'spring', bounce: 0.3 }}
                                    onClick={() => setSelectedBorrower(selectedBorrower === i ? null : i)}
                                    className={`group p-5 rounded-2xl border cursor-pointer transition-all duration-500 ${selectedBorrower === i
                                            ? 'bg-emerald-950/30 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.08)] scale-[1.01]'
                                            : 'bg-black/20 border-white/5 hover:bg-white/[0.02] hover:border-white/10'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Gauge */}
                                        <div className="hidden sm:block flex-shrink-0">
                                            <CreditGauge score={borrower.score} size={72} />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-lg">{borrower.avatar}</span>
                                                <span className="text-sm font-bold text-white/90 font-mono truncate">{borrower.address}</span>
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(borrower.risk)}`}>
                                                    {borrower.risk}
                                                </span>
                                                <span className="text-[9px] text-white/20 flex items-center gap-0.5">
                                                    <CheckBadgeIcon className="w-3 h-3 text-emerald-500/50" /> {borrower.badge}
                                                </span>
                                            </div>

                                            {/* Score Bar */}
                                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${borrower.score}%` }}
                                                    transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                                                    className={`h-full rounded-full ${getScoreBarColor(borrower.score)}`}
                                                    style={{ boxShadow: `0 0 8px ${borrower.score >= 80 ? 'rgba(16,185,129,0.4)' : borrower.score >= 60 ? 'rgba(249,115,22,0.4)' : 'rgba(239,68,68,0.4)'}` }}
                                                />
                                            </div>

                                            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-white/30">
                                                <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" />{borrower.loans} empréstimos</span>
                                                <span className="text-emerald-400/60">{borrower.repaid}/{borrower.loans} pagos</span>
                                                <span className="flex items-center gap-1"><LockClosedIcon className="w-3 h-3" />Colateral: {borrower.collateral}</span>
                                                <span>{borrower.history}</span>
                                            </div>
                                        </div>

                                        {/* Amount Request */}
                                        <div className="text-right flex-shrink-0">
                                            <div className="text-lg font-black text-white/90">${borrower.amount.toLocaleString()}</div>
                                            <div className="text-[8px] text-white/30 uppercase tracking-widest">Pedido</div>
                                            {selectedBorrower === i && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="mt-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mx-auto"
                                                >
                                                    <CheckBadgeIcon className="w-4 h-4 text-white" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* RIGHT: Lending Action */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Action Card */}
                        <div className="p-6 rounded-[2rem] bg-[#120a07]/60 border border-white/5 backdrop-blur-xl lg:sticky lg:top-28">
                            <div className="flex items-center gap-2 mb-6">
                                <BanknotesIcon className="w-4 h-4 text-emerald-400" />
                                <h2 className="text-xs font-bold text-white/60 uppercase tracking-widest">Emprestar Ativos</h2>
                            </div>

                            {/* Selected Borrower Info */}
                            <AnimatePresence mode="wait">
                                {selectedBorrower !== null ? (
                                    <motion.div
                                        key="selected"
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className="mb-5 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/15"
                                    >
                                        <div className="text-[9px] text-emerald-400/60 uppercase tracking-widest mb-2">Tomador Selecionado</div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{BORROWERS[selectedBorrower].avatar}</span>
                                                <span className="text-sm font-mono text-white/80">{BORROWERS[selectedBorrower].address}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs font-bold flex items-center gap-1 ${getScoreColor(BORROWERS[selectedBorrower].score)}`}>
                                                <StarIcon className="w-3 h-3" /> Score {BORROWERS[selectedBorrower].score}/100
                                            </span>
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(BORROWERS[selectedBorrower].risk)}`}>
                                                Risco {BORROWERS[selectedBorrower].risk}
                                            </span>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="placeholder"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="mb-5 p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center"
                                    >
                                        <UserCircleIcon className="w-8 h-8 text-white/10 mx-auto mb-1" />
                                        <span className="text-[10px] text-white/25">Selecione um tomador na lista</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Amount */}
                            <div className="mb-5">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">
                                    Valor (USDC)
                                </label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/30 focus:shadow-[0_0_20px_rgba(16,185,129,0.08)] transition-all"
                                    />
                                    <button
                                        onClick={() => setAmount(selectedBorrower !== null ? String(BORROWERS[selectedBorrower].amount) : '1000')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-emerald-500/10 text-[9px] font-bold text-emerald-400 uppercase tracking-widest hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                                    >
                                        Max
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-3 mb-5 p-4 rounded-xl bg-black/20 border border-white/5">
                                <div className="flex justify-between text-xs">
                                    <span className="text-white/40 flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3" /> APY Estimado</span>
                                    <span className="text-emerald-400 font-bold">8.4%</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-white/40 flex items-center gap-1"><FireIcon className="w-3 h-3" /> Taxa de Rede</span>
                                    <span className="text-white/60 font-medium">~$0.02</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-white/40 flex items-center gap-1"><LockClosedIcon className="w-3 h-3" /> Colateral</span>
                                    <span className="text-white/60 font-medium">
                                        {selectedBorrower !== null ? BORROWERS[selectedBorrower].collateral : '—'} (CTC)
                                    </span>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div className="flex justify-between text-xs">
                                    <span className="text-white/50 font-medium">Você recebe em</span>
                                    <span className="text-white/70 font-bold">~90 dias</span>
                                </div>
                            </div>

                            {/* Submit */}
                            <motion.button
                                onClick={handleLend}
                                disabled={isProcessing || !amount || selectedBorrower === null}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-500/20 disabled:from-emerald-900/30 disabled:to-emerald-900/20 disabled:text-white/20 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>Confirmar Empréstimo <ChevronRightIcon className="w-3 h-3" /></>
                                )}
                            </motion.button>

                            <AnimatePresence>
                                {showSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center"
                                    >
                                        <div className="text-emerald-400 text-lg mb-1">✓</div>
                                        <span className="text-xs text-emerald-400 font-bold">Empréstimo realizado com sucesso!</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-20 py-10 border-t border-white/5 bg-black/20 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-white/30 text-[10px] gap-6 font-bold uppercase tracking-widest">
                    <div>© 2026 <span className="text-emerald-500">Finara</span> Ecosystem. Powered by Creditcoin Network.</div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Discord</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Github</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
