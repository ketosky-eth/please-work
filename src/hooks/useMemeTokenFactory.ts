import { useAccount, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';

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
      {"internalType": "string", "name": "discord", "type": "string"},
      {"internalType": "bool", "name": "initialBuy", "type": "bool"},
      {"internalType": "uint256", "name": "initialBuyAmount", "type": "uint256"}
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
  }
] as const;

const MEME_TOKEN_FACTORY_ADDRESS = '0x0000000000000000000000000000000000000000'; // Replace with deployed address

export function useMemeTokenFactory() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const createMemeToken = async (
    name: string,
    symbol: string,
    description: string,
    logoURI: string,
    website: string = '',
    twitter: string = '',
    telegram: string = '',
    discord: string = '',
    initialBuy: boolean = false,
    initialBuyAmount: string = '0'
  ) => {
    if (!address) throw new Error('Wallet not connected');
    
    const deploymentFee = parseEther('0.5'); // 0.5 RON
    const initialBuyValue = initialBuy ? parseEther(initialBuyAmount) : 0n;
    const totalValue = deploymentFee + initialBuyValue;

    return writeContract({
      address: MEME_TOKEN_FACTORY_ADDRESS,
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
        discord,
        initialBuy,
        parseEther(initialBuyAmount || '0')
      ],
      value: totalValue,
    });
  };

  return {
    createMemeToken,
  };
}