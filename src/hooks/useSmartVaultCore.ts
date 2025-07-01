import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESSES } from '../constants/contracts';

// SmartVaultCore contract ABI (simplified)
const SMART_VAULT_CORE_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "symbol", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "logoURI", "type": "string"},
      {"internalType": "string", "name": "website", "type": "string"},
      {"internalType": "string", "name": "twitter", "type": "string"},
      {"internalType": "string", "name": "telegram", "type": "string"},
      {"internalType": "string", "name": "discord", "type": "string"}
    ],
    "name": "createMemeToken",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenAddress", "type": "address"},
      {"internalType": "uint256", "name": "ronAmount", "type": "uint256"}
    ],
    "name": "buyTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenAddress", "type": "address"},
      {"internalType": "uint256", "name": "tokenAmount", "type": "uint256"}
    ],
    "name": "sellTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "tokenAddress", "type": "address"}],
    "name": "claimCreatorReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "lpToken", "type": "address"},
      {"internalType": "bool", "name": "isRenounced", "type": "bool"}
    ],
    "name": "addLPPair",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "lpToken", "type": "address"}],
    "name": "claimFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "tokenAddress", "type": "address"}],
    "name": "getTokenInfo",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "tokenAddress", "type": "address"},
          {"internalType": "address", "name": "creator", "type": "address"},
          {"internalType": "uint256", "name": "totalSupply", "type": "uint256"},
          {"internalType": "bool", "name": "creatorHasSmartVault", "type": "bool"},
          {"internalType": "bool", "name": "rewardClaimed", "type": "bool"}
        ],
        "internalType": "struct SmartVaultCore.TokenInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "tokenAddress", "type": "address"}],
    "name": "getBondingCurveProgress",
    "outputs": [
      {"internalType": "uint256", "name": "progress", "type": "uint256"},
      {"internalType": "uint256", "name": "target", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "tokenAddress", "type": "address"}],
    "name": "getCurrentPrice",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenAddress", "type": "address"},
      {"internalType": "address", "name": "creator", "type": "address"}
    ],
    "name": "canClaimReward",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "creator", "type": "address"}],
    "name": "getCreatorTokens",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllTokens",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export function useSmartVaultCore() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  // Check if contracts are deployed (not zero address)
  const isContractDeployed = CONTRACT_ADDRESSES.SMART_VAULT_CORE !== '0x0000000000000000000000000000000000000000';

  // Get user's created tokens
  const { data: creatorTokens } = useReadContract({
    address: CONTRACT_ADDRESSES.SMART_VAULT_CORE,
    abi: SMART_VAULT_CORE_ABI,
    functionName: 'getCreatorTokens',
    args: address ? [address] : undefined,
    query: {
      enabled: isContractDeployed && !!address,
    },
  });

  // Get all tokens
  const { data: allTokens } = useReadContract({
    address: CONTRACT_ADDRESSES.SMART_VAULT_CORE,
    abi: SMART_VAULT_CORE_ABI,
    functionName: 'getAllTokens',
    query: {
      enabled: isContractDeployed,
    },
  });

  const createMemeToken = async (
    name: string,
    symbol: string,
    description: string,
    logoURI: string,
    website: string = '',
    twitter: string = '',
    telegram: string = '',
    discord: string = ''
  ) => {
    if (!address) throw new Error('Wallet not connected');
    if (!isContractDeployed) throw new Error('Contracts not deployed yet');

    return writeContract({
      address: CONTRACT_ADDRESSES.SMART_VAULT_CORE,
      abi: SMART_VAULT_CORE_ABI,
      functionName: 'createMemeToken',
      args: [
        name,
        symbol,
        description,
        logoURI,
        website,
        twitter,
        telegram,
        discord
      ],
    });
  };

  const buyTokens = async (tokenAddress: string, ronAmount: string) => {
    if (!address) throw new Error('Wallet not connected');
    if (!isContractDeployed) throw new Error('Contracts not deployed yet');
    
    return writeContract({
      address: CONTRACT_ADDRESSES.SMART_VAULT_CORE,
      abi: SMART_VAULT_CORE_ABI,
      functionName: 'buyTokens',
      args: [tokenAddress, parseEther(ronAmount)],
    });
  };

  const sellTokens = async (tokenAddress: string, tokenAmount: bigint) => {
    if (!address) throw new Error('Wallet not connected');
    if (!isContractDeployed) throw new Error('Contracts not deployed yet');
    
    return writeContract({
      address: CONTRACT_ADDRESSES.SMART_VAULT_CORE,
      abi: SMART_VAULT_CORE_ABI,
      functionName: 'sellTokens',
      args: [tokenAddress, tokenAmount],
    });
  };

  const claimCreatorReward = async (tokenAddress: string) => {
    if (!address) throw new Error('Wallet not connected');
    if (!isContractDeployed) throw new Error('Contracts not deployed yet');
    
    return writeContract({
      address: CONTRACT_ADDRESSES.SMART_VAULT_CORE,
      abi: SMART_VAULT_CORE_ABI,
      functionName: 'claimCreatorReward',
      args: [tokenAddress],
    });
  };

  // Read functions
  const useTokenInfo = (tokenAddress: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.SMART_VAULT_CORE,
      abi: SMART_VAULT_CORE_ABI,
      functionName: 'getTokenInfo',
      args: [tokenAddress],
      query: {
        enabled: isContractDeployed && !!tokenAddress,
      },
    });
  };

  const useTokenProgress = (tokenAddress: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.SMART_VAULT_CORE,
      abi: SMART_VAULT_CORE_ABI,
      functionName: 'getBondingCurveProgress',
      args: [tokenAddress],
      query: {
        enabled: isContractDeployed && !!tokenAddress,
      },
    });
  };

  const useCurrentPrice = (tokenAddress: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.SMART_VAULT_CORE,
      abi: SMART_VAULT_CORE_ABI,
      functionName: 'getCurrentPrice',
      args: [tokenAddress],
      query: {
        enabled: isContractDeployed && !!tokenAddress,
      },
    });
  };

  const useCanClaimReward = (tokenAddress: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.SMART_VAULT_CORE,
      abi: SMART_VAULT_CORE_ABI,
      functionName: 'canClaimReward',
      args: [tokenAddress, address || '0x0'],
      query: {
        enabled: isContractDeployed && !!address && !!tokenAddress,
      },
    });
  };

  return {
    createMemeToken,
    buyTokens,
    sellTokens,
    claimCreatorReward,
    useTokenInfo,
    useTokenProgress,
    useCurrentPrice,
    useCanClaimReward,
    creatorTokens: creatorTokens || [],
    allTokens: allTokens || [],
    isContractDeployed,
  };
}