import React from 'react';
import { Map, CheckCircle, Clock, Zap, Target, Rocket, Twitter, MessageCircle } from 'lucide-react';

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
      title: 'Liquifying Transparency',
      description: 'Casting strategic stepping stones',
      status: 'planned',
      quarter: 'Q4 2025',
      features: [
        'Official Token Generation Event',
        'Begin Project C Development', // Cupid Protocol = DEX, Bridges, & etc
        'Token Analytics Dashboard'
      ]
    },
    {
      id: '5',
      title: 'Batched Project Development',
      description: 'Validator Node Launch + Project Development',
      status: 'planned',
      quarter: 'Q1 2026',
      features: [
        'Validator Node',
        'Project S',
        'Bridge Node',
        'Project F'
      ]
    },
    {
      id: '6',
      title: 'Multi-Chain Expansion',
      description: 'Expand beyond Ronin to other EVM and non-EVM chains',
      status: 'planned',
      quarter: 'Q1 2026',
      features: [
        'Bridge Integrations',
        'Automatic Bridge Logic',
        'VYTO Bridge SDK',
        'Protocol Support & Compatibility'
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
              <span className="text-gray-400 text-sm hidden md:inline">
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

            {/* Mobile Copyright */}
            <div className="text-gray-400 text-sm text-center md:hidden mt-4">
              © VYTO Protocol - Powered by the Ronin Network
            </div>
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