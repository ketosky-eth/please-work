import React, { useState } from 'react';
import { Home, Rocket, Lock, Vault, DollarSign, FileText, ChevronDown, ChevronLeft, ChevronRight, Wallet, Network, AlertTriangle, Copy, ExternalLink, LogOut, Flame, BarChart3, User } from 'lucide-react';
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  
  const { address, connect, disconnect, balance, balanceSymbol } = useWallet();
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
      setIsWalletDropdownOpen(!isWalletDropdownOpen);
    } else {
      connect();
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setIsWalletDropdownOpen(false);
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      // You could add a toast notification here
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
    { id: 'renounce', label: 'Renounce LPs', icon: Lock, disabled: !compatibility.lpVaults },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, disabled: false }
  ];

  const vaultItems = [
    { id: 'vault', label: 'My Vault', icon: Vault },
    { id: 'claim', label: 'Claim Rewards', icon: DollarSign, disabled: !compatibility.lpVaults },
    { id: 'profile', label: 'Profile', icon: User, disabled: false }
  ];

  const getExplorerUrl = () => {
    if (!address || !currentChain) return '#';
    
    switch (currentChain.id) {
      case '2021':
        return `https://saigon-app.roninchain.com/address/${address}`;
      case '84532':
        return `https://sepolia-explorer.base.org/address/${address}`;
      default:
        return '#';
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-900/95 backdrop-blur-md border-r border-gray-800 z-50 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo & Collapse Button */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img 
                src="/Main Logo.jpg" 
                alt="VYTO Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg font-bold text-white">VYTO</span>
          </div>
        )}
        
        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg overflow-hidden mx-auto">
            <img 
              src="/Main Logo.jpg" 
              alt="VYTO Logo" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-3 space-y-6">
        {/* Home */}
        <div>
          <button
            onClick={() => onPageChange('home')}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-lg transition-colors group relative ${
              currentPage === 'home'
                ? 'bg-yellow-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
            title={isCollapsed ? 'Home' : ''}
          >
            <Home className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">Home</span>}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Home
              </div>
            )}
          </button>
        </div>

        <div>
          <button
            onClick={() => onPageChange('flamenize')}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-lg transition-colors group relative ${
              currentPage === 'flamenize'
                ? 'bg-orange-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
            title={isCollapsed ? 'Flamenize' : ''}
          >
            <Flame className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">Flamenize</span>}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Flamenize
              </div>
            )}
          </button>
        </div>

        {/* Tools Section */}
        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Tools
            </h3>
          )}
          <div className="space-y-1">
            {toolsItems.map((item) => (
              <button
                key={item.id}
                onClick={() => !item.disabled && onPageChange(item.id)}
                disabled={item.disabled}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-lg transition-colors relative group ${
                  currentPage === item.id
                    ? 'bg-yellow-600 text-white'
                    : item.disabled
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                {item.disabled && isConnected && (
                  <div className={`absolute ${isCollapsed ? 'top-1 right-1' : 'top-2 right-2'} w-2 h-2 bg-red-500 rounded-full`}></div>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                    {item.disabled && ' (Unavailable)'}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Vault Section */}
        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Vault
            </h3>
          )}
          <div className="space-y-1">
            {vaultItems.map((item) => (
              <button
                key={item.id}
                onClick={() => !item.disabled && onPageChange(item.id)}
                disabled={item.disabled}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-lg transition-colors relative group ${
                  currentPage === item.id
                    ? 'bg-yellow-600 text-white'
                    : item.disabled
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                {item.disabled && isConnected && (
                  <div className={`absolute ${isCollapsed ? 'top-1 right-1' : 'top-2 right-2'} w-2 h-2 bg-red-500 rounded-full`}></div>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                    {item.disabled && ' (Unavailable)'}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Network & Wallet Section */}
      {!isCollapsed && (
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

          {/* Interactive Wallet Button */}
          <div className="relative">
            <button
              onClick={handleConnectWallet}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
                isConnected && isSupported
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : isConnected && !isSupported
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-sm">
                    {isConnected 
                      ? `${address?.slice(0, 6)}...${address?.slice(-4)}` 
                      : 'Connect Wallet'
                    }
                  </div>
                  {isConnected && (
                    <div className="text-xs opacity-80">
                      {parseFloat(balance).toFixed(4)} {balanceSymbol}
                    </div>
                  )}
                </div>
              </div>
              {isConnected && (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Wallet Dropdown */}
            {isConnected && isWalletDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                <div className="p-4">
                  <div className="text-sm text-gray-400 mb-2">Wallet Address</div>
                  <div className="flex items-center justify-between mb-4">
                    <code className="text-white text-sm font-mono">
                      {address?.slice(0, 8)}...{address?.slice(-8)}
                    </code>
                    <button
                      onClick={handleCopyAddress}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title="Copy address"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-2">Balance</div>
                  <div className="text-white font-semibold mb-4">
                    {parseFloat(balance).toFixed(6)} {balanceSymbol}
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => window.open(getExplorerUrl(), '_blank')}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View on Explorer</span>
                    </button>
                    
                    <button
                      onClick={handleDisconnect}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapsed Network & Wallet Icons */}
      {isCollapsed && (
        <div className="p-3 border-t border-gray-800 space-y-3">
          {/* Network Icon */}
          <div className="relative group">
            <button
              onClick={() => setIsChainDropdownOpen(!isChainDropdownOpen)}
              className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors ${
                isSupported 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-red-500/10 hover:bg-red-500/20'
              }`}
              title="Switch Network"
            >
              <NetworkLogo 
                chainId={currentChain?.id || '2021'} 
                size="md"
              />
            </button>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {currentChain?.name || 'Unknown Network'}
            </div>
          </div>

          {/* Wallet Icon */}
          <div className="relative group">
            <button
              onClick={handleConnectWallet}
              className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors ${
                isConnected && isSupported
                  ? 'bg-green-600 hover:bg-green-700'
                  : isConnected && !isSupported
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
              }`}
              title={isConnected ? 'Wallet Connected' : 'Connect Wallet'}
            >
              <Wallet className="w-5 h-5 text-white" />
            </button>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
            </div>
          </div>
        </div>
      )}

      {/* Whitepaper at bottom */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={() => window.open('https://docs.vyto.xyz/whitepaper', '_blank')}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-lg transition-colors group relative text-gray-300 hover:text-white hover:bg-gray-800`}
          title={isCollapsed ? 'Whitepaper' : ''}
        >
          <FileText className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Whitepaper</span>}
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Whitepaper
            </div>
          )}
        </button>
      </div>
    </div>
  );
}