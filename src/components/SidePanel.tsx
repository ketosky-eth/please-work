import React from 'react';
import { Home, Rocket, Lock, Vault, DollarSign, Map, ChevronDown, Wallet, Network, AlertTriangle } from 'lucide-react';
import { SUPPORTED_CHAINS } from '../constants/chains';
import { Chain } from '../types';
import { useWallet } from '../hooks/useWallet';
import { useNetworkDetection } from '../hooks/useNetworkDetection';
import NetworkStatusIndicator from './NetworkStatusIndicator';
import NetworkLogo from './NetworkLogo';

interface SidePanelProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function SidePanel({ currentPage, onPageChange }: SidePanelProps) {
  const [isChainDropdownOpen, setIsChainDropdownOpen] = React.useState(false);
  
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

  const toolsItems = [
    { id: 'launch', label: 'Launch Token', icon: Rocket, disabled: !compatibility.memeTokenFactory },
    { id: 'renounce', label: 'Renounce LPs', icon: Lock, disabled: !compatibility.lpVaults }
  ];

  const vaultItems = [
    { id: 'vault', label: 'My Vault', icon: Vault },
    { id: 'claim', label: 'Claim Rewards', icon: DollarSign, disabled: !compatibility.lpVaults }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-md border-r border-gray-800 z-50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
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
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6">
        {/* Home */}
        <div>
          <button
            onClick={() => onPageChange('home')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentPage === 'home'
                ? 'bg-yellow-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Tools Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">
            Tools
          </h3>
          <div className="space-y-1">
            {toolsItems.map((item) => (
              <button
                key={item.id}
                onClick={() => !item.disabled && onPageChange(item.id)}
                disabled={item.disabled}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors relative ${
                  currentPage === item.id
                    ? 'bg-yellow-600 text-white'
                    : item.disabled
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.disabled && isConnected && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Vault Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">
            Vault
          </h3>
          <div className="space-y-1">
            {vaultItems.map((item) => (
              <button
                key={item.id}
                onClick={() => !item.disabled && onPageChange(item.id)}
                disabled={item.disabled}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors relative ${
                  currentPage === item.id
                    ? 'bg-yellow-600 text-white'
                    : item.disabled
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.disabled && isConnected && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Network & Wallet Section */}
      <div className="p-4 border-t border-gray-800 space-y-4">
        {/* Network Status */}
        <div className="flex items-center justify-between">
          <NetworkStatusIndicator showDetails={true} />
        </div>

        {/* Chain Selector */}
        <div className="relative">
          <button
            onClick={() => setIsChainDropdownOpen(!isChainDropdownOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
              isSupported 
                ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' 
                : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30'
            }`}
          >
            <div className="flex items-center space-x-3">
              <NetworkLogo 
                chainId={currentChain?.id || '2021'} 
                size="md"
              />
              <div className="text-left">
                <div className={`text-sm font-medium ${
                  isSupported ? 'text-white' : 'text-red-400'
                }`}>
                  {currentChain?.name || 'Unknown'}
                </div>
                {isConnected && (
                  <div className={`text-xs ${
                    isSupported ? 'text-gray-400' : 'text-red-300'
                  }`}>
                    {isSupported ? 'Supported' : 'Unsupported'}
                  </div>
                )}
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 transition-colors ${
              isSupported ? 'text-gray-400' : 'text-red-400'
            }`} />
          </button>

          {isChainDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
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
                    <NetworkLogo chainId={chain.id} size="md" />
                    <div className="text-left flex-1">
                      <div className="text-white text-sm font-medium">{chain.name}</div>
                      <div className="text-gray-400 text-xs">
                        {chain.symbol} • Testnet
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
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
            isConnected && isSupported
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : isConnected && !isSupported
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span className="text-sm">
            {isConnected 
              ? `${address?.slice(0, 6)}...${address?.slice(-4)}` 
              : 'Connect Wallet'
            }
          </span>
        </button>
      </div>

      {/* Roadmap at bottom */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => onPageChange('roadmap')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            currentPage === 'roadmap'
              ? 'bg-yellow-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Map className="w-5 h-5" />
          <span className="font-medium">Roadmap</span>
        </button>
      </div>
    </div>
  );
}