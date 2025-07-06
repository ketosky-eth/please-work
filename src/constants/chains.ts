import { Chain } from '../types';

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: '2021',
    name: 'Saigon Testnet',
    symbol: 'RON',
    rpcUrl: 'https://site1.moralis-nodes.com/ronin-testnet/22d6b97153ed4427b60914f349b2336c',
    blockExplorer: 'https://saigon-app.roninchain.com'
  },
  {
    id: '84532',
    name: 'Base Sepolia',
    symbol: 'ETH',
    rpcUrl: 'https://sepolia.base.org',
    blockExplorer: 'https://sepolia-explorer.base.org'
  }
];