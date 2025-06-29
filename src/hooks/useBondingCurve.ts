import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESSES } from '../constants/contracts';

// Bonding Curve contract ABI (simplified)
const BONDING_CURVE_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "tokenAddress", "type": "address"}],
    "name": "buyTokens",
    "outputs": [],
    "stateMutability": "payable",
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
    "inputs": [{"internalType": "address", "name": "tokenAddress", "type": "address"}],
    "name": "getCurrentPrice",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenAddress", "type": "address"},
      {"internalType": "uint256", "name": "ethAmount", "type": "uint256"}
    ],
    "name": "calculateTokensForETH",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenAddress", "type": "address"},
      {"internalType": "uint256", "name": "tokenAmount", "type": "uint256"}
    ],
    "name": "calculateETHForTokens",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "tokenAddress", "type": "address"}],
    "name": "getTokenProgress",
    "outputs": [
      {"internalType": "uint256", "name": "progress", "type": "uint256"},
      {"internalType": "uint256", "name": "target", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "tokenAddress", "type": "address"}],
    "name": "isGraduated",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
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
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "tokenInfo",
    "outputs": [
      {"internalType": "address", "name": "tokenAddress", "type": "address"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "uint256", "name": "totalSupply", "type": "uint256"},
      {"internalType": "uint256", "name": "soldAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "collectedETH", "type": "uint256"},
      {"internalType": "bool", "name": "graduated", "type": "bool"},
      {"internalType": "bool", "name": "rewardClaimed", "type": "bool"},
      {"internalType": "uint256", "name": "createdAt", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export function useBondingCurve() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  // Check if contracts are deployed (not zero address)
  const isContractDeployed = CONTRACT_ADDRESSES.BONDING_CURVE !== '0x0000000000000000000000000000000000000000';

  const buyTokens = async (tokenAddress: string, ethAmount: string) => {
    if (!address) throw new Error('Wallet not connected');
    if (!isContractDeployed) throw new Error('Contracts not deployed yet');
    
    return writeContract({
      address: CONTRACT_ADDRESSES.BONDING_CURVE,
      abi: BONDING_CURVE_ABI,
      functionName: 'buyTokens',
      args: [tokenAddress],
      value: parseEther(ethAmount),
    });
  };

  const sellTokens = async (tokenAddress: string, tokenAmount: bigint) => {
    if (!address) throw new Error('Wallet not connected');
    if (!isContractDeployed) throw new Error('Contracts not deployed yet');
    
    return writeContract({
      address: CONTRACT_ADDRESSES.BONDING_CURVE,
      abi: BONDING_CURVE_ABI,
      functionName: 'sellTokens',
      args: [tokenAddress, tokenAmount],
    });
  };

  const claimCreatorReward = async (tokenAddress: string) => {
    if (!address) throw new Error('Wallet not connected');
    if (!isContractDeployed) throw new Error('Contracts not deployed yet');
    
    return writeContract({
      address: CONTRACT_ADDRESSES.BONDING_CURVE,
      abi: BONDING_CURVE_ABI,
      functionName: 'claimCreatorReward',
      args: [tokenAddress],
    });
  };

  // Read functions
  const useTokenProgress = (tokenAddress: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.BONDING_CURVE,
      abi: BONDING_CURVE_ABI,
      functionName: 'getTokenProgress',
      args: [tokenAddress],
      query: {
        enabled: isContractDeployed && !!tokenAddress,
      },
    });
  };

  const useIsGraduated = (tokenAddress: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.BONDING_CURVE,
      abi: BONDING_CURVE_ABI,
      functionName: 'isGraduated',
      args: [tokenAddress],
      query: {
        enabled: isContractDeployed && !!tokenAddress,
      },
    });
  };

  const useCanClaimReward = (tokenAddress: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.BONDING_CURVE,
      abi: BONDING_CURVE_ABI,
      functionName: 'canClaimReward',
      args: [tokenAddress, address || '0x0'],
      query: {
        enabled: isContractDeployed && !!address && !!tokenAddress,
      },
    });
  };

  const useCurrentPrice = (tokenAddress: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.BONDING_CURVE,
      abi: BONDING_CURVE_ABI,
      functionName: 'getCurrentPrice',
      args: [tokenAddress],
      query: {
        enabled: isContractDeployed && !!tokenAddress,
      },
    });
  };

  const useTokenInfo = (tokenAddress: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.BONDING_CURVE,
      abi: BONDING_CURVE_ABI,
      functionName: 'tokenInfo',
      args: [tokenAddress],
      query: {
        enabled: isContractDeployed && !!tokenAddress,
      },
    });
  };

  const useCalculateTokensForETH = (tokenAddress: string, ethAmount: bigint) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.BONDING_CURVE,
      abi: BONDING_CURVE_ABI,
      functionName: 'calculateTokensForETH',
      args: [tokenAddress, ethAmount],
      query: {
        enabled: isContractDeployed && ethAmount > 0n && !!tokenAddress,
      },
    });
  };

  const useCalculateETHForTokens = (tokenAddress: string, tokenAmount: bigint) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.BONDING_CURVE,
      abi: BONDING_CURVE_ABI,
      functionName: 'calculateETHForTokens',
      args: [tokenAddress, tokenAmount],
      query: {
        enabled: isContractDeployed && tokenAmount > 0n && !!tokenAddress,
      },
    });
  };

  return {
    buyTokens,
    sellTokens,
    claimCreatorReward,
    useTokenProgress,
    useIsGraduated,
    useCanClaimReward,
    useCurrentPrice,
    useTokenInfo,
    useCalculateTokensForETH,
    useCalculateETHForTokens,
    isContractDeployed,
  };
}