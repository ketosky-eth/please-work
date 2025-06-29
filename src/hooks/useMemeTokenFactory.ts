import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESSES } from '../constants/contracts';

// Meme Token Factory contract ABI (simplified)
const MEME_TOKEN_FACTORY_ABI = [
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
    "outputs": [],
    "stateMutability": "payable",
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
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "canUseFreeDeployment",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "deploymentFee",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
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

export function useMemeTokenFactory() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  // Check if contracts are deployed (not zero address)
  const isContractDeployed = CONTRACT_ADDRESSES.MEME_TOKEN_FACTORY !== '0x0000000000000000000000000000000000000000';

  // Get deployment fee
  const { data: deploymentFee } = useReadContract({
    address: CONTRACT_ADDRESSES.MEME_TOKEN_FACTORY,
    abi: MEME_TOKEN_FACTORY_ABI,
    functionName: 'deploymentFee',
    query: {
      enabled: isContractDeployed,
    },
  });

  // Check if user can use free deployment
  const { data: canUseFreeDeployment } = useReadContract({
    address: CONTRACT_ADDRESSES.MEME_TOKEN_FACTORY,
    abi: MEME_TOKEN_FACTORY_ABI,
    functionName: 'canUseFreeDeployment',
    args: address ? [address] : undefined,
    query: {
      enabled: isContractDeployed && !!address,
    },
  });

  // Get user's created tokens
  const { data: creatorTokens } = useReadContract({
    address: CONTRACT_ADDRESSES.MEME_TOKEN_FACTORY,
    abi: MEME_TOKEN_FACTORY_ABI,
    functionName: 'getCreatorTokens',
    args: address ? [address] : undefined,
    query: {
      enabled: isContractDeployed && !!address,
    },
  });

  // Get all tokens
  const { data: allTokens } = useReadContract({
    address: CONTRACT_ADDRESSES.MEME_TOKEN_FACTORY,
    abi: MEME_TOKEN_FACTORY_ABI,
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
    if (!deploymentFee) throw new Error('Deployment fee not loaded');
    
    const fee = canUseFreeDeployment ? 0n : deploymentFee;

    return writeContract({
      address: CONTRACT_ADDRESSES.MEME_TOKEN_FACTORY,
      abi: MEME_TOKEN_FACTORY_ABI,
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
      value: fee,
    });
  };

  return {
    createMemeToken,
    deploymentFee,
    canUseFreeDeployment: !!canUseFreeDeployment,
    creatorTokens: creatorTokens || [],
    allTokens: allTokens || [],
    isContractDeployed,
  };
}