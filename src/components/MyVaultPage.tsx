import React, { useState } from 'react';
import { Vault, TrendingUp, DollarSign, ExternalLink, Download, Eye, BarChart3, Coins, ArrowUpRight, ArrowDownRight, Gift, CheckCircle } from 'lucide-react';

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

  const launchedTokens: LaunchedToken[] = [
    {
      id: '1',
      name: 'MoonDoge',
      symbol: 'MDOGE',
      logo: '🚀',
      chain: 'Ronin',
      dex: 'Katana',
      contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db4C4C4C4C4C',
      launchDate: '2024-01-15',
      currentPrice: 0.00045,
      priceChange24h: 12.5,
      volume24h: 125000,
      marketCap: 450000,
      feesEarned: 2.45,
      totalSupply: 1000000000,
      holders: 1247,
      bondingProgress: 100,
      graduated: true,
      creatorReward: 500,
      rewardClaimed: false,
      status: 'graduated'
    },
    {
      id: '2',
      name: 'SafeRocket',
      symbol: 'SRKT',
      logo: '🛡️',
      chain: 'Ronin',
      dex: 'Katana',
      contractAddress: '0x123d35Cc6634C0532925a3b8D4C9db4C4C4C4C4C',
      launchDate: '2024-01-20',
      currentPrice: 0.0012,
      priceChange24h: -5.2,
      volume24h: 89000,
      marketCap: 1200000,
      feesEarned: 1.87,
      totalSupply: 1000000000,
      holders: 892,
      bondingProgress: 67,
      graduated: false,
      creatorReward: 0,
      rewardClaimed: false,
      status: 'active'
    },
    {
      id: '3',
      name: 'KatanaCoin',
      symbol: 'KATA',
      logo: '⚔️',
      chain: 'Ronin',
      dex: 'Katana',
      contractAddress: '0x456d35Cc6634C0532925a3b8D4C9db4C4C4C4C4C',
      launchDate: '2024-01-25',
      currentPrice: 0.0008,
      priceChange24h: 8.7,
      volume24h: 67000,
      marketCap: 800000,
      feesEarned: 0.92,
      totalSupply: 1000000000,
      holders: 634,
      bondingProgress: 45,
      graduated: false,
      creatorReward: 0,
      rewardClaimed: false,
      status: 'active'
    },
    {
      id: '4',
      name: 'DiamondToken',
      symbol: 'DIAM',
      logo: '💎',
      chain: 'Ronin',
      dex: 'Katana',
      contractAddress: '0x789d35Cc6634C0532925a3b8D4C9db4C4C4C4C4C',
      launchDate: '2024-01-12',
      currentPrice: 0.0023,
      priceChange24h: 34.2,
      volume24h: 234000,
      marketCap: 2300000,
      feesEarned: 5.67,
      totalSupply: 1000000000,
      holders: 2156,
      bondingProgress: 100,
      graduated: true,
      creatorReward: 500,
      rewardClaimed: true,
      status: 'graduated'
    }
  ];

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
      // Update the token to mark reward as claimed
      const tokenIndex = launchedTokens.findIndex(t => t.id === tokenId);
      if (tokenIndex !== -1) {
        launchedTokens[tokenIndex].rewardClaimed = true;
      }
    }, 2000);
  };

  const getDexUrl = (chain: string, dex: string, address: string) => {
    return `https://katana.roninchain.com/swap?outputCurrency=${address}`;
  };

  const getExplorerUrl = (chain: string, address: string) => {
    return `https://explorer.roninchain.com/token/${address}`;
  };

  const totalFeesEarned = launchedTokens.reduce((sum, token) => sum + token.feesEarned, 0);
  const totalMarketCap = launchedTokens.reduce((sum, token) => sum + token.marketCap, 0);
  const totalVolume24h = launchedTokens.reduce((sum, token) => sum + token.volume24h, 0);
  const graduatedTokens = launchedTokens.filter(token => token.graduated);
  const unclaimedRewards = launchedTokens.filter(token => token.graduated && !token.rewardClaimed);
  const totalUnclaimedRewards = unclaimedRewards.reduce((sum, token) => sum + token.creatorReward, 0);

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

        {/* Unclaimed Rewards Banner */}
        {unclaimedRewards.length > 0 && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Gift className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-xl font-bold text-green-400">Creator Rewards Available!</h3>
                  <p className="text-green-300">
                    You have {unclaimedRewards.length} token{unclaimedRewards.length > 1 ? 's' : ''} with unclaimed rewards totaling {totalUnclaimedRewards} RON
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{totalUnclaimedRewards} RON</div>
                <div className="text-green-300 text-sm">Ready to claim</div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-5 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Coins className="w-6 h-6 text-yellow-400" />
              <span className="text-gray-400 text-sm">Total Tokens</span>
            </div>
            <div className="text-2xl font-bold text-white">{launchedTokens.length}</div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <DollarSign className="w-6 h-6 text-green-400" />
              <span className="text-gray-400 text-sm">Total Fees Earned</span>
            </div>
            <div className="text-2xl font-bold text-white">{totalFeesEarned.toFixed(3)} RON</div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="w-6 h-6 text-orange-400" />
              <span className="text-gray-400 text-sm">Total Market Cap</span>
            </div>
            <div className="text-2xl font-bold text-white">${(totalMarketCap / 1000000).toFixed(2)}M</div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              <span className="text-gray-400 text-sm">24h Volume</span>
            </div>
            <div className="text-2xl font-bold text-white">${(totalVolume24h / 1000).toFixed(0)}K</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-gray-400 text-sm">Graduated</span>
            </div>
            <div className="text-2xl font-bold text-white">{graduatedTokens.length}</div>
          </div>
        </div>

        {/* Tokens List */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Your Launched Tokens</h2>
          </div>
          
          <div className="divide-y divide-gray-700">
            {launchedTokens.map((token) => (
              <div key={token.id} className="p-6 hover:bg-gray-700/30 transition-colors">
                <div className="grid lg:grid-cols-12 gap-4 items-center">
                  {/* Token Info */}
                  <div className="lg:col-span-3 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-xl">
                      {token.logo}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-semibold">{token.name}</span>
                        {token.graduated && (
                          <CheckCircle className="w-4 h-4 text-green-400" title="Graduated" />
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">${token.symbol}</div>
                    </div>
                  </div>

                  {/* Price & Change */}
                  <div className="lg:col-span-2">
                    <div className="text-white font-semibold">${token.currentPrice.toFixed(6)}</div>
                    <div className={`text-sm flex items-center space-x-1 ${
                      token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {token.priceChange24h >= 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      <span>{Math.abs(token.priceChange24h).toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Volume & Market Cap */}
                  <div className="lg:col-span-2">
                    <div className="text-white text-sm">${(token.volume24h / 1000).toFixed(0)}K</div>
                    <div className="text-gray-400 text-xs">${(token.marketCap / 1000).toFixed(0)}K MC</div>
                  </div>

                  {/* Bonding Progress / Status */}
                  <div className="lg:col-span-2">
                    {token.graduated ? (
                      <div className="text-center">
                        <div className="text-green-400 font-semibold text-sm">Graduated</div>
                        <div className="text-gray-400 text-xs">Trading on Katana</div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-400 text-xs">Progress</span>
                          <span className="text-white text-xs font-medium">{token.bondingProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"
                            style={{ width: `${token.bondingProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fees Earned */}
                  <div className="lg:col-span-1">
                    <div className="text-green-400 font-semibold text-sm">{token.feesEarned.toFixed(3)} RON</div>
                    <div className="text-gray-400 text-xs">Fees</div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-2 flex items-center space-x-2">
                    {/* Withdraw Fees Button */}
                    <button
                      onClick={() => handleWithdraw(token.id)}
                      disabled={token.feesEarned <= 0 || isWithdrawing === token.id}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                    >
                      {isWithdrawing === token.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                      ) : (
                        <Download className="w-3 h-3" />
                      )}
                      <span className="hidden sm:inline">
                        {isWithdrawing === token.id ? 'Withdrawing...' : 'Withdraw'}
                      </span>
                    </button>

                    {/* Claim Reward Button */}
                    {token.graduated && !token.rewardClaimed && (
                      <button
                        onClick={() => handleClaimReward(token.id)}
                        disabled={isClaimingReward === token.id}
                        className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        {isClaimingReward === token.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                        ) : (
                          <Gift className="w-3 h-3" />
                        )}
                        <span className="hidden sm:inline">
                          {isClaimingReward === token.id ? 'Claiming...' : `Claim ${token.creatorReward} RON`}
                        </span>
                      </button>
                    )}

                    {/* Already Claimed Indicator */}
                    {token.graduated && token.rewardClaimed && (
                      <div className="bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span className="hidden sm:inline">Claimed</span>
                      </div>
                    )}
                    
                    <div className="flex space-x-1">
                      <a
                        href={getDexUrl(token.chain, token.dex, token.contractAddress)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-orange-600 hover:bg-orange-700 text-white p-1.5 rounded-lg transition-colors"
                        title="View on DEX"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      
                      <a
                        href={getExplorerUrl(token.chain, token.contractAddress)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg transition-colors"
                        title="View on Explorer"
                      >
                        <Eye className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedToken === token.id && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400 mb-1">Contract Address</div>
                        <div className="text-white font-mono text-xs">{token.contractAddress}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">Launch Date</div>
                        <div className="text-white">{new Date(token.launchDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">Holders</div>
                        <div className="text-white">{token.holders.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">Status</div>
                        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          token.status === 'graduated' ? 'bg-green-500/20 text-green-400' :
                          token.status === 'active' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
                        </div>
                      </div>
                    </div>

                    {/* Graduation Info */}
                    {token.graduated && (
                      <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <h4 className="text-green-400 font-semibold mb-2">🎉 Token Graduated!</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400">Graduation Target Reached</div>
                            <div className="text-white font-semibold">108,800 RON</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Creator Reward</div>
                            <div className={`font-semibold ${token.rewardClaimed ? 'text-green-400' : 'text-yellow-400'}`}>
                              {token.creatorReward} RON {token.rewardClaimed ? '(Claimed)' : '(Available)'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setSelectedToken(selectedToken === token.id ? null : token.id)}
                  className="mt-3 text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
                >
                  {selectedToken === token.id ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {launchedTokens.length === 0 && (
          <div className="text-center py-16">
            <Vault className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Tokens Launched Yet</h3>
            <p className="text-gray-400 mb-6">Launch your first meme token to start tracking it here.</p>
            <button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
              Launch Your First Token
            </button>
          </div>
        )}
      </div>
    </div>
  );
}