import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from '../constants/contracts';

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
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenAddress", "type": "address"}
    ],
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
    "inputs": [
      {"internalType": "address", "name": "tokenAddress", "type": "address"}
    ],
    "name": "processLPFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenAddress", "type": "address"}
    ],
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
          {"internalType": "bool", "name": "graduated", "type": "bool"},
          {"internalType": "uint256", "name": "lpTokenBalance", "type": "uint256"},
          {"internalType": "uint256", "name": "accumulatedFees", "type": "uint256"}
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
  },
  {
    "inputs": [],
    "name": "getLaunchCost",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export function useSmartVaultCore() {
  const { address, chain } = useAccount();
  const { writeContract } = useWriteContract();

  // Get contract address based on current chain
  const getContractAddress = () => {
    if (!chain) return null;
    
    if (chain.id === 2021) {
      return CONTRACT_ADDRESSES.RONIN_TESTNET.SMART_VAULT_CORE;
    } else if (chain.id === 84532) {
      return CONTRACT_ADDRESSES.BASE_SEPOLIA.SMART_VAULT_CORE;
    }
    
    return null;
  };

  const contractAddress = getContractAddress();
  
  // Check if contracts are deployed (not zero address)
  const isContractDeployed = contractAddress !== '0x0000000000000000000000000000000000000000' && contractAddress !== null;

  // Get launch cost
  const { data: launchCost } = useReadContract({
    address: contractAddress,
    abi: SMART_VAULT_CORE_ABI,
    functionName: 'getLaunchCost',
    query: {
      enabled: isContractDeployed,
    },
  });

  // Get user's created tokens
  const { data: creatorTokens } = useReadContract({
    address: contractAddress,
    abi: SMART_VAULT_CORE_ABI,
    functionName: 'getCreatorTokens',
    args: address ? [address] : undefined,
    query: {
      enabled: isContractDeployed && !!address,
    },
  });

  // Get all tokens
  const { data: allTokens } = useReadContract({
    address: contractAddress,
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
    if (!isContractDeployed || !contractAddress) throw new Error('Contracts not deployed yet');
    if (!chain) throw new Error('Chain not detected');

    // Get launch cost from network config
    const networkConfig = NETWORK_CONFIG[chain.id as keyof typeof NETWORK_CONFIG];
    const cost = networkConfig?.launchCost || '0.5';

    return writeContract({
      address: contractAddress,
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
      value: parseEther(cost),
    });
  };

  const buyTokens = async (tokenAddress: string, nativeAmount: string) => {
    if (!address) throw new Error('Wallet not connected');
    if (!isContractDeployed || !contractAddress) throw new Error('Contracts not deployed yet');
    
    return writeContract({
      address: contractAddress,
      abi: SMART_VAULT_CORE_ABI,
      functionName: 'buyTokens',
      args: [tokenAddress],
      value: parseEther(nativeAmount),
    });
  };

  const sellTokens = async (tokenAddress: string, tokenAmount: bigint) => {
    if (!address) throw new Error('Wallet not connected');
    if (!isContractDeployed || !contractAddress) throw new Error('Contracts not deployed yet');
    
    return writeContract({
      address: contractAddress,
      abi: SMART_VAULT_CORE_ABI,
      functionName: 'sellTokens',
      args: [tokenAddress, tokenAmount],
    });
  };

  const processLPFees = async (tokenAddress: string) => {
    if (!address) throw new Error('Wallet not connected');
    if (!isContractDeployed || !contractAddress) throw new Error('Contracts not deployed yet');
    
    return writeContract({
      address: contractAddress,
      abi: SMART_VAULT_CORE_ABI,
      functionName: 'processLPFees',
      args: [tokenAddress],
    });
  };

  const claimFees = async (tokenAddress: string) => {
    if (!address) throw new Error('Wallet not connected');
    if (!isContractDeployed || !contractAddress) throw new Error('Contracts not deployed yet');
    
    return writeContract({
      address: contractAddress,
      abi: SMART_VAULT_CORE_ABI,
      functionName: 'claimFees',
      args: [tokenAddress],
    });
  };

  // Read functions
  const useTokenInfo = (tokenAddress: string) => {
    return useReadContract({
      address: contractAddress,
      abi: SMART_VAULT_CORE_ABI,
      functionName: 'getTokenInfo',
      args: [tokenAddress],
      query: {
        enabled: isContractDeployed && !!tokenAddress && !!contractAddress,
      },
    });
  };

  const useTokenProgress = (tokenAddress: string) => {
    return useReadContract({
      address: contractAddress,
      abi: SMART_VAULT_CORE_ABI,
      functionName: 'getBondingCurveProgress',
      args: [tokenAddress],
      query: {
        enabled: isContractDeployed && !!tokenAddress && !!contractAddress,
      },
    });
  };

  const useCurrentPrice = (tokenAddress: string) => {
    return useReadContract({
      address: contractAddress,
      abi: SMART_VAULT_CORE_ABI,
      functionName: 'getCurrentPrice',
      args: [tokenAddress],
      query: {
        enabled: isContractDeployed && !!tokenAddress && !!contractAddress,
      },
    });
  };

  const getLaunchCost = () => {
    if (!chain) return '0.5';
    const networkConfig = NETWORK_CONFIG[chain.id as keyof typeof NETWORK_CONFIG];
    return networkConfig?.launchCost || '0.5';
  };

  return {
    createMemeToken,
    buyTokens,
    sellTokens,
    processLPFees,
    claimFees,
    useTokenInfo,
    useTokenProgress,
    useCurrentPrice,
    creatorTokens: creatorTokens || [],
    allTokens: allTokens || [],
    isContractDeployed,
    launchCost: launchCost ? Number(launchCost) / 10**18 : null,
    getLaunchCost,
  };
}