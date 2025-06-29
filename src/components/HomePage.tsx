import React, { useState } from 'react';
import { TrendingUp, Flame, Target, Search, Filter, ExternalLink, ArrowUpRight, ArrowDownRight, Clock, Users } from 'lucide-react';

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

  const tokens: Token[] = [
    {
      id: '1',
      name: 'MoonDoge',
      symbol: 'MDOGE',
      logo: '🚀',
      price: 0.00045,
      priceChange24h: 12.5,
      volume24h: 125000,
      marketCap: 450000,
      holders: 1247,
      bondingProgress: 85,
      launchDate: '2024-01-15',
      creator: '0x742d...4C4C',
      description: 'To the moon and beyond! 🚀',
      category: 'graduating'
    },
    {
      id: '2',
      name: 'SafeRocket',
      symbol: 'SRKT',
      logo: '🛡️',
      price: 0.0012,
      priceChange24h: -5.2,
      volume24h: 89000,
      marketCap: 1200000,
      holders: 892,
      bondingProgress: 67,
      launchDate: '2024-01-20',
      creator: '0x123d...4C4C',
      description: 'Safe journey to the stars ⭐',
      category: 'trending'
    },
    {
      id: '3',
      name: 'KatanaCoin',
      symbol: 'KATA',
      logo: '⚔️',
      price: 0.0008,
      priceChange24h: 8.7,
      volume24h: 67000,
      marketCap: 800000,
      holders: 634,
      bondingProgress: 45,
      launchDate: '2024-01-25',
      creator: '0x456d...4C4C',
      description: 'Sharp as a katana blade 🗡️',
      category: 'trending'
    },
    {
      id: '4',
      name: 'RoninPepe',
      symbol: 'RPEPE',
      logo: '🐸',
      price: 0.00023,
      priceChange24h: 45.8,
      volume24h: 234000,
      marketCap: 230000,
      holders: 1856,
      bondingProgress: 23,
      launchDate: '2024-01-28',
      creator: '0x789a...4C4C',
      description: 'Pepe on Ronin network 🐸',
      category: 'new'
    },
    {
      id: '5',
      name: 'AxieToken',
      symbol: 'AXIE',
      logo: '🎮',
      price: 0.0015,
      priceChange24h: -12.3,
      volume24h: 156000,
      marketCap: 1500000,
      holders: 2341,
      bondingProgress: 92,
      launchDate: '2024-01-10',
      creator: '0xabc1...4C4C',
      description: 'Gaming revolution starts here 🎮',
      category: 'graduating'
    },
    {
      id: '6',
      name: 'DiamondHands',
      symbol: 'DMNDS',
      logo: '💎',
      price: 0.00067,
      priceChange24h: 23.4,
      volume24h: 98000,
      marketCap: 670000,
      holders: 789,
      bondingProgress: 56,
      launchDate: '2024-01-26',
      creator: '0xdef2...4C4C',
      description: 'Diamond hands only 💎🙌',
      category: 'trending'
    }
  ];

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
            VYTO Dashboard
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover, trade, and track the hottest meme tokens on the Ronin Network
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white mb-1">{tokens.length}</div>
            <div className="text-gray-400 text-sm">Total Tokens</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              ${(tokens.reduce((sum, token) => sum + token.volume24h, 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-gray-400 text-sm">24h Volume</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {tokens.filter(t => t.category === 'graduating').length}
            </div>
            <div className="text-gray-400 text-sm">Graduating</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {tokens.filter(t => t.category === 'new').length}
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

        {/* Token List */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">
              {selectedCategory === 'all' ? 'All Tokens' : 
               selectedCategory === 'new' ? 'New Launches' :
               selectedCategory === 'trending' ? 'Trending Tokens' :
               'Graduating Soon'}
            </h2>
          </div>

          <div className="divide-y divide-gray-700">
            {filteredTokens.map((token) => (
              <div key={token.id} className="p-6 hover:bg-gray-700/30 transition-colors">
                <div className="grid lg:grid-cols-12 gap-4 items-center">
                  {/* Token Info */}
                  <div className="lg:col-span-3 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-xl">
                      {token.logo}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{token.name}</div>
                      <div className="text-gray-400 text-sm">${token.symbol}</div>
                      <div className="text-gray-500 text-xs">{token.description}</div>
                    </div>
                  </div>

                  {/* Price & Change */}
                  <div className="lg:col-span-2">
                    <div className="text-white font-semibold">${token.price.toFixed(6)}</div>
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

                  {/* Bonding Progress */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-400 text-xs">Bonding Progress</span>
                      <span className="text-white text-xs font-medium">{token.bondingProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor(token.bondingProgress)}`}
                        style={{ width: `${token.bondingProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{getProgressLabel(token.bondingProgress)}</div>
                  </div>

                  {/* Holders */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center space-x-1 text-gray-400 text-sm">
                      <Users className="w-3 h-3" />
                      <span>{token.holders}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-1 flex items-center space-x-2">
                    <a
                      href={`https://katana.roninchain.com/swap?outputCurrency=${token.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                    >
                      <span>Trade</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredTokens.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No tokens found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Launch Your Own Token?
          </h2>
          <p className="text-gray-300 mb-6">
            Join the VYTO ecosystem and create your own meme token in minutes.
          </p>
          <button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-all">
            Launch Your Token
          </button>
        </div>
      </div>
    </div>
  );
}