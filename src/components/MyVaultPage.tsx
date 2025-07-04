import React, { useState } from 'react';
import { Vault, TrendingUp, DollarSign, ExternalLink, Download, Eye, BarChart3, Coins, ArrowUpRight, ArrowDownRight, Gift, CheckCircle, Rocket } from 'lucide-react';
import { useAnalytics, useUserAnalytics, formatCurrency, formatNumber } from '../hooks/useAnalytics';
import { useWallet } from '../hooks/useWallet';

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

  const { address } = useWallet();
  const analytics = useAnalytics();
  const userAnalytics = useUserAnalytics(address || '');

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
      alert('Creator reward claimed successfully! 🎉\n250 RON has been sent to your wallet.');
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
            Track your launched meme tokens, monitor their performance, and claim LP fees
          </p>
        </div>

        {/* Live Stats Overview */}
        <div className="grid md:grid-cols-5 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Coins className="w-6 h-6 text-yellow-400" />
              <span className="text-gray-400 text-sm">Total Tokens</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {userAnalytics.isLoading ? '...' : formatNumber(userAnalytics.tokensCreated)}
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <DollarSign className="w-6 h-6 text-green-400" />
              <span className="text-gray-400 text-sm">Total Fees Earned</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {userAnalytics.isLoading ? '...' : formatCurrency(userAnalytics.totalFeesEarned, 'RON')}
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="w-6 h-6 text-orange-400" />
              <span className="text-gray-400 text-sm">Total Market Cap</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {analytics.isLoading ? '...' : formatCurrency(0)}
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              <span className="text-gray-400 text-sm">24h Volume</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {analytics.isLoading ? '...' : formatCurrency(analytics.totalVolume24h)}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-gray-400 text-sm">Graduated</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {analytics.isLoading ? '...' : formatNumber(0)}
            </div>
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
                onClick={() => window.location.href = '/tokens'}
                className="border border-gray-600 text-white hover:bg-gray-800 px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Explore Tokens
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
              <h3 className="text-lg font-semibold text-white mb-2">LP Trading Fees</h3>
              <p className="text-gray-300 text-sm">
                Earn 50% of LP trading fees automatically when your token graduates to DEX
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Automatic Liquidity</h3>
              <p className="text-gray-300 text-sm">
                Your token automatically gets liquidity on major DEXs when graduation target is reached
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Rug Pulls</h3>
              <p className="text-gray-300 text-sm">
                LP tokens are automatically burned, preventing rug pulls and ensuring fair trading
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex flex-col lg:flex-row justify-between items-center py-4">
            {/* Left: Logo & Copyright */}
            <div className="flex items-center space-x-3 mb-4 lg:mb-0">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="/Main Logo.jpg" 
                  alt="VYTO Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-gray-400 text-sm">
                © VYTO Protocol - Powered by the Ronin Network
              </span>
            </div>

            {/* Middle: Legal Links */}
            <div className="flex items-center space-x-6 mb-4 lg:mb-0">
              <button className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </button>
              <button className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </button>
              <button className="text-gray-400 hover:text-white text-sm transition-colors">
                Contact
              </button>
            </div>
            
            {/* Right: Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Follow us:</span>
              <a
                href="https://twitter.com/vyto_xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://discord.gg/AQdEfUaV8x"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400 hover:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}