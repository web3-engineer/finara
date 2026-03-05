'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowDownTrayIcon,
    ArrowPathIcon,
    ChevronRightIcon,
    ClockIcon,
    CurrencyDollarIcon,
    DocumentCheckIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    LockClosedIcon,
    ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import FinaraWaves from '../../../components/FinaraWaves';

// --- DADOS MOCKADOS ---
const MY_LOANS = [
    { id: 1, amount: 2500, date: '01 Mar', status: 'Ativo', dueDate: '01 Jun', interest: '5.2%', lender: '0x7a3F…e9D1', health: 1.85 },
    { id: 2, amount: 800, date: '28 Fev', status: 'Pago', dueDate: '28 Mai', interest: '4.8%', lender: '0xB4c2…3fA8', health: 0 },
    { id: 3, amount: 1200, date: '15 Fev', status: 'Pago', dueDate: '15 Mai', interest: '5.0%', lender: '0x1De5…7bC0', health: 0 },
];

const AVAILABLE_POOLS = [
    { name: 'USDC Estável', apy: '5.2%', available: '$840K', minCollateral: '130%', risk: 'Baixo', utilization: 72, icon: '💵' },
    { name: 'CTC Flex', apy: '7.8%', available: '$320K', minCollateral: '150%', risk: 'Médio', utilization: 58, icon: '⚡' },
    { name: 'ETH Bridge', apy: '6.1%', available: '$1.2M', minCollateral: '140%', risk: 'Baixo', utilization: 45, icon: '🔗' },
];

const SUMMARY_STATS = [
    { label: 'Débito Total', value: '$2,500' },
    { label: 'Colateral Trancado', value: '$4,625' },
    { label: 'Saúde da Posição', value: '1.85x' },
    { label: 'Próximo Vencimento', value: '01 Jun' },
];

// --- HEALTH FACTOR BAR ---
function HealthBar({ health }: { health: number }) {
    const percentage = Math.min((health / 3) * 100, 100);
    const color = health >= 1.5 ? '#10b981' : health >= 1.2 ? '#f97316' : '#ef4444';
    const label = health >= 1.5 ? 'Saudável' : health >= 1.2 ? 'Atenção' : 'Crítico';

    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}40` }}
                />
            </div>
            <span className="text-[10px] font-bold" style={{ color }}>{label}</span>
        </div>
    );
}

// --- UTILIZATION RING ---
function UtilizationRing({ percentage, size = 44 }: { percentage: number; size?: number }) {
    const radius = (size - 6) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <motion.circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - progress }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white/50">
                {percentage}%
            </div>
        </div>
    );
}

export default function BorrowPage() {
    const [amount, setAmount] = useState('');
    const [collateral, setCollateral] = useState('');
    const [selectedPool, setSelectedPool] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Auto-calculate collateral
    useEffect(() => {
        if (amount && selectedPool !== null) {
            const ratio = parseFloat(AVAILABLE_POOLS[selectedPool].minCollateral) / 100;
            setCollateral((parseFloat(amount) * ratio).toFixed(2));
        }
    }, [amount, selectedPool]);

    const handleBorrow = () => {
        if (!amount || parseFloat(amount) <= 0 || selectedPool === null) return;
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setShowSuccess(true);
            setAmount('');
            setCollateral('');
            setSelectedPool(null);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="relative min-h-screen pt-28 bg-[#0a0705] text-white selection:bg-orange-600/30 overflow-x-hidden font-sans">

            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <FinaraWaves />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#2c1a12 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-800/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-700/5 rounded-full blur-[100px]" />
            </div>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
                        </span>
                        <span className="text-[10px] font-bold text-orange-500/80 tracking-[0.2em] uppercase">Creditcoin Network • Live</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-1">
                        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">Borrow</span> — Pedir Emprestado
                    </h1>
                    <p className="text-white/40 text-sm max-w-lg">
                        Deposite colateral e receba ativos instantaneamente. Monitore a saúde da sua posição em tempo real.
                    </p>
                </motion.div>

                {/* Summary Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
                >
                    {SUMMARY_STATS.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15 + i * 0.08 }}
                            className="p-5 rounded-2xl bg-[#120a07]/60 border border-white/5 backdrop-blur-xl hover:border-orange-500/15 transition-all duration-500"
                        >
                            <div className="text-xl font-bold text-white">{stat.value}</div>
                            <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-1">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">

                    {/* LEFT: Available Pools */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3 p-6 rounded-[2rem] bg-[#120a07]/60 border border-white/5 backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <CurrencyDollarIcon className="w-4 h-4 text-orange-400" />
                                <h2 className="text-xs font-bold text-white/60 uppercase tracking-widest">Pools Disponíveis</h2>
                            </div>
                            <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Clique para selecionar</div>
                        </div>

                        <div className="space-y-3">
                            {AVAILABLE_POOLS.map((pool, i) => (
                                <motion.div
                                    key={pool.name}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1, type: 'spring', bounce: 0.3 }}
                                    onClick={() => setSelectedPool(selectedPool === i ? null : i)}
                                    className={`group p-5 rounded-2xl border cursor-pointer transition-all duration-500 ${selectedPool === i
                                            ? 'bg-orange-950/20 border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.08)] scale-[1.01]'
                                            : 'bg-black/20 border-white/5 hover:bg-white/[0.02] hover:border-white/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <UtilizationRing percentage={pool.utilization} />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xl">{pool.icon}</span>
                                                <h3 className="text-sm font-bold text-white">{pool.name}</h3>
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${pool.risk === 'Baixo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                                    }`}>{pool.risk}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-5 text-[10px] text-white/30">
                                                <span>Disponível: <span className="text-white/50 font-bold">{pool.available}</span></span>
                                                <span>Colateral: <span className="text-white/50 font-bold">{pool.minCollateral}</span></span>
                                                <span>Utilização: <span className="text-orange-400/70 font-bold">{pool.utilization}%</span></span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-orange-400">{pool.apy}</div>
                                            <div className="text-[8px] text-white/30 uppercase tracking-widest">APY</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* RIGHT: Borrow Action */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 p-6 rounded-[2rem] bg-[#120a07]/60 border border-white/5 backdrop-blur-xl h-fit lg:sticky lg:top-28"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <ArrowDownTrayIcon className="w-4 h-4 text-orange-400" />
                            <h2 className="text-xs font-bold text-white/60 uppercase tracking-widest">Solicitar Empréstimo</h2>
                        </div>

                        <AnimatePresence mode="wait">
                            {selectedPool !== null ? (
                                <motion.div key="selected" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                                    className="mb-5 p-4 rounded-xl bg-orange-950/20 border border-orange-500/15"
                                >
                                    <div className="text-[9px] text-orange-400/60 uppercase tracking-widest mb-1">Pool Selecionado</div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-white flex items-center gap-2">
                                            <span className="text-lg">{AVAILABLE_POOLS[selectedPool].icon}</span>
                                            {AVAILABLE_POOLS[selectedPool].name}
                                        </span>
                                        <span className="text-sm font-bold text-orange-400">{AVAILABLE_POOLS[selectedPool].apy}</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="mb-5 p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center"
                                >
                                    <CurrencyDollarIcon className="w-8 h-8 text-white/10 mx-auto mb-1" />
                                    <span className="text-[10px] text-white/25">Selecione um pool</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Amount */}
                        <div className="mb-4">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Valor Empréstimo (USDC)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/30 focus:shadow-[0_0_20px_rgba(249,115,22,0.08)] transition-all"
                            />
                        </div>

                        {/* Auto-calculated Collateral */}
                        <div className="mb-5 p-3 rounded-xl bg-black/20 border border-white/5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-white/40 flex items-center gap-1"><LockClosedIcon className="w-3 h-3" /> Colateral Necessário</span>
                                <span className="text-orange-400 font-bold">{collateral ? `$${collateral} CTC` : '—'}</span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-3 mb-5 p-4 rounded-xl bg-black/20 border border-white/5">
                            <div className="flex justify-between text-xs">
                                <span className="text-white/40 flex items-center gap-1"><ArrowTrendingUpIcon className="w-3 h-3" /> Juros</span>
                                <span className="text-orange-400 font-bold">{selectedPool !== null ? AVAILABLE_POOLS[selectedPool].apy : '—'}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-white/40">Prazo</span>
                                <span className="text-white/60 font-medium">90 dias</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-white/40">Fator de Saúde</span>
                                <span className="text-emerald-400 font-bold">~1.85x</span>
                            </div>
                        </div>

                        <motion.button
                            onClick={handleBorrow}
                            disabled={isProcessing || !amount || selectedPool === null}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 shadow-lg shadow-orange-900/30 hover:shadow-orange-500/20 disabled:from-orange-900/30 disabled:to-orange-900/20 disabled:text-white/20 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                            ) : (
                                <>Pedir Emprestado <ChevronRightIcon className="w-3 h-3" /></>
                            )}
                        </motion.button>

                        <AnimatePresence>
                            {showSuccess && (
                                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    className="mt-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center"
                                >
                                    <div className="text-orange-400 text-lg mb-1">✓</div>
                                    <span className="text-xs text-orange-400 font-bold">Empréstimo solicitado com sucesso!</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* My Loans */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="p-6 rounded-[2rem] bg-[#120a07]/60 border border-white/5 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <DocumentCheckIcon className="w-4 h-4 text-white/40" />
                        <h2 className="text-xs font-bold text-white/60 uppercase tracking-widest">Meus Empréstimos</h2>
                    </div>

                    <div className="space-y-3">
                        {MY_LOANS.map((loan, i) => (
                            <motion.div
                                key={loan.id}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-5 rounded-xl bg-black/20 border border-white/5 hover:bg-white/[0.02] transition-all duration-300"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${loan.status === 'Ativo' ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'
                                            }`}>
                                            {loan.status === 'Ativo'
                                                ? <ExclamationTriangleIcon className="w-5 h-5 text-orange-400" />
                                                : <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                                            }
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">${loan.amount.toLocaleString()} USDC</div>
                                            <div className="text-[9px] text-white/30">{loan.date} → {loan.dueDate} • {loan.interest} APY • De: {loan.lender}</div>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border ${loan.status === 'Ativo'
                                            ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        }`}>{loan.status}</span>
                                </div>
                                {loan.health > 0 && <HealthBar health={loan.health} />}
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
