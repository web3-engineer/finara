'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORTAÇÕES DO WAGMI ---
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';

import {
    ArrowDownTrayIcon,
    ArrowPathIcon,
    ChevronRightIcon,
    CurrencyDollarIcon,
    DocumentCheckIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    LockClosedIcon,
    ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import FinaraWaves from '../../../components/FinaraWaves';

// ==========================================
// 1. ENDEREÇOS E ABIs DA TESTNET
// ==========================================
const FINARA_P2P_ADDRESS = '0x27bff7cb4585eDE371A681DE8748Cb58E45bA8d1';
const FBTC_ADDRESS = '0x1891E2BD42D35E033FCdeDD028bc3Bd37c902557'; // Colateral que precisa ser travado

// ABI do ERC20 (Para aprovar o gasto do FBTC)
const erc20ABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "spender", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "owner", "type": "address" },
            { "internalType": "address", "name": "spender", "type": "address" }
        ],
        "name": "allowance",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

// ABI do FinaraP2P
const finaraP2PABI = [
    {
        "inputs": [
            { "internalType": "uint256", "name": "_amount", "type": "uint256" },
            { "internalType": "uint256", "name": "_collateral", "type": "uint256" }
        ],
        "name": "createLoanRequest",
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

// --- DADOS MOCKADOS ---
const MOCK_MY_LOANS = [
    { id: 'mock-1', isLive: false, amount: 2500, date: '01 Mar', status: 'Aguardando', dueDate: '01 Jun', interest: '5.2%', lender: 'Buscando...', health: 1.85 },
    { id: 'mock-2', isLive: false, amount: 800, date: '28 Fev', status: 'Pago', dueDate: '28 Mai', interest: '4.8%', lender: '0xB4c2…3fA8', health: 0 },
];

const AVAILABLE_POOLS = [
    { name: 'USDC Estável', apy: '5.2%', available: '$840K', minCollateral: '130%', risk: 'Baixo', utilization: 72, icon: '💵' },
    { name: 'CTC Flex', apy: '7.8%', available: '$320K', minCollateral: '150%', risk: 'Médio', utilization: 58, icon: '⚡' },
];

const SUMMARY_STATS = [
    { label: 'Débito Total', value: '$2,500' },
    { label: 'Colateral Trancado', value: '$4,625' },
    { label: 'Saúde da Posição', value: '1.85x' },
    { label: 'Próximo Vencimento', value: '01 Jun' },
];

// ... (MANTENHA AQUI OS SEUS COMPONENTES HealthBar E UtilizationRing INTACTOS) ...
function HealthBar({ health }: { health: number }) {
    const percentage = Math.min((health / 3) * 100, 100);
    const color = health >= 1.5 ? '#10b981' : health >= 1.2 ? '#f97316' : '#ef4444';
    const label = health >= 1.5 ? 'Saudável' : health >= 1.2 ? 'Atenção' : 'Crítico';

    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}40` }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color }}>{label}</span>
        </div>
    );
}

function UtilizationRing({ percentage, size = 44 }: { percentage: number; size?: number }) {
    const radius = (size - 6) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <motion.circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference - progress }} transition={{ duration: 1, ease: 'easeOut' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white/50">{percentage}%</div>
        </div>
    );
}


export default function BorrowPage() {
    const { address } = useAccount();
    const [amount, setAmount] = useState('');
    const [collateral, setCollateral] = useState('');
    const [selectedPool, setSelectedPool] = useState<number | null>(null);
    const [step, setStep] = useState<'input' | 'approving' | 'creating' | 'success'>('input');
    const [displayLoans, setDisplayLoans] = useState<any[]>(MOCK_MY_LOANS);

    // ==========================================
    // CÁLCULO DE GARANTIA E LEITURA DA REDE
    // ==========================================
    useEffect(() => {
        if (amount && selectedPool !== null) {
            const ratio = parseFloat(AVAILABLE_POOLS[selectedPool].minCollateral) / 100;
            setCollateral((parseFloat(amount) * ratio).toFixed(2));
        }
    }, [amount, selectedPool]);

    // Lê se o usuário tem pedidos reais na blockchain
    const { data: loanCounterData } = useReadContract({
        address: FINARA_P2P_ADDRESS,
        abi: finaraP2PABI,
        functionName: 'loanCounter',
    });

    const latestLoanId = loanCounterData ? Number(loanCounterData) - 1 : -1;

    const { data: latestLoanData } = useReadContract({
        address: FINARA_P2P_ADDRESS,
        abi: finaraP2PABI,
        functionName: 'loanRequests',
        args: latestLoanId >= 0 ? [BigInt(latestLoanId)] : undefined,
        query: { enabled: latestLoanId >= 0 }
    });

    // Mistura os dados híbridos (Apenas mostra pedidos REAIS se a carteira for a mesma de quem pediu)
    useEffect(() => {
        if (latestLoanData && address && latestLoanData[0].toLowerCase() === address.toLowerCase()) {
            const liveLoan = {
                id: `live-${latestLoanId}`,
                isLive: true,
                amount: Number(formatUnits(latestLoanData[1], 18)),
                date: 'Hoje',
                status: latestLoanData[5] ? 'Pago' : latestLoanData[4] ? 'Ativo' : 'Aguardando',
                dueDate: '90 dias',
                interest: '8.4%',
                lender: latestLoanData[4] ? `${latestLoanData[3].slice(0, 6)}…${latestLoanData[3].slice(-4)}` : 'Buscando...',
                health: 1.5
            };
            setDisplayLoans([liveLoan, ...MOCK_MY_LOANS]);
        }
    }, [latestLoanData, address, latestLoanId]);

    // ==========================================
    // TRANSAÇÕES ON-CHAIN (O Fluxo Duplo)
    // ==========================================
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: FBTC_ADDRESS,
        abi: erc20ABI,
        functionName: 'allowance',
        args: address ? [address, FINARA_P2P_ADDRESS] : undefined,
        query: { enabled: !!address }
    });

    const needsApproval = !allowance || (collateral && parseUnits(collateral, 18) > (allowance as bigint));

    const { writeContract: writeApprove, data: approveHash } = useWriteContract();
    const { writeContract: writeCreateLoan, data: loanHash } = useWriteContract();

    const { isSuccess: isApproveSuccess, isLoading: isApproveLoading } = useWaitForTransactionReceipt({ hash: approveHash });
    const { isSuccess: isLoanSuccess, isLoading: isLoanLoading } = useWaitForTransactionReceipt({ hash: loanHash });

    useEffect(() => {
        if (isApproveLoading) setStep('approving');
        if (isApproveSuccess) {
            refetchAllowance(); 
            setStep('input');
        }
        if (isLoanLoading) setStep('creating');
        if (isLoanSuccess) {
            setStep('success');
            setAmount('');
            setCollateral('');
            setSelectedPool(null);
            setTimeout(() => setStep('input'), 4000);
        }
    }, [isApproveLoading, isApproveSuccess, isLoanLoading, isLoanSuccess, refetchAllowance]);

    // ==========================================
    // AÇÃO DO BOTÃO
    // ==========================================
    const handleBorrow = () => {
        if (!amount || !collateral || selectedPool === null) return;

        // Se o usuário clicou no Mock (Pool 0), nós simulamos!
        if (selectedPool === 0) {
            setStep('creating');
            setTimeout(() => {
                setStep('success');
                setAmount(''); setCollateral(''); setSelectedPool(null);
                setTimeout(() => setStep('input'), 3000);
            }, 1500);
            return;
        }

        // Se clicou no Pool 1 (O Pool Live real que conectamos)
        const collateralInWei = parseUnits(collateral, 18);
        const borrowInWei = parseUnits(amount, 18);

        if (needsApproval) {
            writeApprove({
                address: FBTC_ADDRESS,
                abi: erc20ABI,
                functionName: 'approve',
                args: [FINARA_P2P_ADDRESS, collateralInWei],
            });
        } else {
            writeCreateLoan({
                address: FINARA_P2P_ADDRESS,
                abi: finaraP2PABI,
                functionName: 'createLoanRequest',
                args: [borrowInWei, collateralInWei],
            });
        }
    };

    const isProcessing = step === 'approving' || step === 'creating';

    return (
        <div className="relative min-h-screen pt-28 bg-[#0a0705] text-white selection:bg-orange-600/30 overflow-x-hidden font-sans">
            {/* Background Omitido para brevidade... */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <FinaraWaves />
            </div>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                
                {/* Header e Stats Omitidos para brevidade (Mantenha os do seu código anterior) ... */}

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10 mt-10">

                    {/* LEFT: Available Pools (Híbrido) */}
                    <motion.div className="lg:col-span-3 p-6 rounded-[2rem] bg-[#120a07]/60 border border-white/5 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <CurrencyDollarIcon className="w-4 h-4 text-orange-400" />
                                <h2 className="text-xs font-bold text-white/60 uppercase tracking-widest">Pools Disponíveis</h2>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {AVAILABLE_POOLS.map((pool, i) => (
                                <motion.div
                                    key={pool.name}
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
                                                {/* TAG LIVE para o Pool Real */}
                                                {i === 1 && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-500 text-black animate-pulse">LIVE TESTNET</span>}
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${pool.risk === 'Baixo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>{pool.risk}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-5 text-[10px] text-white/30">
                                                <span>Disponível: <span className="text-white/50 font-bold">{pool.available}</span></span>
                                                <span>Colateral: <span className="text-white/50 font-bold">{pool.minCollateral}</span></span>
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

                    {/* RIGHT: Borrow Action (Com Fluxo Duplo) */}
                    <motion.div className="lg:col-span-2 p-6 rounded-[2rem] bg-[#120a07]/60 border border-white/5 backdrop-blur-xl h-fit lg:sticky lg:top-28">
                        <div className="flex items-center gap-2 mb-6">
                            <ArrowDownTrayIcon className="w-4 h-4 text-orange-400" />
                            <h2 className="text-xs font-bold text-white/60 uppercase tracking-widest">Solicitar Empréstimo</h2>
                        </div>

                        {/* Amount Input */}
                        <div className="mb-4">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Valor Empréstimo (USDC)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/30 transition-all"
                            />
                        </div>

                        {/* Collateral Info */}
                        <div className="mb-5 p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between text-xs">
                            <span className="text-white/40 flex items-center gap-1"><LockClosedIcon className="w-3 h-3" /> Colateral Necessário</span>
                            <span className="text-orange-400 font-bold">{collateral ? `$${collateral} FBTC` : '—'}</span>
                        </div>

                        {/* Botão Duplo Dinâmico */}
                        <motion.button
                            onClick={handleBorrow}
                            disabled={isProcessing || !amount || selectedPool === null}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                                selectedPool === 1 && needsApproval
                                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' // Estilo Approve
                                : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 text-white shadow-lg' // Estilo Create
                            } disabled:opacity-50`}
                        >
                            {isProcessing ? (
                                <>
                                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                    {step === 'approving' ? 'Aprovando FBTC...' : 'Criando Pedido...'}
                                </>
                            ) : selectedPool === 1 && needsApproval ? (
                                <>1. Aprovar Garantia (FBTC)</>
                            ) : (
                                <>2. Pedir Emprestado <ChevronRightIcon className="w-3 h-3" /></>
                            )}
                        </motion.button>

                        <AnimatePresence>
                            {step === 'success' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
                                    <div className="text-orange-400 text-lg mb-1">✓</div>
                                    <span className="text-xs text-orange-400 font-bold">Sucesso! Veja em "Meus Empréstimos".</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* My Loans (Híbrido - Exibe Real e Mock) */}
                <motion.div className="p-6 rounded-[2rem] bg-[#120a07]/60 border border-white/5 backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <DocumentCheckIcon className="w-4 h-4 text-white/40" />
                        <h2 className="text-xs font-bold text-white/60 uppercase tracking-widest">Meus Empréstimos</h2>
                    </div>

                    <div className="space-y-3">
                        {displayLoans.map((loan, i) => (
                            <motion.div key={loan.id} className="p-5 rounded-xl bg-black/20 border border-white/5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${loan.status === 'Ativo' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                                            {loan.status === 'Ativo' ? <ExclamationTriangleIcon className="w-5 h-5 text-orange-400" /> : <CheckCircleIcon className="w-5 h-5 text-emerald-400" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white flex items-center gap-2">
                                                ${loan.amount.toLocaleString()} FUSD
                                                {loan.isLive && <span className="text-[9px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">REAL</span>}
                                            </div>
                                            <div className="text-[9px] text-white/30">{loan.date} → {loan.dueDate} • De: {loan.lender}</div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold px-3 py-1.5 rounded-lg border bg-white/5">{loan.status}</span>
                                </div>
                                {loan.health > 0 && <HealthBar health={loan.health} />}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}