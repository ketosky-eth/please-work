import React from 'react';
import { Zap, Shield, Coins, Palette, ArrowRight, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Coins,
      title: 'Token Generation',
      description: 'Create your own meme tokens with ease using our advanced token generation tools.'
    },
    {
      icon: Palette,
      title: 'NFT Minting',
      description: 'Mint unique NFT collections with customizable metadata and rarity distributions.'
    },
    {
      icon: Shield,
      title: 'Multi-Chain Support',
      description: 'Deploy across multiple EVM-compatible chains including Ethereum, Base, and Arbitrum.'
    },
    {
      icon: TrendingUp,
      title: 'Trading Tools',
      description: 'Built-in trading and liquidity management tools for your newly created tokens.'
    }
  ];

  const stats = [
    { label: 'Tokens Created', value: '12,847' },
    { label: 'NFTs Minted', value: '89,234' },
    { label: 'Total Volume', value: '$45.2M' },
    { label: 'Active Users', value: '23,891' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Build the Future with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 block">
              VYTO
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Create, mint, and launch your tokens and NFTs across multiple blockchain networks. 
            Join thousands of creators building the next generation of digital assets.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Start Building</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-gray-600 text-white hover:bg-gray-800 px-8 py-4 rounded-xl font-semibold transition-all">
              View Documentation
            </button>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Build
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive tools and infrastructure for creating, managing, and scaling your digital assets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all hover:transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Launch Your Project?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators who have already launched their tokens and NFTs on VYTO.
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto">
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}