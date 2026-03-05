'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    getDefaultConfig,
    darkTheme,
    lightTheme, // Adicionado para o tema claro
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from 'next-themes'; // O motor do nosso tema
import { type Chain } from 'viem';

const creditcoinTestnet = {
    id: 595281,
    name: 'Creditcoin Testnet',
    nativeCurrency: { name: 'Creditcoin', symbol: 'CTC', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.cc3-testnet.creditcoin.network'] } },
    blockExplorers: { default: { name: 'Creditcoin Explorer', url: 'https://creditcoin.blockscout.com' } },
    testnet: true,
} as const satisfies Chain;

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || '09c4593bff566de4ebaa6b3eba0f3d14';

const config = getDefaultConfig({
    appName: 'Finara DeFi',
    projectId: projectId,
    chains: [creditcoinTestnet],
    ssr: true,
});

// Componente interno para ler o tema atual e passar pro RainbowKit
function RainbowKitWrapper({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    return (
        <RainbowKitProvider
            theme={isDarkMode ? darkTheme({
                accentColor: '#f97316',
                accentColorForeground: 'white',
                borderRadius: 'large',
                overlayBlur: 'small',
            }) : lightTheme({
                accentColor: '#f97316',
                accentColorForeground: 'white',
                borderRadius: 'large',
                overlayBlur: 'small',
            })}
        >
            {children}
        </RainbowKitProvider>
    );
}

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