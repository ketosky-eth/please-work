import React from 'react';
import { Map, CheckCircle, Clock, Zap, Target, Rocket } from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  quarter: string;
  features: string[];
}

export default function RoadmapPage() {
  const roadmapItems: RoadmapItem[] = [
    {
      id: '1',
      title: 'Platform Foundation',
      description: 'Core infrastructure',
      status: 'in-progress',
      quarter: 'Q3 2025',
      features: [
        'Smart Contract Engineering',
        'Social Exposure',
        'Architecture & Design',
        'Website Release'
      ]
    },
    {
      id: '2',
      title: 'NFT Introduction',
      description: 'The upcoming VYTO NFT Collections',
      status: 'in-progress',
      quarter: 'Q3 2025',
      features: [
        'Smart Vault - Soulbound NFT',
        'Genesis Vault Shard - Premium NFT',
        'Backend Logic Engineering',
        'Whitepaper Release'
      ]
    },
    {
      id: '3',
      title: 'Collection Release',
      description: 'Onboarding & distribution of early(OG) supporter NFT',
      status: 'planned',
      quarter: 'Q3 2025',
      features: [
        'Limited Edition NFT Collection',
        'Founder Exclusive Benefits',
        'Official Platform Launch',
        'Protocol Exclusive Access'
      ]
    },
    {
      id: '4',
      title: 'First Protocol Expansion',
      description: 'VYTO starts exploring the neighboring chains',
      status: 'planned',
      quarter: 'Q4 2025',
      features: [
        'Base Mainnet Launch',
        'Arbitrum Mainnet Launch',
        'Begin Project C Development', // Cupid Protocol = DEX, Bridges, & etc
        'Token Analytics Dashboard'
      ]
    },
    {
      id: '5',
      title: 'Batched Project Development',
      description: 'Validator Node Launch + Project Development',
      status: 'planned',
      quarter: 'Q1 2025',
      features: [
        'Ronin Validator Node',
        'Project S',
        'Project F',
        'Risk management features'
      ]
    },
    {
      id: '6',
      title: 'Multi-Chain Expansion',
      description: 'Expand beyond Ronin to other EVM and non-EVM chains',
      status: 'planned',
      quarter: 'Q3 2024',
      features: [
        'Bridge Integrations',
        'Automatic Bridge Logic'
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'planned':
        return <Target className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'planned':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900/10 to-gray-900 pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <Map className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Roadmap
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our journey to revolutionize DeFi, token creations, and token liquidity management on the Ronin Network starts here
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Development Progress</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">1</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">2</div>
              <div className="text-sm text-gray-400">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400 mb-1">3</div>
              <div className="text-sm text-gray-400">Planned</div>
            </div>
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="space-y-8">
          {roadmapItems.map((item, index) => (
            <div key={item.id} className="relative">
              {/* Timeline Line */}
              {index < roadmapItems.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-24 bg-gray-700"></div>
              )}
              
              <div className="flex items-start space-x-6">
                {/* Timeline Dot */}
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                </div>
                
                {/* Content */}
                <div className="flex-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' ')}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">{item.quarter}</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    {item.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <Rocket className="w-12 h-12 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to build your DeFi Footprint?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join us on this exciting journey as we revolutionize token creation and management. 
            Your feedback and participation help shape our roadmap.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
            <a href="https://www.x.com/vyto_xyz" target="_blank">
              Follow Us on X
            </a>
            </button>
            <button className="border border-gray-600 text-white hover:bg-gray-800 px-6 py-3 rounded-lg font-semibold transition-all">
              <a href="https://discord.gg/AQdEfUaV8x" target="_blank">
              Join Community
              </a>
            </button>
          </div>
        </div>

        {/* Note for Manual Editing */}
        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-yellow-300 text-sm text-center">
            <strong>Note:</strong> This roadmap is ready is a work in progress. Stay tuned for more updates!
          </p>
        </div>
      </div>
    </div>
  );
}