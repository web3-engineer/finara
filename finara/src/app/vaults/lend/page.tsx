'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORTAÇÕES DO WAGMI E VIEM ---
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';

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

// ==========================================
// 1. ENDEREÇO E ABI DO CONTRATO
// ==========================================
const FINARA_P2P_ADDRESS = '0x27bff7cb4585eDE371A681DE8748Cb58E45bA8d1';

// ABI expandida para podermos LER os dados da blockchain, além de escrever
const finaraP2PABI = [
    {
        "inputs": [{ "internalType": "uint256", "name": "_loanId", "type": "uint256" }],
        "name": "fundLoan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "loanCounter",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "loanRequests",
        "outputs": [
            { "internalType": "address", "name": "borrower", "type": "address" },
            { "internalType": "uint256", "name": "amountRequested", "type": "uint256" },
            { "internalType": "uint256", "name": "collateralAmount", "type": "uint256" },
            { "internalType": "address", "name": "lender", "type":"address" },
            { "internalType": "bool", "name": "isFunded", "type": "bool" },
            { "internalType": "bool", "name": "isRepaid", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

// --- DADOS MOCKADOS BASE ---
const MOCK_BORROWERS = [
    { id: 'mock-1', isLive: false, address: '0x7a3F…e9D1', score: 98, loans: 12, repaid: 12, amount: 5000, risk: 'Baixo', badge: 'AAA', collateral: '180%', history: '+24 txns', avatar: '🟢' },
    { id: 'mock-2', isLive: false, address: '0xB4c2…3fA8', score: 85, loans: 8, repaid: 7, amount: 3200, risk: 'Baixo', badge: 'AA', collateral: '160%', history: '+15 txns', avatar: '🔵' },
    { id: 'mock-3', isLive: false, address: '0x1De5…7bC0', score: 72, loans: 15, repaid: 13, amount: 8500, risk: 'Médio', badge: 'A', collateral: '150%', history: '+32 txns', avatar: '🟡' },
    { id: 'mock-4', isLive: false, address: '0x9Ff1…2eD4', score: 61, loans: 5, repaid: 4, amount: 1800, risk: 'Médio', badge: 'BBB', collateral: '145%', history: '+8 txns', avatar: '🟠' },
    { id: 'mock-5', isLive: false, address: '0x3Ac8…6dB7', score: 45, loans: 3, repaid: 2, amount: 900, risk: 'Alto', badge: 'BB', collateral: '200%', history: '+4 txns', avatar: '🔴' },
];

const POOL_STATS = [
    { label: 'TVL do Pool', value: '$2.4M', change: '+12.3%', up: true },
    { label: 'APY Médio', value: '8.4%', change: '+0.6%', up: true },
    { label: 'Empréstimos Ativos', value: '43', change: '+5', up: true },
    { label: 'Taxa Repagamento', value: '97.2%', change: '-0.1%', up: false },
];

// ... (MANTENHA AQUI SEUS COMPONENTES CreditGauge, AnimatedCounter, getScoreColor, getScoreBarColor, getRiskBadge) ...
function CreditGauge({ score, size = 80 }: { score: number; size?: number }) {
    const radius = (size - 8) / 2;
    const circumference = Math.PI * radius; 
    const progress = (score / 100) * circumference;
    const color = score >= 80 ? '#10b981' : score >= 60 ? '#f97316' : '#ef4444';

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size / 2 + 16 }}>
            <svg width={size} height={size / 2 + 8} viewBox={`0 0 ${size} ${size / 2 + 8}`}>
                <path d={`M 4 ${size / 2 + 4} A ${radius} ${radius} 0 0 1 ${size - 4} ${size / 2 + 4}`} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" strokeLinecap="round" />
                <motion.path d={`M 4 ${size / 2 + 4} A ${radius} ${radius} 0 0 1 ${size - 4} ${size / 2 + 4}`} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference - progress }} transition={{ duration: 1.2, ease: 'easeOut' }} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
            </svg>
            <div className="absolute bottom-0 text-center">
                <motion.span className="text-xl font-black" style={{ color }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{score}</motion.span>
            </div>
        </div>
    );
}

function getScoreColor(score: number) { return score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-orange-400' : 'text-red-400'; }
function getScoreBarColor(score: number) { return score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-orange-500' : 'bg-red-500'; }
function getRiskBadge(risk: string) {
    if (risk === 'Baixo') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (risk === 'Médio') return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
}

export default function LendPage() {
    const [amount, setAmount] = useState('');
    const [selectedBorrower, setSelectedBorrower] = useState<any>(null); // Agora guarda o objeto inteiro
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false); // Para requests mockados

    // ==========================================
    // LEITURA DA BLOCKCHAIN (Buscando dados Reais)
    // ==========================================
    // 1. Descobre quantos empréstimos existem no total
    const { data: loanCounterData } = useReadContract({
        address: FINARA_P2P_ADDRESS,
        abi: finaraP2PABI,
        functionName: 'loanCounter',
    });

    const latestLoanId = loanCounterData ? Number(loanCounterData) - 1 : -1;

    // 2. Busca os dados do último empréstimo real (se existir)
    const { data: latestLoanData } = useReadContract({
        address: FINARA_P2P_ADDRESS,
        abi: finaraP2PABI,
        functionName: 'loanRequests',
        args: latestLoanId >= 0 ? [BigInt(latestLoanId)] : undefined,
        query: { enabled: latestLoanId >= 0 }
    });

    // 3. Mistura os dados (Híbrido)
    const [displayBorrowers, setDisplayBorrowers] = useState<any[]>(MOCK_BORROWERS);

    useEffect(() => {
        // Se encontramos um empréstimo real na blockchain e ele ainda não foi financiado
        if (latestLoanData && latestLoanData[4] === false) {
            const formattedAmount = Number(formatUnits(latestLoanData[1], 18));
            
            const liveBorrower = {
                id: latestLoanId, // ID real do Smart Contract
                isLive: true,     // Flag para ativar a MetaMask!
                address: `${latestLoanData[0].slice(0, 6)}…${latestLoanData[0].slice(-4)}`,
                score: 50, // Score padrão para novos usuários na Testnet
                loans: 1,
                repaid: 0,
                amount: formattedAmount,
                risk: 'Médio',
                badge: 'NEW',
                collateral: 'Bloqueado',
                history: 'Novo Usuário',
                avatar: '🌐'
            };

            // Coloca o empréstimo real no TOPO da lista, e os mocks em baixo
            setDisplayBorrowers([liveBorrower, ...MOCK_BORROWERS]);
        }
    }, [latestLoanData, latestLoanId]);

    // ==========================================
    // ESCRITA NA BLOCKCHAIN (WAGMI)
    // ==========================================
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isConfirmed) {
            setShowSuccess(true);
            setAmount('');
            setSelectedBorrower(null);
            setTimeout(() => setShowSuccess(false), 4000);
        }
    }, [isConfirmed]);

    // ==========================================
    // AÇÃO DE EMPRESTAR (Mock vs Real)
    // ==========================================
    const handleLend = () => {
        if (!amount || parseFloat(amount) <= 0 || !selectedBorrower) return;

        if (selectedBorrower.isLive) {
            // É um dado REAL! Aciona a MetaMask e a Creditcoin Testnet.
            writeContract({
                address: FINARA_P2P_ADDRESS,
                abi: finaraP2PABI,
                functionName: 'fundLoan',
                args: [BigInt(selectedBorrower.id)], 
            });
        } else {
            // É um dado MOCKADO! Simula a interface para demonstração.
            setIsSimulating(true);
            setTimeout(() => {
                setIsSimulating(false);
                setShowSuccess(true);
                setAmount('');
                setSelectedBorrower(null);
                setTimeout(() => setShowSuccess(false), 3000);
            }, 1500);
        }
    };

    const isProcessing = isPending || isConfirming || isSimulating;

    return (
        <div className="relative min-h-screen pt-28 bg-[#0a0705] text-white selection:bg-emerald-600/30 overflow-x-hidden font-sans">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <FinaraWaves />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#2c1a12 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-800/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-700/5 rounded-full blur-[100px]" />
            </div>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                {/* Header Omitido para brevidade visual, mantenha o seu */}
                <motion.div className="mb-10">
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
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* LEFT: Borrowers List */}
                    <motion.div className="lg:col-span-3 p-6 rounded-[2rem] bg-[#120a07]/60 border border-white/5 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                                <h2 className="text-xs font-bold text-white/60 uppercase tracking-widest">Reputação de Crédito</h2>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {displayBorrowers.map((borrower) => (
                                <motion.div
                                    key={borrower.id}
                                    onClick={() => setSelectedBorrower(selectedBorrower?.id === borrower.id ? null : borrower)}
                                    className={`group p-5 rounded-2xl border cursor-pointer transition-all duration-500 ${selectedBorrower?.id === borrower.id
                                            ? 'bg-emerald-950/30 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.08)] scale-[1.01]'
                                            : 'bg-black/20 border-white/5 hover:bg-white/[0.02] hover:border-white/10'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="hidden sm:block flex-shrink-0">
                                            <CreditGauge score={borrower.score} size={72} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-lg">{borrower.avatar}</span>
                                                <span className="text-sm font-bold text-white/90 font-mono truncate">{borrower.address}</span>
                                                
                                                {/* TAG LIVE TESTNET PARA DADOS REAIS */}
                                                {borrower.isLive && (
                                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-black animate-pulse">
                                                        LIVE TESTNET
                                                    </span>
                                                )}

                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(borrower.risk)}`}>{borrower.risk}</span>
                                            </div>

                                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${borrower.score}%` }} className={`h-full rounded-full ${getScoreBarColor(borrower.score)}`} />
                                            </div>

                                            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-white/30">
                                                <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" />{borrower.loans} empréstimos</span>
                                                <span className="text-emerald-400/60">{borrower.repaid}/{borrower.loans} pagos</span>
                                                <span className="flex items-center gap-1"><LockClosedIcon className="w-3 h-3" />Colateral: {borrower.collateral}</span>
                                            </div>
                                        </div>

                                        <div className="text-right flex-shrink-0">
                                            <div className="text-lg font-black text-white/90">${borrower.amount.toLocaleString()}</div>
                                            <div className="text-[8px] text-white/30 uppercase tracking-widest">Pedido</div>
                                            {selectedBorrower?.id === borrower.id && (
                                                <motion.div className="mt-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mx-auto">
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
                    <motion.div className="lg:col-span-2 space-y-6">
                        <div className="p-6 rounded-[2rem] bg-[#120a07]/60 border border-white/5 backdrop-blur-xl lg:sticky lg:top-28">
                            <div className="flex items-center gap-2 mb-6">
                                <BanknotesIcon className="w-4 h-4 text-emerald-400" />
                                <h2 className="text-xs font-bold text-white/60 uppercase tracking-widest">Emprestar Ativos</h2>
                            </div>

                            <AnimatePresence mode="wait">
                                {selectedBorrower ? (
                                    <motion.div key="selected" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="mb-5 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/15">
                                        <div className="text-[9px] text-emerald-400/60 uppercase tracking-widest mb-2 flex justify-between">
                                            <span>Tomador Selecionado</span>
                                            {selectedBorrower.isLive && <span className="text-emerald-500 font-bold">Transação Real</span>}
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-lg">{selectedBorrower.avatar}</span>
                                            <span className="text-sm font-mono text-white/80">{selectedBorrower.address}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs font-bold flex items-center gap-1 ${getScoreColor(selectedBorrower.score)}`}><StarIcon className="w-3 h-3" /> Score {selectedBorrower.score}/100</span>
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(selectedBorrower.risk)}`}>Risco {selectedBorrower.risk}</span>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-5 p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center">
                                        <UserCircleIcon className="w-8 h-8 text-white/10 mx-auto mb-1" />
                                        <span className="text-[10px] text-white/25">Selecione um tomador na lista</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mb-5">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Valor (USDC)</label>
                                <div className="relative group">
                                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/30 transition-all" />
                                    <button onClick={() => setAmount(selectedBorrower ? String(selectedBorrower.amount) : '1000')} className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-emerald-500/10 text-[9px] font-bold text-emerald-400 uppercase tracking-widest hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">Max</button>
                                </div>
                            </div>

                            <motion.button
                                onClick={handleLend}
                                disabled={isProcessing || !amount || !selectedBorrower}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-500/20 disabled:from-emerald-900/30 disabled:to-emerald-900/20 disabled:text-white/20 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>Confirmar Empréstimo <ChevronRightIcon className="w-3 h-3" /></>
                                )}
                            </motion.button>

                            <AnimatePresence>
                                {showSuccess && (
                                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                                        <div className="text-emerald-400 text-lg mb-1">✓</div>
                                        <span className="text-xs text-emerald-400 font-bold">Empréstimo realizado com sucesso!</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}