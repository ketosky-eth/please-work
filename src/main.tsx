import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defineChain } from 'viem';
import App from './App.tsx';
import './index.css';
import '@rainbow-me/rainbowkit/styles.css';

// Define Saigon Testnet
const saigon = defineChain({
  id: 2021,
  name: 'Saigon Testnet',
  network: 'saigon-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'RON',
    symbol: 'RON',
  },
  rpcUrls: {
    default: {
      http: ['https://site1.moralis-nodes.com/ronin-testnet/22d6b97153ed4427b60914f349b2336c'],
    },
    public: {
      http: ['https://site1.moralis-nodes.com/ronin-testnet/22d6b97153ed4427b60914f349b2336c'],
    },
  },
  blockExplorers: {
    default: { name: 'Ronin Explorer', url: 'https://saigon-explorer.roninchain.com' },
  },
  testnet: true,
});

// Define Base Sepolia
const baseSepolia = defineChain({
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Base Sepolia Explorer', url: 'https://sepolia-explorer.base.org' },
  },
  testnet: true,
});

const config = getDefaultConfig({
  appName: 'VYTO Protocol - Meme Token Factory',
  projectId: 'zp1v56uxy8rdx5ypatb0ockcb9tr6a', // Your WalletConnect Cloud Project ID
  chains: [saigon, baseSepolia],
  ssr: false,
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);