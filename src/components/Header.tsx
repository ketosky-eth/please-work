import React, { useState } from 'react';
import { ChevronDown, Wallet, Zap } from 'lucide-react';
import { SUPPORTED_CHAINS } from '../constants/chains';
import { Chain } from '../types';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Header({ currentPage, onPageChange }: HeaderProps) {
  const [selectedChain, setSelectedChain] = useState<Chain>(SUPPORTED_CHAINS[0]);
  const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleConnectWallet = () => {
    setIsWalletConnected(!isWalletConnected);
  };

  const handleChainSelect = (chain: Chain) => {
    setSelectedChain(chain);
    setIsChainDropdownOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'landing', label: 'Landing' },
    { id: 'mint', label: 'NFT Mint' },
    { id: 'launch', label: 'Launch Meme' },
    { id: 'vault', label: 'My Vault' }
  ];

  return (
    <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">VYTO</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-purple-400 bg-purple-400/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Chain Selector & Wallet */}
          <div className="flex items-center space-x-4">
            {/* Chain Selector */}
            <div className="relative">
              <button
                onClick={() => setIsChainDropdownOpen(!isChainDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                <span className="text-sm text-white hidden sm:block">{selectedChain.name}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {isChainDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                  {SUPPORTED_CHAINS.map((chain) => (
                    <button
                      key={chain.id}
                      onClick={() => handleChainSelect(chain)}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                      <div className="text-left">
                        <div className="text-white text-sm font-medium">{chain.name}</div>
                        <div className="text-gray-400 text-xs">{chain.symbol}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Connect Wallet Button */}
            <button
              onClick={handleConnectWallet}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isWalletConnected
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:block">
                {isWalletConnected ? 'Connected' : 'Connect Wallet'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}