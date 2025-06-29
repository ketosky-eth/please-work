import React from 'react';
import { BookOpen, Code, Shield, Zap, ExternalLink, ArrowRight } from 'lucide-react';

export default function DocsPage() {
  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      items: [
        'What is VYTO?',
        'Setting up your wallet',
        'Connecting to Ronin Network',
        'Your first token launch'
      ]
    },
    {
      id: 'smart-vault',
      title: 'Smart Vault System',
      icon: Shield,
      items: [
        'Understanding Smart Vaults',
        'Minting your Smart Vault NFT',
        'LP token management',
        'Fee harvesting mechanics'
      ]
    },
    {
      id: 'token-creation',
      title: 'Token Creation',
      icon: Code,
      items: [
        'Token deployment process',
        'Setting up metadata',
        'IPFS integration',
        'Liquidity management'
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Features',
      icon: BookOpen,
      items: [
        'Contract interactions',
        'API reference',
        'Troubleshooting',
        'Best practices'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900/10 to-gray-900 pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about building with VYTO Protocol
          </p>
        </div>

        {/* Quick Start Banner */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6 mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Quick Start Guide</h2>
              <p className="text-gray-300">Get up and running with VYTO in under 5 minutes</p>
            </div>
            <button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2">
              <span>Start Building</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {sections.map((section) => (
            <div key={section.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-yellow-500/50 transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{section.title}</h3>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, index) => (
                  <li key={index}>
                    <button className="text-gray-300 hover:text-yellow-400 transition-colors text-left w-full">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Content Area - Ready for your content */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-6">Welcome to VYTO Documentation</h2>
            
            <div className="text-gray-300 space-y-4">
              <p>
                This documentation section is ready for your content. You can edit this file to add:
              </p>
              
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Detailed guides and tutorials</li>
                <li>API documentation</li>
                <li>Code examples and snippets</li>
                <li>Smart contract references</li>
                <li>Troubleshooting guides</li>
                <li>Best practices and tips</li>
              </ul>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-6">
                <p className="text-yellow-300 text-sm">
                  <strong>Note:</strong> This is a placeholder content area. Replace this section with your actual documentation content.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* External Links */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <a
            href="https://explorer.roninchain.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-yellow-500/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Ronin Explorer</h3>
              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
            </div>
            <p className="text-gray-300 text-sm">
              Explore transactions and contracts on the Ronin network
            </p>
          </a>

          <a
            href="https://katana.roninchain.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-yellow-500/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Katana DEX</h3>
              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
            </div>
            <p className="text-gray-300 text-sm">
              Trade your tokens on Ronin's premier decentralized exchange
            </p>
          </a>

          <a
            href="https://sourcify.roninchain.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-yellow-500/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Contract Verification</h3>
              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
            </div>
            <p className="text-gray-300 text-sm">
              Verify your smart contracts on the Ronin network
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}