import { Chain } from '../types';

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: '1',
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorer: 'https://etherscan.io'
  },
  {
    id: '8453',
    name: 'Base',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org'
  },
  {
    id: '42161',
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io'
  },
  {
    id: '2020',
    name: 'Ronin',
    symbol: 'RON',
    rpcUrl: 'https://api.roninchain.com/rpc',
    blockExplorer: 'https://explorer.roninchain.com'
  },
  {
    id: '56',
    name: 'BNB Chain',
    symbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed1.binance.org',
    blockExplorer: 'https://bscscan.com'
  }
];