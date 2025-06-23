export interface Chain {
  id: string;
  name: string;
  symbol: string;
  rpcUrl: string;
  blockExplorer: string;
}

export interface TokenData {
  name: string;
  symbol: string;
  description: string;
  logo: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  initialBuy: boolean;
  initialBuyAmount?: string;
  selectedChain: string;
  selectedDEX: string;
}

export interface NFTCollection {
  name: string;
  symbol: string;
  description: string;
  image: string;
  totalSupply: number;
  mintPrice: string;
}