import React, { useState } from 'react';
import { TrendingUp, Flame, Target, Search, Filter, Clock, Users, Rocket, Zap, DollarSign, BarChart3, Lock, Shield } from 'lucide-react';
import { useAnalytics, formatCurrency, formatNumber } from '../hooks/useAnalytics';
import TokenCard from './TokenCard';
import NetworkLogo from './NetworkLogo';

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
  chainId: number;
  graduated: boolean;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'new' | 'trending' | 'graduating'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const analytics = useAnalytics();

  // Mock data for demonstration
  const tokens: Token[] = [
    {
      id: '1',
      name: 'PepeKing',
      symbol: 'PEPEK',
      logo: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      price: 0.000045,
      priceChange24h: 15.6,
      volume24h: 125000,
      marketCap: 450000,
      holders: 2847,
      bondingProgress: 67.3,
      launchDate: '2025-01-15T10:30:00Z',
      creator: '0xabcd...ef12',
      description: 'The ultimate Pepe token for the Ronin ecosystem. Community-driven and meme-powered! 🐸👑',
      category: 'trending',
      chainId: 2021,
      graduated: false,
      website: 'https://pepeking.com',
      twitter: 'https://twitter.com/pepeking',
      telegram: 'https://t.me/pepeking'
    },
    {
      id: '2',
      name: 'DogeRonin',
      symbol: 'DOGER',
      logo: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      price: 0.000123,
      priceChange24h: 8.3,
      volume24h: 89000,
      marketCap: 1230000,
      holders: 1923,
      bondingProgress: 89.2,
      launchDate: '2025-01-14T15:45:00Z',
      creator: '0x5678...9abc',
      description: 'Much wow, very Ronin! The goodest boy on the blockchain. To the moon! 🚀🐕',
      category: 'graduating',
      chainId: 2021,
      graduated: false,
      twitter: 'https://twitter.com/dogeronin',
      telegram: 'https://t.me/dogeronin'
    },
    {
      id: '3',
      name: 'ShibaWarrior',
      symbol: 'SHIBAW',
      logo: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      price: 0.000089,
      priceChange24h: -2.1,
      volume24h: 234000,
      marketCap: 890000,
      holders: 3421,
      bondingProgress: 45.8,
      launchDate: '2025-01-13T09:20:00Z',
      creator: '0x9abc...def3',
      description: 'Warrior spirit meets meme magic. Join the Shiba army on Base! ⚔️🐕',
      category: 'trending',
      chainId: 84532,
      graduated: false,
      website: 'https://shibawarrior.io'
    },
    {
      id: '4',
      name: 'CatCoin',
      symbol: 'MEOW',
      logo: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      price: 0.000034,
      priceChange24h: 12.4,
      volume24h: 45000,
      marketCap: 340000,
      holders: 1234,
      bondingProgress: 23.1,
      launchDate: '2025-01-15T14:10:00Z',
      creator: '0xdef3...4567',
      description: 'Purr-fect meme token for cat lovers. Meow to the moon! 🐱🌙',
      category: 'new',
      chainId: 2021,
      graduated: false
    },
    {
      id: '5',
      name: 'MoonDoge',
      symbol: 'MDOGE',
      logo: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      price: 0.000067,
      priceChange24h: -5.7,
      volume24h: 67000,
      marketCap: 123000,
      holders: 654,
      bondingProgress: 12.5,
      launchDate: '2025-01-15T16:30:00Z',
      creator: '0x4567...8901',
      description: 'To the moon and beyond! The next generation of Doge tokens on Base. 🌙🚀',
      category: 'new',
      chainId: 84532,
      graduated: false
    },
    {
      id: '6',
      name: 'RoninPepe',
      symbol: 'RPEPE',
      logo: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      price: 0.000156,
      priceChange24h: 34.2,
      volume24h: 345000,
      marketCap: 2100000,
      holders: 4567,
      bondingProgress: 95.8,
      launchDate: '2025-01-12T11:15:00Z',
      creator: '0x8901...2345',
      description: 'The legendary Pepe has arrived on Ronin! Join the revolution! 🐸⚔️',
      category: 'graduating',
      chainId: 2021,
      graduated: true
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
            VYTO Protocol
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Launch meme tokens with bonding curves and renounce LP tokens while keeping rewards. No limits, no gatekeeping! 🚀
          </p>
        </div>

        {/* Stats Overview - Live Analytics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {analytics.isLoading ? '...' : formatNumber(tokens.length)}
            </div>
            <div className="text-gray-400 text-sm">Total Tokens</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {analytics.isLoading ? '...' : formatCurrency(tokens.reduce((sum, token) => sum + token.volume24h, 0))}
            </div>
            <div className="text-gray-400 text-sm">24h Volume</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {analytics.isLoading ? '...' : formatNumber(tokens.filter(t => t.graduated).length)}
            </div>
            <div className="text-gray-400 text-sm">Graduated</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {analytics.isLoading ? '...' : formatNumber(tokens.filter(t => t.category === 'new').length)}
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

        {/* Token Marketplace */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">
              Token Marketplace
            </h2>
          </div>

          {filteredTokens.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Flame className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No tokens found</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Try adjusting your search or filter criteria to find tokens.
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTokens.map((token) => (
                  <TokenCard
                    key={token.id}
                    token={token}
                    onClick={() => {
                      // Navigate to token detail or trading page
                      console.log('Token clicked:', token.name);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Launch Your Token</h3>
            <p className="text-gray-400 mb-4">
              Create your own meme token with bonding curves and automatic liquidity provision.
            </p>
            <button 
              onClick={() => window.location.href = '/launch'}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Launch Token
            </button>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Explore Flamenize</h3>
            <p className="text-gray-400 mb-4">
              Vote on tokens, burn for reputation, and discover the hottest meme tokens.
            </p>
            <button 
              onClick={() => window.location.href = '/flamenize'}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Explore Flamenize
            </button>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Meme Token Factory */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Meme Token Factory</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Launch your own meme tokens with bonding curves. Fair launch mechanism with automatic price discovery and graduation to major DEXs.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Instant Launch</h3>
                <p className="text-gray-300 text-xs">
                  0.5 RON or 0.0002 ETH
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Bonding Curves</h3>
                <p className="text-gray-300 text-xs">
                  Fair price discovery
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Earn Fees</h3>
                <p className="text-gray-300 text-xs">
                  50% of LP trading fees
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '/launch'}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white py-3 rounded-lg font-semibold transition-all"
            >
              Launch Token
            </button>
          </div>

          {/* Renounced LP Vault */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Renounced LP Vault</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Permanently lock your LP tokens while continuing to earn trading fees and rewards. Trustless and secure.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Permanent Lock</h3>
                <p className="text-gray-300 text-xs">
                  LPs locked forever
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Keep Earning</h3>
                <p className="text-gray-300 text-xs">
                  Manual & Auto Claiming
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Auto-Claim</h3>
                <p className="text-gray-300 text-xs">
                  $250+ threshold
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '/renounce'}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all"
            >
              Renounce LPs
            </button>
          </div>
        </div>

        {/* Launch Costs */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Multi-Chain Support
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <NetworkLogo chainId="2021" size="xl" />
                <div>
                  <h3 className="text-lg font-bold text-white">Ronin Network</h3>
                  <p className="text-gray-400 text-sm">Gaming-focused blockchain</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Launch Cost:</span>
                  <span className="text-blue-400 font-semibold">0.5 RON</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Graduation Target:</span>
                  <span className="text-white font-semibold">69,420 RON</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">DEX:</span>
                  <span className="text-white font-semibold">Katana</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <NetworkLogo chainId="84532" size="xl" />
                <div>
                  <h3 className="text-lg font-bold text-white">Base Network</h3>
                  <p className="text-gray-400 text-sm">Coinbase's L2 solution</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Launch Cost:</span>
                  <span className="text-blue-400 font-semibold">0.0002 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Graduation Target:</span>
                  <span className="text-white font-semibold">24 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">DEX:</span>
                  <span className="text-white font-semibold">Uniswap V2</span>
                </div>
              </div>
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
                © VYTO Protocol 2025 - All Rights Reserved
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