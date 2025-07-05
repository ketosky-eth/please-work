import React, { useState } from 'react';
import { ChevronDown, Wallet, Network } from 'lucide-react';
import { SUPPORTED_CHAINS } from '../constants/chains';
import { Chain } from '../types';
import { useWallet } from '../hooks/useWallet';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Header({ currentPage, onPageChange }: HeaderProps) {
  const [selectedChain, setSelectedChain] = useState<Chain>(SUPPORTED_CHAINS[0]);
  const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false);
  
  const { isConnected, address, connect, disconnect, chainName, chainId } = useWallet();

  const handleConnectWallet = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  const handleChainSelect = (chain: Chain) => {
    setSelectedChain(chain);
    setIsChainDropdownOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'launch', label: 'Launch Token' },
    { id: 'vault', label: 'My Vault' },
    { id: 'renounce', label: 'Renounce LPs' },
    { id: 'claim', label: 'Claim Rewards' },
    { id: 'roadmap', label: 'Roadmap' }
  ];

  // Get current chain info
  const getCurrentChain = () => {
    if (isConnected && chainId) {
      const chain = SUPPORTED_CHAINS.find(c => parseInt(c.id) === chainId);
      return chain || selectedChain;
    }
    return selectedChain;
  };

  const currentChain = getCurrentChain();

  const getChainColor = (chainId: string) => {
    switch (chainId) {
      case '2021': return 'from-yellow-500 to-orange-500';
      case '84532': return 'from-blue-500 to-purple-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img 
                src="/Main Logo.jpg" 
                alt="VYTO Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold text-white">VYTO</span>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-yellow-400 bg-yellow-400/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Chain Selector & Wallet */}
          <div className="flex items-center space-x-3">
            {/* Chain Selector */}
            <div className="relative">
              <button
                onClick={() => setIsChainDropdownOpen(!isChainDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors group"
              >
                <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${getChainColor(currentChain.id)}`}></div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm text-white font-medium">{currentChain.name}</span>
                  {isConnected && (
                    <span className="text-xs text-gray-400">Connected</span>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </button>

              {isChainDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                  <div className="p-2">
                    <div className="text-xs text-gray-400 px-3 py-2 font-medium">Available Networks</div>
                    {SUPPORTED_CHAINS.map((chain) => (
                      <button
                        key={chain.id}
                        onClick={() => handleChainSelect(chain)}
                        className={`w-full flex items-center space-x-3 px-3 py-3 hover:bg-gray-700 rounded-lg transition-colors ${
                          currentChain.id === chain.id ? 'bg-gray-700' : ''
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${getChainColor(chain.id)}`}></div>
                        <div className="text-left flex-1">
                          <div className="text-white text-sm font-medium">{chain.name}</div>
                          <div className="text-gray-400 text-xs">{chain.symbol} • {chain.id === '2021' ? 'Testnet' : 'Testnet'}</div>
                        </div>
                        {isConnected && chainId === parseInt(chain.id) && (
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-gray-700 p-2">
                    <div className="text-xs text-gray-400 px-3 py-1">
                      Switch networks in your wallet to change chains
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Connect Wallet Button */}
            <button
              onClick={handleConnectWallet}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                isConnected
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:block">
                {isConnected 
                  ? `${address?.slice(0, 6)}...${address?.slice(-4)}` 
                  : 'Connect Wallet'
                }
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t border-gray-800 py-3">
          <div className="flex items-center space-x-4 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  currentPage === item.id
                    ? 'text-yellow-400 bg-yellow-400/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}