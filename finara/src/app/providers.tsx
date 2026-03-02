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

// 1. DEFINING THE CREDITCOIN NETWORK (TESTNET)
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

// 2. WAGMI + RAINBOWKIT CONFIGURATION
const config = getDefaultConfig({
    appName: 'Finara DeFi',
    projectId: 'SEU_PROJECT_ID_AQUI', // Replace with your WalletConnect project ID
    chains: [creditcoinTestnet],
    ssr: true,
});

// 3. QUERY CLIENT
const queryClient = new QueryClient();

// 4. PROVIDERS COMPONENT
export function Providers({ children }: { children: React.ReactNode }) {
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