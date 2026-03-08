'use client';

import * as React from 'react';

// 1. IMPORTAÇÃO OBRIGATÓRIA DO CSS DO RAINBOWKIT (Evita o botão bugado)
import '@rainbow-me/rainbowkit/styles.css';

import {
    RainbowKitProvider,
    getDefaultConfig,
    darkTheme,
    lightTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from 'next-themes';
import { type Chain } from 'viem';

// ==========================================
// CONFIGURAÇÃO OFICIAL DA CREDITCOIN TESTNET
// ==========================================
const creditcoinTestnet = {
    id: 102031, // <-- Chain ID oficial corrigido
    name: 'Creditcoin Testnet',
    nativeCurrency: { name: 'Creditcoin', symbol: 'CTC', decimals: 18 },
    rpcUrls: { 
        default: { http: ['https://rpc.cc3-testnet.creditcoin.network'] } 
    },
    blockExplorers: { 
        default: { name: 'Creditcoin Explorer', url: 'https://creditcoin-testnet.blockscout.com' } // <-- Explorer da Testnet corrigido
    },
    testnet: true,
} as const satisfies Chain;

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || '09c4593bff566de4ebaa6b3eba0f3d14';

const config = getDefaultConfig({
    appName: 'Finara DeFi',
    projectId: projectId,
    chains: [creditcoinTestnet],
    ssr: true,
});

// ==========================================
// INTEGRAÇÃO DE TEMA (DARK/LIGHT MODE)
// ==========================================
function RainbowKitWrapper({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);
    const { resolvedTheme } = useTheme();

    React.useEffect(() => setMounted(true), []);

    // Antes de montar no client, usa dark como default para evitar hydration mismatch
    const isDarkMode = mounted ? resolvedTheme === 'dark' : true;

    return (
        <RainbowKitProvider
            theme={isDarkMode ? darkTheme({
                accentColor: '#10b981', // Verde Esmeralda (combina melhor com sua UI da Finara)
                accentColorForeground: 'white',
                borderRadius: 'large',
                overlayBlur: 'small',
            }) : lightTheme({
                accentColor: '#10b981', // Verde Esmeralda para o modo claro também
                accentColorForeground: 'white',
                borderRadius: 'large',
                overlayBlur: 'small',
            })}
        >
            {children}
        </RainbowKitProvider>
    );
}

// ==========================================
// PROVIDER PRINCIPAL
// ==========================================
export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {/* O ThemeProvider injeta a classe "dark" no HTML */}
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    <RainbowKitWrapper>
                        {children}
                    </RainbowKitWrapper>
                </ThemeProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}