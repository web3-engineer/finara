'use client';

import { motion } from 'framer-motion';
import { 
  ArrowTrendingUpIcon, 
  ChartBarIcon, 
  GlobeAltIcon, 
  ArrowsRightLeftIcon 
} from '@heroicons/react/24/outline';
import FinaraWaves from '../../components/FinaraWaves';

// Dados simulados para garantir que a build passe sem precisar de fetch externo agora
const MARKET_ASSETS = [
  { pair: 'CTC / FUSD', price: '$0.42', change: '+5.2%', volume: '$1.2M', trend: 'up' },
  { pair: 'FBTC / FUSD', price: '$64,200', change: '-1.2%', volume: '$840K', trend: 'down' },
  { pair: 'FUSD / USDC', price: '$1.00', change: '0.0%', volume: '$3.5M', trend: 'stable' },
];

export default function MarketPage() {
  return (
    <div className="relative min-h-screen pt-28 bg-[#0a0705] text-white overflow-x-hidden font-sans">
      
      {/* Background padrão Finara */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FinaraWaves />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#2c1a12 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold text-emerald-500/80 tracking-[0.2em] uppercase">Creditcoin Global Market</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2">
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Market</span> — Visão Geral
          </h1>
          <p className="text-white/40 text-sm max-w-lg">Acompanhe os ativos RWA e sintéticos operando na rede em tempo real.</p>
        </motion.div>

        {/* Grid de Ativos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {MARKET_ASSETS.map((asset, i) => (
            <motion.div 
              key={asset.pair}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-[2rem] bg-[#120a07]/60 border border-white/5 backdrop-blur-xl hover:border-emerald-500/20 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <ChartBarIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <span className={`text-xs font-bold ${asset.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {asset.change}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white/60 mb-1">{asset.pair}</h3>
              <div className="text-2xl font-black text-white">{asset.price}</div>
              <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-white/30 uppercase tracking-widest flex justify-between">
                <span>Vol 24h</span>
                <span>{asset.volume}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action Simples */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-8 rounded-[2rem] border border-dashed border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <GlobeAltIcon className="w-10 h-10 text-white/20" />
            <div>
              <h4 className="text-sm font-bold">Liquidez Cross-Chain</h4>
              <p className="text-xs text-white/40">Conectando ativos da Creditcoin com o mercado global.</p>
            </div>
          </div>
          <button className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-emerald-400 transition-colors flex items-center gap-2">
            Ver Explorador <ArrowsRightLeftIcon className="w-3 h-3" />
          </button>
        </motion.div>
      </main>
    </div>
  );
}