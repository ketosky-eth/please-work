// Contract addresses - Update these after deployment
export const CONTRACT_ADDRESSES = {
  SMART_VAULT_CORE: '0x0000000000000000000000000000000000000000' as `0x${string}`,
} as const;

export const PROTOCOL_ADDRESS = '0x1A4edf1D0F2a2e7dbe86479A7a95f86b87205802';

export const BONDING_CURVE_CONFIG = {
  GRADUATION_TARGET: '69420', // 69,420 RON
  CREATOR_REWARD: '250', // 250 RON (only for Smart Vault holders)
  PROTOCOL_REWARD: '100', // 100 RON (+ creator reward if no Smart Vault)
  TOKENS_FOR_SALE_PERCENTAGE: 80, // 80% for bonding curve
  TOKENS_FOR_LIQUIDITY_PERCENTAGE: 20, // 20% for liquidity
} as const;

// Katana Router on Ronin Testnet
export const KATANA_ROUTER_ADDRESS = '0x7D02c116b98d0965ba7B642ace0183ad8b8D2196';