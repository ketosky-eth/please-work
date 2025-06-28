import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';

// Smart Vault contract ABI (simplified)
const SMART_VAULT_ABI = [
  {
    "inputs": [],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
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

const SMART_VAULT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Replace with deployed address

export function useSmartVault() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  // Check if user has minted a Smart Vault
  const { data: hasMinted } = useReadContract({
    address: SMART_VAULT_ADDRESS,
    abi: SMART_VAULT_ABI,
    functionName: 'hasMinted',
    args: address ? [address] : undefined,
  });

  // Get user's token ID if they have minted
  const { data: tokenId } = useReadContract({
    address: SMART_VAULT_ADDRESS,
    abi: SMART_VAULT_ABI,
    functionName: 'getUserTokenId',
    args: address ? [address] : undefined,
    query: {
      enabled: !!hasMinted,
    },
  });

  const mintSmartVault = async () => {
    if (!address) throw new Error('Wallet not connected');
    
    return writeContract({
      address: SMART_VAULT_ADDRESS,
      abi: SMART_VAULT_ABI,
      functionName: 'mint',
      value: parseEther('5'), // 5 RON mint price
    });
  };

  const addLPTokens = async (lpTokenAddress: string, amount: bigint) => {
    if (!address || !tokenId) throw new Error('Smart Vault not minted');
    
    return writeContract({
      address: SMART_VAULT_ADDRESS,
      abi: SMART_VAULT_ABI,
      functionName: 'addLPTokens',
      args: [tokenId, lpTokenAddress, amount],
    });
  };

  const withdrawFees = async (feeTokenAddress: string) => {
    if (!address || !tokenId) throw new Error('Smart Vault not minted');
    
    return writeContract({
      address: SMART_VAULT_ADDRESS,
      abi: SMART_VAULT_ABI,
      functionName: 'withdrawFees',
      args: [tokenId, feeTokenAddress],
    });
  };

  return {
    hasMinted: !!hasMinted,
    tokenId,
    mintSmartVault,
    addLPTokens,
    withdrawFees,
  };
}