// Contract addresses - Update these after deployment
export const CONTRACT_ADDRESSES = {
  // Saigon Testnet
  RONIN_TESTNET: {
    SMART_VAULT_CORE: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    DEX_ROUTER: '0x7D02c116b98d0965ba7B642ace0183ad8b8D2196', // Katana Router
    LP_VAULT_FACTORY: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    REWARD_ROUTER_BASIC: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  },
  // Base Sepolia
  BASE_SEPOLIA: {
    SMART_VAULT_CORE: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    DEX_ROUTER: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24', // Uniswap V2 Router
    LP_VAULT_FACTORY: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    REWARD_ROUTER_BASIC: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  }
} as const;

export const PROTOCOL_ADDRESS = '0x1A4edf1D0F2a2e7dbe86479A7a95f86b87205802';

export const NETWORK_CONFIG = {
  // Ronin Network
  2021: {
    graduationTarget: '69,420', // 69,420 RON
    startingPrice: '0.0001', // 0.0001 RON
    protocolReward: '250', // 250 RON
    launchCost: '0.5', // 0.5 RON
    symbol: 'RON',
    dexName: 'Katana'
  },
  // Base Sepolia
  84532: {
    graduationTarget: '24', // 24 ETH
    startingPrice: '0.00000001', // 0.00000001 ETH
    protocolReward: '0.05', // 0.05 ETH
    launchCost: '0.0002', // 0.0002 ETH
    symbol: 'ETH',
    dexName: 'Uniswap V2'
  }
} as const;

export const BONDING_CURVE_CONFIG = {
  TOKENS_FOR_SALE_PERCENTAGE: 80, // 80% for bonding curve
  TOKENS_FOR_LIQUIDITY_PERCENTAGE: 20, // 20% for liquidity
  PROTOCOL_FEE_BPS: 50, // 0.5%
  LP_FEE_THRESHOLD_USD: 200, // $200 threshold for auto-processing
} as const;

export const LP_VAULT_CONFIG = {
  PROTOCOL_FEE_BPS: 30, // 0.3%
  AUTO_CLAIM_THRESHOLD_USD: 250, // $250 threshold for auto-claim
} as const;