import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Zap, Target, Clock, Activity, ArrowUpRight, ArrowDownRight, Eye, Flame } from 'lucide-react';
import { useAnalytics, formatCurrency, formatNumber } from '../hooks/useAnalytics';
import NetworkLogo from './NetworkLogo';

interface ChartData {
  date: string;
  value: number;
  volume?: number;
  tokens?: number;
}

interface TopToken {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  chainId: number;
  volume24h: number;
  change24h: number;
  marketCap: number;
  holders: number;
  rank: number;
}

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [selectedMetric, setSelectedMetric] = useState<'volume' | 'tokens' | 'users' | 'fees'>('volume');
  
  const analytics = useAnalytics();

  // Mock chart data
  const chartData: ChartData[] = [
    { date: '2025-01-01', value: 125000, volume: 125000, tokens: 12, users: 234 },
    { date: '2025-01-02', value: 189000, volume: 189000, tokens: 18, users: 345 },
    { date: '2025-01-03', value: 234000, volume: 234000, tokens: 25, users: 456 },
    { date: '2025-01-04', value: 345000, volume: 345000, tokens: 34, users: 567 },
    { date: '2025-01-05', value: 456000, volume: 456000, tokens: 42, users: 678 },
    { date: '2025-01-06', value: 567000, volume: 567000, tokens: 51, users: 789 },
    { date: '2025-01-07', value: 678000, volume: 678000, tokens: 63, users: 890 }
  ];

  // Mock top tokens data
  const topTokens: TopToken[] = [
    {
      id: '1',
      name: 'PepeKing',
      symbol: 'PEPEK',
      logo: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1',
      chainId: 2021,
      volume24h: 234000,
      change24h: 15.6,
      marketCap: 1200000,
      holders: 2847,
      rank: 1
    },
    {
      id: '2',
      name: 'DogeRonin',
      symbol: 'DOGER',
      logo: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1',
      chainId: 2021,
      volume24h: 189000,
      change24h: 8.3,
      marketCap: 890000,
      holders: 1923,
      rank: 2
    },
    {
      id: '3',
      name: 'ShibaWarrior',
      symbol: 'SHIBAW',
      logo: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1',
      chainId: 84532,
      volume24h: 156000,
      change24h: -2.1,
      marketCap: 567000,
      holders: 1456,
      rank: 3
    },
    {
      id: '4',
      name: 'CatCoin',
      symbol: 'MEOW',
      logo: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1',
      chainId: 2021,
      volume24h: 89000,
      change24h: 12.4,
      marketCap: 234000,
      holders: 987,
      rank: 4
    },
    {
      id: '5',
      name: 'MoonDoge',
      symbol: 'MDOGE',
      logo: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1',
      chainId: 84532,
      volume24h: 67000,
      change24h: -5.7,
      marketCap: 123000,
      holders: 654,
      rank: 5
    }
  ];

  const getMetricValue = (data: ChartData) => {
    switch (selectedMetric) {
      case 'volume': return data.volume || 0;
      case 'tokens': return data.tokens || 0;
      case 'users': return (data as any).users || 0;
      case 'fees': return (data.volume || 0) * 0.005; // 0.5% fee
      default: return data.value;
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'volume': return 'Trading Volume';
      case 'tokens': return 'New Tokens';
      case 'users': return 'Active Users';
      case 'fees': return 'Protocol Fees';
      default: return 'Volume';
    }
  };

  const getMetricIcon = () => {
    switch (selectedMetric) {
      case 'volume': return <BarChart3 className="w-5 h-5" />;
      case 'tokens': return <Zap className="w-5 h-5" />;
      case 'users': return <Users className="w-5 h-5" />;
      case 'fees': return <DollarSign className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const maxValue = Math.max(...chartData.map(getMetricValue));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Real-time insights into the VYTO Protocol ecosystem
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-green-400 text-sm">
                <ArrowUpRight className="w-3 h-3" />
                <span>+12.5%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatCurrency(2340000)}
            </div>
            <div className="text-gray-400 text-sm">Total Volume (24h)</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-green-400 text-sm">
                <ArrowUpRight className="w-3 h-3" />
                <span>+8.3%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatNumber(127)}
            </div>
            <div className="text-gray-400 text-sm">Total Tokens</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-green-400 text-sm">
                <ArrowUpRight className="w-3 h-3" />
                <span>+15.7%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatNumber(8934)}
            </div>
            <div className="text-gray-400 text-sm">Active Users</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-green-400 text-sm">
                <ArrowUpRight className="w-3 h-3" />
                <span>+23.1%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatNumber(23)}
            </div>
            <div className="text-gray-400 text-sm">Graduated Tokens</div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div className="flex items-center space-x-3 mb-4 lg:mb-0">
              {getMetricIcon()}
              <h2 className="text-xl font-bold text-white">{getMetricLabel()} Over Time</h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Metric Selector */}
              <div className="flex bg-gray-700 rounded-lg p-1">
                {[
                  { id: 'volume', label: 'Volume' },
                  { id: 'tokens', label: 'Tokens' },
                  { id: 'users', label: 'Users' },
                  { id: 'fees', label: 'Fees' }
                ].map((metric) => (
                  <button
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id as any)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      selectedMetric === metric.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>

              {/* Timeframe Selector */}
              <div className="flex bg-gray-700 rounded-lg p-1">
                {[
                  { id: '24h', label: '24H' },
                  { id: '7d', label: '7D' },
                  { id: '30d', label: '30D' },
                  { id: '90d', label: '90D' }
                ].map((period) => (
                  <button
                    key={period.id}
                    onClick={() => setTimeframe(period.id as any)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      timeframe === period.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="h-64 flex items-end justify-between space-x-2">
            {chartData.map((data, index) => {
              const value = getMetricValue(data);
              const height = (value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t transition-all hover:from-blue-500 hover:to-purple-500"
                    style={{ height: `${height}%` }}
                    title={`${data.date}: ${selectedMetric === 'volume' || selectedMetric === 'fees' ? formatCurrency(value) : formatNumber(value)}`}
                  ></div>
                  <div className="text-xs text-gray-400 mt-2 transform rotate-45 origin-left">
                    {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Top Tokens */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Top Performing Tokens</span>
              </h2>
              
              <div className="space-y-4">
                {topTokens.map((token) => (
                  <div key={token.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="text-gray-400 font-mono text-sm w-6">
                        #{token.rank}
                      </div>
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={token.logo} alt={token.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{token.name}</span>
                          <NetworkLogo chainId={token.chainId} size="sm" />
                        </div>
                        <div className="text-gray-400 text-sm">${token.symbol}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white font-medium">
                        {formatCurrency(token.volume24h)}
                      </div>
                      <div className={`text-sm flex items-center space-x-1 ${
                        token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {token.change24h >= 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        <span>{Math.abs(token.change24h).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Stats */}
          <div className="space-y-6">
            {/* Network Distribution */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Network Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <NetworkLogo chainId="2021" size="md" />
                    <span className="text-white">Ronin</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">78</div>
                    <div className="text-gray-400 text-sm">61.4%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '61.4%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <NetworkLogo chainId="84532" size="md" />
                    <span className="text-white">Base</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">49</div>
                    <div className="text-gray-400 text-sm">38.6%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '38.6%' }}></div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Recent Activity</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white text-sm">New token launched</div>
                    <div className="text-gray-400 text-xs">PepeKing on Ronin</div>
                  </div>
                  <div className="text-gray-400 text-xs">2m ago</div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white text-sm">Token graduated</div>
                    <div className="text-gray-400 text-xs">DogeRonin reached target</div>
                  </div>
                  <div className="text-gray-400 text-xs">5m ago</div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white text-sm">High volume trade</div>
                    <div className="text-gray-400 text-xs">$50K SHIBAW trade</div>
                  </div>
                  <div className="text-gray-400 text-xs">8m ago</div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white text-sm">LP vault created</div>
                    <div className="text-gray-400 text-xs">New renounced vault</div>
                  </div>
                  <div className="text-gray-400 text-xs">12m ago</div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white text-sm">Flamenize vote</div>
                    <div className="text-gray-400 text-xs">1000 tokens burned</div>
                  </div>
                  <div className="text-gray-400 text-xs">15m ago</div>
                </div>
              </div>
            </div>

            {/* Protocol Health */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Protocol Health</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">TVL</span>
                  <span className="text-white font-medium">{formatCurrency(12340000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">24h Fees</span>
                  <span className="text-green-400 font-medium">{formatCurrency(11700)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">LP Vaults</span>
                  <span className="text-white font-medium">234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Burned Tokens</span>
                  <span className="text-orange-400 font-medium">12.3M</span>
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