'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    getDefaultConfig,
    darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { type Chain } from 'viem';

// 1. DEFINIÇÃO DA REDE (Mantemos como constante fora)
const creditcoinTestnet = {
    id: 595281,
    name: 'Creditcoin Testnet',
    nativeCurrency: { name: 'Creditcoin', symbol: 'CTC', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://rpc.cc3-testnet.creditcoin.network'] },
    },
    blockExplorers: {
        default: { name: 'Creditcoin Explorer', url: 'https://creditcoin.blockscout.com' },
    },
    testnet: true,
} as const satisfies Chain;

// 2. CONFIGURAÇÃO WAGMI
const config = getDefaultConfig({
    appName: 'Finara DeFi',
    projectId: '09c4593bff566de4ebaa6b3eba0f3d14', 
    chains: [creditcoinTestnet],
    ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
    // 3. ESTADO DO QUERY CLIENT
    // Criar dentro do componente evita conflitos de cache no Next.js
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#f97316',
                        accentColorForeground: 'white',
                        borderRadius: 'large',
                        overlayBlur: 'small',
                    })}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}