'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    SparklesIcon,
    ArrowTrendingUpIcon,
    ChartBarIcon,
    ClockIcon,
    BanknotesIcon,
    CurrencyDollarIcon,
    ArrowUpIcon,
    FireIcon,
} from '@heroicons/react/24/outline';
import FinaraWaves from '../../../components/FinaraWaves';

// --- DADOS MOCKADOS ---
const YIELD_POSITIONS = [
    { pool: 'USDC/CTC Stable', deposited: 5000, earned: 212, apy: '8.4%', days: 92, status: 'Ativo', dailyYield: 2.30, trend: [40, 55, 48, 62, 58, 75, 82] },
    { pool: 'ETH/CTC Bridge', deposited: 3200, earned: 98, apy: '6.1%', days: 58, status: 'Ativo', dailyYield: 1.69, trend: [20, 28, 32, 30, 45, 42, 55] },
    { pool: 'CTC Flex Vault', deposited: 1800, earned: 340, apy: '12.2%', days: 180, status: 'Encerrado', dailyYield: 0, trend: [60, 72, 80, 88, 95, 90, 85] },
];

const MONTHLY_EARNINGS = [
    { month: 'Out', value: 42 },
    { month: 'Nov', value: 78 },
    { month: 'Dez', value: 125 },
    { month: 'Jan', value: 198 },
    { month: 'Fev', value: 310 },
    { month: 'Mar', value: 650 },
];

const SUMMARY = [
    { label: 'Total Depositado', value: 10000, prefix: '$', icon: BanknotesIcon },
    { label: 'Rendimento Total', value: 650, prefix: '$', icon: SparklesIcon },
    { label: 'APY Médio', value: 8.9, prefix: '', suffix: '%', icon: ArrowTrendingUpIcon },
    { label: 'Posições Ativas', value: 2, prefix: '', icon: ChartBarIcon },
];

// --- ANIMATED COUNTER ---
function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const duration = 1500;
        const steps = 40;
        const increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Number(current.toFixed(1)));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [value]);
    return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// --- PROGRESS RING ---
function ProgressRing({ earned, deposited, size = 160 }: { earned: number; deposited: number; size?: number }) {
    const percentage = (earned / deposited) * 100;
    const radius = (size - 12) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (percentage / 15) * circumference; // 15% max for visual scale

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                <motion.circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none"
                    stroke="url(#yieldGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - progress }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                />
                <defs>
                    <linearGradient id="yieldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <CurrencyDollarIcon className="w-5 h-5 text-amber-400 mb-1" />
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-orange-500">
                    <AnimatedCounter value={earned} prefix="$" />
                </div>
                <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-0.5">Total Ganho</div>
            </div>
        </div>
    );
}

// --- MINI SPARKLINE ---
function Sparkline({ data, color = '#f59e0b' }: { data: number[]; color?: string }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 28;
    const padding = 2;

    const points = data.map((v, i) => {
        const x = padding + (i / (data.length - 1)) * (width - padding * 2);
        const y = height - padding - ((v - min) / range) * (height - padding * 2);
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="opacity-60 group-hover:opacity-100 transition-opacity">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    );
}

export default function YieldsPage() {
    const maxEarning = Math.max(...MONTHLY_EARNINGS.map(e => e.value));
    const totalEarned = YIELD_POSITIONS.reduce((sum, p) => sum + p.earned, 0);
    const totalDeposited = YIELD_POSITIONS.reduce((sum, p) => sum + p.deposited, 0);

    return (
        <div className="relative min-h-screen pt-28 bg-[#0a0705] text-white selection:bg-amber-600/30 overflow-x-hidden font-sans">

            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <FinaraWaves />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#2c1a12 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-amber-800/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-emerald-700/5 rounded-full blur-[100px]" />
            </div>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                        </span>
                        <span className="text-[10px] font-bold text-amber-500/80 tracking-[0.2em] uppercase">Creditcoin Network • Live</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-1">
                        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500">Yields</span> — Rendimentos
                    </h1>
                    <p className="text-white/40 text-sm max-w-lg">
                        Acompanhe seus rendimentos em tempo real. Veja o crescimento do seu portfólio no ecossistema Finara.
                    </p>
                </motion.div>

                {/* Summary Cards - with animated counters */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
                >
                    {SUMMARY.map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15 + i * 0.08 }}
                            className="p-5 rounded-2xl bg-[#120a07]/60 border border-white/5 backdrop-blur-xl hover:border-amber-500/15 transition-all duration-500 group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-amber-500/20 group-hover:bg-amber-500/5 transition-all duration-500">
                                    <item.icon className="w-4 h-4 text-amber-400" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                                        <AnimatedCounter value={item.value} prefix={item.prefix} suffix={item.suffix || ''} />
                                    </div>
                                    <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{item.label}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">

                    {/* LEFT: Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3 p-6 rounded-[2rem] bg-[#120a07]/60 border border-white/5 backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <ArrowTrendingUpIcon className="w-4 h-4 text-amber-400" />
                                <h2 className="text-xs font-bold text-white/60 uppercase tracking-widest">Rendimento Mensal</h2>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs">
                                <ArrowUpIcon className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-bold">+109%</span>
                                <span className="text-white/30 text-[9px]">este mês</span>
                            </div>
                        </div>

                        {/* Bar Chart - enhanced */}
                        <div className="flex items-end gap-4 h-56 mb-4">
                            {MONTHLY_EARNINGS.map((item, i) => (
                                <motion.div
                                    key={item.month}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(item.value / maxEarning) * 100}%` }}
                                    transition={{ delay: 0.4 + i * 0.12, duration: 0.7, ease: 'easeOut' }}
                                    className="flex-1 relative group cursor-pointer"
                                >
                                    <div className="w-full h-full rounded-xl bg-gradient-to-t from-amber-600/40 via-amber-500/60 to-amber-400/80 group-hover:from-amber-500/60 group-hover:via-amber-400/80 group-hover:to-yellow-400 transition-all duration-500 relative overflow-hidden">
                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-1 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 pointer-events-none z-10">
                                        <div className="text-[10px] font-bold text-amber-400">${item.value}</div>
                                        <div className="text-[8px] text-white/30 text-center">{item.month}</div>
                                    </div>
                                    {/* Glow dot */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 + i * 0.1 }}
                                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.6)] opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex gap-4">
                            {MONTHLY_EARNINGS.map((item) => (
                                <div key={item.month} className="flex-1 text-center text-[10px] text-white/30 font-medium">
                                    {item.month}
                                </div>
                            ))}
                        </div>

                        {/* Bottom info */}
                        <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FireIcon className="w-4 h-4 text-amber-400" />
                                <span className="text-xs text-white/50">Melhor mês: <span className="text-amber-400 font-bold">Março ($650)</span></span>
                            </div>
                            <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Últimos 6 meses</span>
                        </div>
                    </motion.div>

                    {/* RIGHT: Progress Ring + Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 p-6 rounded-[2rem] bg-[#120a07]/60 border border-white/5 backdrop-blur-xl flex flex-col items-center justify-center"
                    >
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-[50px] animate-pulse" />
                            <ProgressRing earned={totalEarned} deposited={totalDeposited} size={180} />
                        </div>

                        <div className="w-full space-y-3 p-4 rounded-xl bg-black/20 border border-white/5">
                            <div className="flex justify-between text-xs">
                                <span className="text-white/40">Rendimento Diário</span>
                                <span className="text-amber-400 font-bold">~$3.99/dia</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-white/40">Rendimento Semanal</span>
                                <span className="text-amber-400 font-bold">~$27.93/sem</span>
                            </div>
                            <div className="h-px bg-white/5" />
                            <div className="flex justify-between text-xs">
                                <span className="text-white/50 font-medium">Projeção Anual</span>
                                <span className="text-white/70 font-bold">~$1,456</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* My Yield Positions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-6 rounded-[2rem] bg-[#120a07]/60 border border-white/5 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <ChartBarIcon className="w-4 h-4 text-white/40" />
                        <h2 className="text-xs font-bold text-white/60 uppercase tracking-widest">Minhas Posições</h2>
                    </div>

                    <div className="space-y-3">
                        {YIELD_POSITIONS.map((pos, i) => (
                            <motion.div
                                key={pos.pool}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-5 rounded-2xl bg-black/20 border border-white/5 hover:bg-white/[0.02] hover:border-amber-500/10 transition-all duration-500"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Sparkline */}
                                    <div className="hidden sm:block flex-shrink-0">
                                        <Sparkline data={pos.trend} color={pos.status === 'Ativo' ? '#f59e0b' : '#6b7280'} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-sm font-bold text-white">{pos.pool}</h3>
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${pos.status === 'Ativo'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-white/5 text-white/30 border-white/10'
                                                }`}>{pos.status}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-5 text-[10px] text-white/30">
                                            <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" /> {pos.days} dias</span>
                                            <span>Depositado: <span className="text-white/50 font-bold">${pos.deposited.toLocaleString()}</span></span>
                                            <span>APY: <span className="text-amber-400 font-bold">{pos.apy}</span></span>
                                            {pos.dailyYield > 0 && (
                                                <span className="text-emerald-400/70">+${pos.dailyYield}/dia</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right flex-shrink-0">
                                        <div className="text-xl font-black text-amber-400">+${pos.earned}</div>
                                        <div className="text-[8px] text-white/30 uppercase tracking-widest">Ganho</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
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
