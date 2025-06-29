import React, { useState } from 'react';
import { Vault, TrendingUp, DollarSign, ExternalLink, Download, Eye, BarChart3, Coins, ArrowUpRight, ArrowDownRight, Gift, CheckCircle, Rocket } from 'lucide-react';

interface LaunchedToken {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  chain: string;
  dex: string;
  contractAddress: string;
  launchDate: string;
  currentPrice: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  feesEarned: number;
  totalSupply: number;
  holders: number;
  bondingProgress: number;
  graduated: boolean;
  creatorReward: number;
  rewardClaimed: boolean;
  status: 'active' | 'graduated' | 'paused';
}

export default function MyVaultPage() {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState<string | null>(null);
  const [isClaimingReward, setIsClaimingReward] = useState<string | null>(null);

  // Fresh start - no tokens launched yet
  const launchedTokens: LaunchedToken[] = [];

  const handleWithdraw = async (tokenId: string) => {
    setIsWithdrawing(tokenId);
    // Simulate withdrawal process
    setTimeout(() => {
      setIsWithdrawing(null);
      alert('Fees withdrawn successfully! 💰');
    }, 2000);
  };

  const handleClaimReward = async (tokenId: string) => {
    setIsClaimingReward(tokenId);
    // Simulate reward claiming process
    setTimeout(() => {
      setIsClaimingReward(null);
      alert('Creator reward claimed successfully! 🎉\n500 RON has been sent to your wallet.');
    }, 2000);
  };

  const getDexUrl = (chain: string, dex: string, address: string) => {
    return `https://katana.roninchain.com/swap?outputCurrency=${address}`;
  };

  const getExplorerUrl = (chain: string, address: string) => {
    return `https://explorer.roninchain.com/token/${address}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900/10 to-gray-900 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <Vault className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My Vault
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Track your launched meme tokens, monitor their performance, and claim rewards
          </p>
        </div>

        {/* Fresh Stats Overview */}
        <div className="grid md:grid-cols-5 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Coins className="w-6 h-6 text-yellow-400" />
              <span className="text-gray-400 text-sm">Total Tokens</span>
            </div>
            <div className="text-2xl font-bold text-white">0</div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <DollarSign className="w-6 h-6 text-green-400" />
              <span className="text-gray-400 text-sm">Total Fees Earned</span>
            </div>
            <div className="text-2xl font-bold text-white">0 RON</div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="w-6 h-6 text-orange-400" />
              <span className="text-gray-400 text-sm">Total Market Cap</span>
            </div>
            <div className="text-2xl font-bold text-white">$0</div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              <span className="text-gray-400 text-sm">24h Volume</span>
            </div>
            <div className="text-2xl font-bold text-white">$0</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-gray-400 text-sm">Graduated</span>
            </div>
            <div className="text-2xl font-bold text-white">0</div>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Your Launched Tokens</h2>
          </div>
          
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Launch Your First Token?</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              You haven't launched any tokens yet. Start your journey by creating your first meme token on the VYTO Protocol.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/launch'}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                Launch Your First Token 🚀
              </button>
              <button 
                onClick={() => window.location.href = '/mint'}
                className="border border-gray-600 text-white hover:bg-gray-800 px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Mint Smart Vault NFT
              </button>
            </div>
          </div>
        </div>

        {/* Benefits Overview */}
        <div className="mt-12 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            What You'll Get When You Launch
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Creator Rewards</h3>
              <p className="text-gray-300 text-sm">
                Earn 500 RON when your token graduates to Katana DEX
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">LP Token Management</h3>
              <p className="text-gray-300 text-sm">
                Automatically receive and manage LP tokens in your Smart Vault
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Fee Harvesting</h3>
              <p className="text-gray-300 text-sm">
                Earn trading fees from your token pairs automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}