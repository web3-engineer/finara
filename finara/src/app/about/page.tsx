'use client';

import { motion } from 'framer-motion';
import {
    CubeIcon,
    CpuChipIcon,
    ShieldCheckIcon,
    CircleStackIcon,
    AcademicCapIcon,
    GlobeAltIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';
import FinaraWaves from '../../components/FinaraWaves';

const LAYERS = [
    {
        level: "Camada 1 (L1)",
        title: "Segurança e Liquidação",
        description: "A base de tudo. Utilizamos a rede Creditcoin para garantir que cada transação seja imutável, segura e transparente. A L1 é onde a confiança é forjada.",
        icon: ShieldCheckIcon,
        color: "from-emerald-500 to-emerald-700"
    },
    {
        level: "Camada 2 (L2)",
        title: "Escalabilidade e Velocidade",
        description: "Onde a performance acontece. Camadas de escalabilidade permitem que a Finara processe milhares de operações com taxas mínimas, mantendo a conexão com a segurança da L1.",
        icon: CpuChipIcon,
        color: "from-orange-500 to-orange-700"
    },
    {
        level: "Camada 3 (L3)",
        title: "Aplicação e DeFi Inteligente",
        description: "A camada de valor. É aqui que a Finara reside, criando estratégias complexas de yield, lending e RWA de forma intuitiva para o usuário final.",
        icon: CubeIcon,
        color: "from-amber-600 to-[#6b3e21]"
    }
];

export default function AboutPage() {
    return (
        <div className="relative min-h-screen pt-28 bg-[#0a0705] text-white selection:bg-emerald-600/30 overflow-x-hidden font-sans flex flex-col">

            {/* Background Section */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <FinaraWaves />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#2c1a12 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-800/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-700/5 rounded-full blur-[100px]" />
            </div>

            <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
                        <RocketLaunchIcon className="w-3 h-3" />
                        Nossa Missão
                    </div>
                    <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8">
                        REDEFININDO O <br />
                        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-orange-500 to-[#6b3e21] tracking-widest uppercase">
                            Futuro do DeFi
                        </span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                        A Finara nasceu para democratizar o acesso a produtos financeiros institucionais, unindo a segurança da blockchain com a agilidade do mercado moderno.
                    </p>
                </motion.div>

                {/* Blockchain Layers Section */}
                <div className="w-full mb-32">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-2xl font-light tracking-widest text-white/90 uppercase mb-4">Arquitetura de Camadas</h2>
                        <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {LAYERS.map((layer, index) => (
                            <motion.div
                                key={layer.level}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="group relative"
                            >
                                <div className="h-full p-8 rounded-[2.5rem] bg-[#120a07]/60 border border-white/5 backdrop-blur-xl hover:border-emerald-500/20 transition-all duration-500 shadow-2xl">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${layer.color} p-0.5 mb-8 transform group-hover:scale-110 transition-transform duration-500`}>
                                        <div className="w-full h-full bg-[#0a0705] rounded-[0.9rem] flex items-center justify-center">
                                            <layer.icon className="w-7 h-7 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-xs font-bold text-emerald-500 tracking-[0.2em] uppercase mb-2">{layer.level}</h3>
                                    <h4 className="text-xl font-bold text-white mb-4">{layer.title}</h4>
                                    <p className="text-white/50 text-sm font-light leading-relaxed">
                                        {layer.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Vision Section */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="w-full relative py-20 px-10 rounded-[3rem] bg-gradient-to-br from-[#111a15] to-[#0a0705] border border-white/5 overflow-hidden shadow-2xl mb-32"
                >
                    <div className="absolute top-0 right-0 w-[40%] h-full bg-emerald-600/5 blur-[80px] pointer-events-none"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-light text-white mb-6">Porque escolher a <span className="font-bold text-emerald-500 uppercase">Finara</span>?</h2>
                            <div className="space-y-6">
                                {[
                                    { title: "Transparência Total", desc: "Todas as operações são auditáveis on-chain em tempo real.", icon: CircleStackIcon },
                                    { title: "Inovação RWA", desc: "Integramos ativos do mundo real ao ecossistema DeFi com segurança.", icon: GlobeAltIcon },
                                    { title: "Educação em Primeiro Lugar", desc: "Simplificamos conceitos complexos para todo investidor.", icon: AcademicCapIcon },
                                ].map((item) => (
                                    <div key={item.title} className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                            <item.icon className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{item.title}</h4>
                                            <p className="text-xs text-white/40 font-light">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative aspect-square max-w-[400px] mx-auto">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse"></div>
                            <div className="relative w-full h-full rounded-[3rem] border border-white/10 bg-[#0a0705]/80 backdrop-blur-3xl flex items-center justify-center p-12">
                                <div className="text-center">
                                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-orange-500 mb-2 tracking-tighter">2026</div>
                                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Lançamento Global</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Expertise Section */}
                <div className="w-full">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-2xl font-light tracking-widest text-white/90 uppercase mb-4">Nossa Expertise</h2>
                        <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Security Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="group p-10 rounded-[2.5rem] bg-[#120a07]/40 border border-white/5 backdrop-blur-xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
                            <ShieldCheckIcon className="w-12 h-12 text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-500" />
                            <h3 className="text-xl font-bold text-white mb-4">Segurança Ofensiva & AppSec</h3>
                            <p className="text-white/50 text-sm font-light leading-relaxed">
                                Foco rigoroso em segurança de aplicações. Nossa experiência inclui análise de vulnerabilidades, implementação de boas práticas de desenvolvimento seguro e testes proativos para garantir que cada contrato e interface da Finara seja blindado contra ameaças web.
                            </p>
                            <div className="mt-8 flex gap-2">
                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Vulnerability Analysis</span>
                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Secure Dev</span>
                            </div>
                        </motion.div>

                        {/* Development Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="group p-10 rounded-[2.5rem] bg-[#120a07]/40 border border-white/5 backdrop-blur-xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl group-hover:bg-orange-500/10 transition-colors"></div>
                            <CpuChipIcon className="w-12 h-12 text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-500" />
                            <h3 className="text-xl font-bold text-white mb-4">Engenharia de Software Moderna</h3>
                            <p className="text-white/50 text-sm font-light leading-relaxed">
                                Desenvolvimento de aplicações escaláveis com foco em performance e entrega contínua. Atuamos de ponta a ponta no ciclo de software, da ideação à implementação de interfaces de alta fidelidade na Next Hub Academy, garantindo qualidade de código e robustez técnica.
                            </p>
                            <div className="mt-8 flex gap-2">
                                <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-400 font-bold uppercase tracking-wider">Continuous Delivery</span>
                                <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-400 font-bold uppercase tracking-wider">Next-Gen Stack</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

            </main>

            {/* Footer Polish */}
            <footer className="mt-auto py-12 border-t border-white/5 bg-black/20 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-white/30 text-[10px] gap-8 font-bold uppercase tracking-widest">
                    <div>
                        © 2026 <span className="text-emerald-500">Finara</span> Ecosystem. Powered by Creditcoin Network.
                    </div>
                    <div className="flex gap-10">
                        <a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Discord</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Github</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
