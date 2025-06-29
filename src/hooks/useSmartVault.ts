import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESSES } from '../constants/contracts';

// Smart Vault contract ABI (simplified)
const SMART_VAULT_ABI = [
  {
    "inputs": [],
    "name": "mint",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "hasMinted",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserTokenId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintPrice",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"internalType": "address", "name": "lpToken", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "addLPTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"internalType": "address", "name": "feeToken", "type": "address"}
    ],
    "name": "withdrawFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export function useSmartVault() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  // Check if contracts are deployed (not zero address)
  const isContractDeployed = CONTRACT_ADDRESSES.SMART_VAULT !== '0x0000000000000000000000000000000000000000';

  // Check if user has minted a Smart Vault
  const { data: hasMinted } = useReadContract({
    address: CONTRACT_ADDRESSES.SMART_VAULT,
    abi: SMART_VAULT_ABI,
    functionName: 'hasMinted',
    args: address ? [address] : undefined,
    query: {
      enabled: isContractDeployed && !!address,
    },
  });

  // Get user's token ID if they have minted
  const { data: tokenId } = useReadContract({
    address: CONTRACT_ADDRESSES.SMART_VAULT,
    abi: SMART_VAULT_ABI,
    functionName: 'getUserTokenId',
    args: address ? [address] : undefined,
    query: {
      enabled: isContractDeployed && !!hasMinted && !!address,
    },
  });

  // Get mint price
  const { data: mintPrice } = useReadContract({
    address: CONTRACT_ADDRESSES.SMART_VAULT,
    abi: SMART_VAULT_ABI,
    functionName: 'mintPrice',
    query: {
      enabled: isContractDeployed,
    },
  });

  const mintSmartVault = async () => {
    if (!address) throw new Error('Wallet not connected');
    if (!isContractDeployed) throw new Error('Contracts not deployed yet');
    if (!mintPrice) throw new Error('Mint price not loaded');
    
    return writeContract({
      address: CONTRACT_ADDRESSES.SMART_VAULT,
      abi: SMART_VAULT_ABI,
      functionName: 'mint',
      value: mintPrice,
    });
  };

  const addLPTokens = async (lpTokenAddress: string, amount: bigint) => {
    if (!address || !tokenId) throw new Error('Smart Vault not minted');
    if (!isContractDeployed) throw new Error('Contracts not deployed yet');
    
    return writeContract({
      address: CONTRACT_ADDRESSES.SMART_VAULT,
      abi: SMART_VAULT_ABI,
      functionName: 'addLPTokens',
      args: [tokenId, lpTokenAddress, amount],
    });
  };

  const withdrawFees = async (feeTokenAddress: string) => {
    if (!address || !tokenId) throw new Error('Smart Vault not minted');
    if (!isContractDeployed) throw new Error('Contracts not deployed yet');
    
    return writeContract({
      address: CONTRACT_ADDRESSES.SMART_VAULT,
      abi: SMART_VAULT_ABI,
      functionName: 'withdrawFees',
      args: [tokenId, feeTokenAddress],
    });
  };

  return {
    hasMinted: !!hasMinted,
    tokenId,
    mintPrice,
    mintSmartVault,
    addLPTokens,
    withdrawFees,
    isContractDeployed,
  };
}