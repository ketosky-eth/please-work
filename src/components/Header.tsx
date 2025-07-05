import React, { useState } from 'react';
import { ChevronDown, Wallet, Network, AlertTriangle } from 'lucide-react';
import { SUPPORTED_CHAINS } from '../constants/chains';
import { Chain } from '../types';
import { useWallet } from '../hooks/useWallet';
import { useNetworkDetection } from '../hooks/useNetworkDetection';
import NetworkStatusIndicator from './NetworkStatusIndicator';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Header({ currentPage, onPageChange }: HeaderProps) {
  const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false);
  
  const { address, connect, disconnect } = useWallet();
  const { 
    isConnected, 
    isSupported, 
    currentChain, 
    switchToNetwork, 
    getServiceCompatibility 
  } = useNetworkDetection();

  const compatibility = getServiceCompatibility();

  const handleConnectWallet = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  const handleChainSelect = async (chain: Chain) => {
    setIsChainDropdownOpen(false);
    try {
      await switchToNetwork(chain.id);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'launch', label: 'Launch Token', disabled: !compatibility.memeTokenFactory },
    { id: 'vault', label: 'My Vault' },
    { id: 'renounce', label: 'Renounce LPs', disabled: !compatibility.lpVaults },
    { id: 'claim', label: 'Claim Rewards', disabled: !compatibility.lpVaults },
    { id: 'roadmap', label: 'Roadmap' }
  ];

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
                onClick={() => !item.disabled && onPageChange(item.id)}
                disabled={item.disabled}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  currentPage === item.id
                    ? 'text-yellow-400 bg-yellow-400/10'
                    : item.disabled
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {item.label}
                {item.disabled && isConnected && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </button>
            ))}
          </nav>

          {/* Chain Selector & Wallet */}
          <div className="flex items-center space-x-3">
            {/* Network Status */}
            <NetworkStatusIndicator showDetails={false} />

            {/* Chain Selector */}
            <div className="relative">
              <button
                onClick={() => setIsChainDropdownOpen(!isChainDropdownOpen)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors group ${
                  isSupported 
                    ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' 
                    : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${
                  currentChain ? getChainColor(currentChain.id) : 'from-gray-500 to-gray-600'
                }`}></div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className={`text-sm font-medium ${
                    isSupported ? 'text-white' : 'text-red-400'
                  }`}>
                    {currentChain?.name || 'Unknown'}
                  </span>
                  {isConnected && (
                    <span className={`text-xs ${
                      isSupported ? 'text-gray-400' : 'text-red-300'
                    }`}>
                      {isSupported ? 'Supported' : 'Unsupported'}
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 transition-colors ${
                  isSupported ? 'text-gray-400 group-hover:text-white' : 'text-red-400'
                }`} />
              </button>

              {isChainDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                  <div className="p-2">
                    <div className="text-xs text-gray-400 px-3 py-2 font-medium">Available Networks</div>
                    {SUPPORTED_CHAINS.map((chain) => (
                      <button
                        key={chain.id}
                        onClick={() => handleChainSelect(chain)}
                        className={`w-full flex items-center space-x-3 px-3 py-3 hover:bg-gray-700 rounded-lg transition-colors ${
                          currentChain?.id === chain.id ? 'bg-gray-700' : ''
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${getChainColor(chain.id)}`}></div>
                        <div className="text-left flex-1">
                          <div className="text-white text-sm font-medium">{chain.name}</div>
                          <div className="text-gray-400 text-xs">
                            {chain.symbol} • Testnet • Meme Tokens + LP Vaults
                          </div>
                        </div>
                        {isConnected && currentChain?.id === chain.id && (
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-gray-700 p-2">
                    <div className="text-xs text-gray-400 px-3 py-1">
                      {isConnected && !isSupported && (
                        <div className="flex items-center space-x-1 text-red-400">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Current network not supported</span>
                        </div>
                      )}
                      {!isConnected && (
                        <span>Connect wallet to switch networks</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Connect Wallet Button */}
            <button
              onClick={handleConnectWallet}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                isConnected && isSupported
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : isConnected && !isSupported
                  ? 'bg-red-600 hover:bg-red-700 text-white'
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
                onClick={() => !item.disabled && onPageChange(item.id)}
                disabled={item.disabled}
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors relative ${
                  currentPage === item.id
                    ? 'text-yellow-400 bg-yellow-400/10'
                    : item.disabled
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {item.label}
                {item.disabled && isConnected && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}