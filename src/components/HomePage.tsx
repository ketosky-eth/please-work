import React, { useState } from 'react';
import { TrendingUp, Flame, Target, Search, Filter, ExternalLink, ArrowUpRight, ArrowDownRight, Clock, Users } from 'lucide-react';
import { useAnalytics, formatCurrency, formatNumber } from '../hooks/useAnalytics';

interface Token {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  holders: number;
  bondingProgress: number; // 0-100
  launchDate: string;
  creator: string;
  description: string;
  category: 'new' | 'trending' | 'graduating';
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'new' | 'trending' | 'graduating'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const analytics = useAnalytics();

  // Fresh empty state - no tokens launched yet
  const tokens: Token[] = [];

  const categories = [
    { id: 'all', label: 'All Tokens', icon: Filter },
    { id: 'new', label: 'New Launches', icon: Clock },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'graduating', label: 'Graduating Soon', icon: Target }
  ];

  const filteredTokens = tokens.filter(token => {
    const matchesCategory = selectedCategory === 'all' || token.category === selectedCategory;
    const matchesSearch = token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-red-500';
    if (progress >= 60) return 'bg-orange-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressLabel = (progress: number) => {
    if (progress >= 90) return 'Graduating Soon!';
    if (progress >= 80) return 'Almost There';
    if (progress >= 60) return 'Halfway';
    return 'Early Stage';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900/10 to-gray-900 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden">
              <img 
                src="/Main Logo.jpg" 
                alt="VYTO Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Browse Tokens
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover, trade, and track the hottest meme tokens on the Ronin Network
          </p>
        </div>

        {/* Stats Overview - Live Analytics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {analytics.isLoading ? '...' : formatNumber(analytics.totalTokens)}
            </div>
            <div className="text-gray-400 text-sm">Total Tokens</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {analytics.isLoading ? '...' : formatCurrency(analytics.totalVolume24h)}
            </div>
            <div className="text-gray-400 text-sm">24h Volume</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {analytics.isLoading ? '...' : formatNumber(analytics.graduatedTokens)}
            </div>
            <div className="text-gray-400 text-sm">Graduating</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {analytics.isLoading ? '...' : formatNumber(analytics.newTokensToday)}
            </div>
            <div className="text-gray-400 text-sm">New Today</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Category Filters */}
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State - Fresh Platform */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">
              Token Marketplace
            </h2>
          </div>

          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Flame className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Launch!</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              The VYTO Protocol is live and ready for action. Be the first to launch a meme token on our revolutionary bonding curve system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/launch'}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                Launch First Token 🚀
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

        {/* Getting Started Guide */}
        <div className="mt-12 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            How to Get Started
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Mint Smart Vault</h3>
              <p className="text-gray-300 text-sm">
                Get your Smart Vault NFT for free token launches and LP management
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Launch Token</h3>
              <p className="text-gray-300 text-sm">
                Create your meme token with bonding curve mechanics
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Earn Rewards</h3>
              <p className="text-gray-300 text-sm">
                Get 500 RON when your token graduates to Katana DEX
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}