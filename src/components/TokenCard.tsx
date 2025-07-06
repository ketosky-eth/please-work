import React from 'react';
import { TrendingUp, Users, Clock, ExternalLink, ArrowUpRight, ArrowDownRight, Target, CheckCircle } from 'lucide-react';
import NetworkLogo from './NetworkLogo';

interface TokenCardProps {
  token: {
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
    chainId: number;
    graduated: boolean;
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
  onClick?: () => void;
}

export default function TokenCard({ token, onClick }: TokenCardProps) {
  const getChainName = (chainId: number) => {
    switch (chainId) {
      case 2021: return 'Ronin';
      case 84532: return 'Base';
      default: return 'Unknown';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-red-500';
    if (progress >= 60) return 'bg-orange-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number): string => {
    return `$${formatNumber(amount)}`;
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <div 
      onClick={onClick}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600">
            {token.logo ? (
              <img 
                src={token.logo} 
                alt={token.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {token.symbol.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
              {token.name}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">${token.symbol}</span>
              <div className="flex items-center space-x-1 bg-gray-700/50 px-2 py-1 rounded text-xs font-medium">
                <NetworkLogo chainId={token.chainId} size="sm" />
                <span className="text-gray-300">{getChainName(token.chainId)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {token.graduated && (
          <div className="flex items-center space-x-1 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Graduated</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {token.description || 'No description available'}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-lg font-bold text-white">
            ${token.price.toFixed(6)}
          </div>
          <div className="flex items-center space-x-1">
            {token.priceChange24h >= 0 ? (
              <ArrowUpRight className="w-3 h-3 text-green-400" />
            ) : (
              <ArrowDownRight className="w-3 h-3 text-red-400" />
            )}
            <span className={`text-xs font-medium ${
              token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div>
          <div className="text-lg font-bold text-white">
            {formatCurrency(token.volume24h)}
          </div>
          <div className="text-xs text-gray-400">24h Volume</div>
        </div>
        
        <div>
          <div className="text-sm font-semibold text-white">
            {formatCurrency(token.marketCap)}
          </div>
          <div className="text-xs text-gray-400">Market Cap</div>
        </div>
        
        <div>
          <div className="text-sm font-semibold text-white flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{formatNumber(token.holders)}</span>
          </div>
          <div className="text-xs text-gray-400">Holders</div>
        </div>
      </div>

      {/* Bonding Progress */}
      {!token.graduated && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>Bonding Progress</span>
            </span>
            <span className="text-xs font-medium text-white">
              {token.bondingProgress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${getProgressColor(token.bondingProgress)}`}
              style={{ width: `${Math.min(token.bondingProgress, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{formatTime(token.launchDate)}</span>
        </div>
        
        {/* Social Links */}
        <div className="flex items-center space-x-2">
          {token.website && (
            <a
              href={token.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              <ExternalLink className="w-3 h-3 text-gray-400 hover:text-white" />
            </a>
          )}
          {token.twitter && (
            <a
              href={token.twitter}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              <svg className="w-3 h-3 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          )}
          {token.telegram && (
            <a
              href={token.telegram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              <svg className="w-3 h-3 text-gray-400 hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
          )}
          {token.discord && (
            <a
              href={token.discord}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              <svg className="w-3 h-3 text-gray-400 hover:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}