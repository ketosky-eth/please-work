import React, { useState } from 'react';
import { Flame, TrendingUp, TrendingDown, MessageCircle, Share2, ArrowUp, ArrowDown, AlertTriangle, Shield, Users, Eye, Filter, Search, Clock, Star, ExternalLink } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import NetworkLogo from './NetworkLogo';

interface FlamenizeToken {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  contractAddress: string;
  chainId: number;
  price: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  positiveVotes: number;
  negativeVotes: number;
  totalBurned: number;
  reputationScore: number; // 0-100
  heatIndex: 'safe' | 'caution' | 'warning' | 'danger';
  comments: number;
  shares: number;
  lastActivity: string;
  creator: string;
  description: string;
  tags: string[];
  isVerified: boolean;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
}

interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
}

export default function FlamenizePage() {
  const { isConnected, address, connect } = useWallet();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'trending' | 'safe' | 'warning' | 'danger'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'reputation' | 'volume' | 'recent'>('reputation');

  // Mock data for Flamenize tokens
  const flamenizeTokens: FlamenizeToken[] = [
    {
      id: '1',
      name: 'PepeKing',
      symbol: 'PEPEK',
      logo: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      contractAddress: '0x1234567890123456789012345678901234567890',
      chainId: 2021,
      price: 0.000045,
      marketCap: 450000,
      volume24h: 125000,
      holders: 2847,
      positiveVotes: 1250,
      negativeVotes: 180,
      totalBurned: 2145000,
      reputationScore: 87,
      heatIndex: 'safe',
      comments: 342,
      shares: 89,
      lastActivity: '2 minutes ago',
      creator: '0xabcd...ef12',
      description: 'The ultimate Pepe token for the Ronin ecosystem. Community-driven and meme-powered! 🐸👑',
      tags: ['Pepe', 'Community', 'Meme'],
      isVerified: true,
      website: 'https://pepeking.com',
      twitter: 'https://twitter.com/pepeking',
      telegram: 'https://t.me/pepeking'
    },
    {
      id: '2',
      name: 'DogeRonin',
      symbol: 'DOGER',
      logo: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      contractAddress: '0x2345678901234567890123456789012345678901',
      chainId: 2021,
      price: 0.000123,
      marketCap: 1230000,
      volume24h: 89000,
      holders: 1923,
      positiveVotes: 890,
      negativeVotes: 45,
      totalBurned: 1402500,
      reputationScore: 95,
      heatIndex: 'safe',
      comments: 156,
      shares: 67,
      lastActivity: '5 minutes ago',
      creator: '0x5678...9abc',
      description: 'Much wow, very Ronin! The goodest boy on the blockchain. To the moon! 🚀🐕',
      tags: ['Doge', 'Moon', 'Community'],
      isVerified: true,
      twitter: 'https://twitter.com/dogeronin',
      telegram: 'https://t.me/dogeronin'
    },
    {
      id: '3',
      name: 'ShibaWarrior',
      symbol: 'SHIBAW',
      logo: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      contractAddress: '0x3456789012345678901234567890123456789012',
      chainId: 84532,
      price: 0.000089,
      marketCap: 890000,
      volume24h: 234000,
      holders: 3421,
      positiveVotes: 567,
      negativeVotes: 234,
      totalBurned: 1201500,
      reputationScore: 71,
      heatIndex: 'caution',
      comments: 89,
      shares: 23,
      lastActivity: '12 minutes ago',
      creator: '0x9abc...def3',
      description: 'Warrior spirit meets meme magic. Join the Shiba army on Base! ⚔️🐕',
      tags: ['Shiba', 'Warrior', 'Base'],
      isVerified: false,
      website: 'https://shibawarrior.io'
    },
    {
      id: '4',
      name: 'CatCoin',
      symbol: 'MEOW',
      logo: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      contractAddress: '0x4567890123456789012345678901234567890123',
      chainId: 2021,
      price: 0.000034,
      marketCap: 340000,
      volume24h: 45000,
      holders: 1234,
      positiveVotes: 234,
      negativeVotes: 456,
      totalBurned: 1035000,
      reputationScore: 34,
      heatIndex: 'warning',
      comments: 67,
      shares: 12,
      lastActivity: '1 hour ago',
      creator: '0xdef3...4567',
      description: 'Purr-fect meme token for cat lovers. Meow to the moon! 🐱🌙',
      tags: ['Cat', 'Cute', 'Meme'],
      isVerified: false
    },
    {
      id: '5',
      name: 'RugPull',
      symbol: 'RUG',
      logo: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      contractAddress: '0x5678901234567890123456789012345678901234',
      chainId: 84532,
      price: 0.000001,
      marketCap: 10000,
      volume24h: 500,
      holders: 89,
      positiveVotes: 12,
      negativeVotes: 890,
      totalBurned: 1353000,
      reputationScore: 5,
      heatIndex: 'danger',
      comments: 234,
      shares: 3,
      lastActivity: '3 hours ago',
      creator: '0x0000...0000',
      description: 'Suspicious token with questionable tokenomics. Proceed with extreme caution! ⚠️',
      tags: ['Suspicious', 'High Risk'],
      isVerified: false
    }
  ];

  // Mock comments for selected token
  const mockComments: Comment[] = [
    {
      id: '1',
      user: '0xCrypto...Degen',
      avatar: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1',
      content: 'This token is absolutely fire! 🔥 The community is amazing and the devs are constantly delivering. HODL strong! 💎🙌',
      timestamp: '5 minutes ago',
      likes: 23,
      replies: 4
    },
    {
      id: '2',
      user: '0xMeme...Lord',
      avatar: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1',
      content: 'Just bought more! This is going to 100x easy. The memes are top tier and the utility is real. LFG! 🚀🚀🚀',
      timestamp: '12 minutes ago',
      likes: 18,
      replies: 2
    },
    {
      id: '3',
      user: '0xPepe...Fan',
      avatar: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1',
      content: 'Love the voting mechanism! Finally a way to separate the gems from the rugs. This is the future of meme tokens! 💯',
      timestamp: '25 minutes ago',
      likes: 31,
      replies: 7
    }
  ];

  const getHeatIndexColor = (heatIndex: string) => {
    switch (heatIndex) {
      case 'safe': return 'text-green-400 bg-green-500/20';
      case 'caution': return 'text-yellow-400 bg-yellow-500/20';
      case 'warning': return 'text-orange-400 bg-orange-500/20';
      case 'danger': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getHeatIndexIcon = (heatIndex: string) => {
    switch (heatIndex) {
      case 'safe': return <Shield className="w-4 h-4" />;
      case 'caution': return <Eye className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'danger': return <AlertTriangle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const handleVote = (tokenId: string, voteType: 'up' | 'down') => {
    if (!isConnected) {
      connect?.();
      return;
    }
    
    // Simulate voting with token burn
    alert(`${voteType === 'up' ? 'Upvoted' : 'Downvoted'} token! 1 ${voteType === 'up' ? 'PEPEK' : 'PEPEK'} token burned for this vote.`);
  };

  const handleShare = (token: FlamenizeToken) => {
    navigator.clipboard.writeText(`Check out ${token.name} (${token.symbol}) on Flamenize! Reputation Score: ${token.reputationScore}%`);
    alert('Token link copied to clipboard!');
  };

  const filteredTokens = flamenizeTokens.filter(token => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'trending' && token.volume24h > 100000) ||
      (selectedFilter === 'safe' && token.heatIndex === 'safe') ||
      (selectedFilter === 'warning' && (token.heatIndex === 'warning' || token.heatIndex === 'caution')) ||
      (selectedFilter === 'danger' && token.heatIndex === 'danger');
    
    const matchesSearch = token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const sortedTokens = [...filteredTokens].sort((a, b) => {
    switch (sortBy) {
      case 'reputation':
        return b.reputationScore - a.reputationScore;
      case 'volume':
        return b.volume24h - a.volume24h;
      case 'recent':
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      default:
        return 0;
    }
  });

  const selectedTokenData = selectedToken ? flamenizeTokens.find(t => t.id === selectedToken) : null;

  if (selectedTokenData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900/10 to-gray-900 pt-8 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => setSelectedToken(null)}
            className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowUp className="w-4 h-4 rotate-[-90deg]" />
            <span>Back to Flamenize</span>
          </button>

          {/* Token Detail View */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Token Header */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img src={selectedTokenData.logo} alt={selectedTokenData.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-bold text-white">{selectedTokenData.name}</h1>
                        {selectedTokenData.isVerified && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Star className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-400">${selectedTokenData.symbol}</span>
                        <div className="flex items-center space-x-1">
                          <NetworkLogo chainId={selectedTokenData.chainId} size="sm" />
                          <span className="text-gray-400 text-sm">
                            {selectedTokenData.chainId === 2021 ? 'Ronin' : 'Base'}
                          </span>
                        </div>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getHeatIndexColor(selectedTokenData.heatIndex)}`}>
                          {getHeatIndexIcon(selectedTokenData.heatIndex)}
                          <span className="capitalize">{selectedTokenData.heatIndex}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleShare(selectedTokenData)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <Share2 className="w-4 h-4 text-gray-300" />
                    </button>
                    <a
                      href={`https://katana.roninchain.com/swap?outputCurrency=${selectedTokenData.contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Trade
                    </a>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{selectedTokenData.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedTokenData.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex items-center space-x-3">
                  {selectedTokenData.website && (
                    <a href={selectedTokenData.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4 text-gray-300" />
                    </a>
                  )}
                  {selectedTokenData.twitter && (
                    <a href={selectedTokenData.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                      <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                  {selectedTokenData.telegram && (
                    <a href={selectedTokenData.telegram} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                      <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Community Discussion ({selectedTokenData.comments})</span>
                </h2>

                {/* Comment Input */}
                {isConnected ? (
                  <div className="mb-6">
                    <textarea
                      placeholder="Share your thoughts about this token..."
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-400 text-sm">Comments require 1 {selectedTokenData.symbol} token burn</span>
                      <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors">
                        Post Comment
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-300 mb-2">Connect your wallet to join the discussion</p>
                    <button
                      onClick={connect}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Connect Wallet
                    </button>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {mockComments.map((comment) => (
                    <div key={comment.id} className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img src={comment.avatar} alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-white font-medium">{comment.user}</span>
                            <span className="text-gray-400 text-sm">{comment.timestamp}</span>
                          </div>
                          <p className="text-gray-300 mb-2">{comment.content}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <button className="flex items-center space-x-1 hover:text-white transition-colors">
                              <ArrowUp className="w-3 h-3" />
                              <span>{comment.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-white transition-colors">
                              <MessageCircle className="w-3 h-3" />
                              <span>{comment.replies}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Voting Section */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Community Voting</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={() => handleVote(selectedTokenData.id, 'up')}
                    className="flex flex-col items-center space-y-2 p-4 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 rounded-lg transition-colors"
                  >
                    <ArrowUp className="w-6 h-6 text-green-400" />
                    <span className="text-green-400 font-bold">{selectedTokenData.positiveVotes}</span>
                    <span className="text-green-300 text-sm">Upvotes</span>
                  </button>
                  
                  <button
                    onClick={() => handleVote(selectedTokenData.id, 'down')}
                    className="flex flex-col items-center space-y-2 p-4 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 rounded-lg transition-colors"
                  >
                    <ArrowDown className="w-6 h-6 text-red-400" />
                    <span className="text-red-400 font-bold">{selectedTokenData.negativeVotes}</span>
                    <span className="text-red-300 text-sm">Downvotes</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reputation Score</span>
                    <span className="text-white font-bold">{selectedTokenData.reputationScore}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${selectedTokenData.reputationScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Burned: {(selectedTokenData.totalBurned / 1000000).toFixed(1)}M</span>
                    <span className="text-gray-400">Votes: {selectedTokenData.positiveVotes + selectedTokenData.negativeVotes}</span>
                  </div>
                </div>
              </div>

              {/* Token Stats */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Token Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price</span>
                    <span className="text-white">${selectedTokenData.price.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Cap</span>
                    <span className="text-white">${(selectedTokenData.marketCap / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Volume</span>
                    <span className="text-white">${(selectedTokenData.volume24h / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Holders</span>
                    <span className="text-white">{selectedTokenData.holders.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Creator</span>
                    <span className="text-white font-mono text-sm">{selectedTokenData.creator}</span>
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Comments</span>
                    <span className="text-white">{selectedTokenData.comments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shares</span>
                    <span className="text-white">{selectedTokenData.shares}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Activity</span>
                    <span className="text-white">{selectedTokenData.lastActivity}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900/10 to-gray-900 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <Flame className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Flamenize
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Community-driven meme token reputation platform. Vote, burn, and discover the hottest tokens! 🔥
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {flamenizeTokens.length}
            </div>
            <div className="text-gray-400 text-sm">Listed Tokens</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {(flamenizeTokens.reduce((sum, token) => sum + token.totalBurned, 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-gray-400 text-sm">Tokens Burned</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {flamenizeTokens.reduce((sum, token) => sum + token.positiveVotes + token.negativeVotes, 0).toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Total Votes</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {flamenizeTokens.filter(t => t.heatIndex === 'safe').length}
            </div>
            <div className="text-gray-400 text-sm">Safe Tokens</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All', icon: Filter },
                { id: 'trending', label: 'Trending', icon: TrendingUp },
                { id: 'safe', label: 'Safe', icon: Shield },
                { id: 'warning', label: 'Warning', icon: AlertTriangle },
                { id: 'danger', label: 'Danger', icon: AlertTriangle }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedFilter === filter.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <filter.icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="reputation">Sort by Reputation</option>
              <option value="volume">Sort by Volume</option>
              <option value="recent">Sort by Recent</option>
            </select>
          </div>
        </div>

        {/* Token Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTokens.map((token) => (
            <div
              key={token.id}
              onClick={() => setSelectedToken(token.id)}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all cursor-pointer group"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={token.logo} alt={token.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                        {token.name}
                      </h3>
                      {token.isVerified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <Star className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm">${token.symbol}</span>
                      <NetworkLogo chainId={token.chainId} size="sm" />
                    </div>
                  </div>
                </div>
                
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getHeatIndexColor(token.heatIndex)}`}>
                  {getHeatIndexIcon(token.heatIndex)}
                  <span className="capitalize">{token.heatIndex}</span>
                </div>
              </div>

              {/* Reputation Score */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Reputation Score</span>
                  <span className="text-white font-bold">{token.reputationScore}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${token.reputationScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-semibold text-white">${token.price.toFixed(6)}</div>
                  <div className="text-xs text-gray-400">Price</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">${(token.volume24h / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-gray-400">24h Volume</div>
                </div>
              </div>

              {/* Voting Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-green-400">
                    <ArrowUp className="w-3 h-3" />
                    <span className="text-sm font-medium">{token.positiveVotes}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-red-400">
                    <ArrowDown className="w-3 h-3" />
                    <span className="text-sm font-medium">{token.negativeVotes}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {(token.totalBurned / 1000000).toFixed(1)}M burned
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{token.lastActivity}</span>
                </div>
                
                <div className="flex items-center space-x-3 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{token.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{(token.holders / 1000).toFixed(1)}K</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-16 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            How Flamenize Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Vote & Burn</h3>
              <p className="text-gray-300 text-sm">
                Each vote burns tokens: 1 token for regular votes, 1.5 tokens for reversing votes
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Reputation Score</h3>
              <p className="text-gray-300 text-sm">
                Positive/negative ratio creates reputation score. Higher scores rank better
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
              <p className="text-gray-300 text-sm">
                Comment, share, and build cult-like communities around your favorite tokens
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
                © VYTO Protocol 2025 - All Rights Reserved.
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