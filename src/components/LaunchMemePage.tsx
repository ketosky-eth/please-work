import React, { useState } from 'react';
import { Upload, Rocket, Twitter, Globe, MessageCircle, DollarSign, Zap, TrendingUp, ArrowRight, AlertTriangle } from 'lucide-react';
import { TokenData } from '../types';

export default function LaunchMemePage() {
  const [isConnected] = useState(false);
  const [address] = useState('');
  const [chainName] = useState('Ronin Testnet');
  const [balance] = useState('0');
  const [balanceSymbol] = useState('RON');
  
  const [tokenData, setTokenData] = useState<TokenData>({
    name: '',
    symbol: '',
    description: '',
    logo: '',
    website: '',
    twitter: '',
    telegram: '',
    discord: '',
    initialBuy: false,
    initialBuyAmount: '',
    selectedChain: 'Ronin Testnet',
    selectedDEX: 'Katana'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof TokenData, value: string | boolean) => {
    setTokenData(prev => ({ ...prev, [field]: value }));
  };

  const handleLaunch = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    // Simulate token creation with wallet interaction
    setTimeout(() => {
      setIsLoading(false);
      alert(`Token launched successfully on Katana (Ronin Testnet)! 🚀\n\nTransaction will be sent to your wallet for confirmation.`);
    }, 3000);
  };

  const socialLinks = [
    { key: 'website', icon: Globe, placeholder: 'https://mytoken.com', label: 'Website' },
    { key: 'twitter', icon: Twitter, placeholder: 'https://twitter.com/mytoken', label: 'Twitter' },
    { key: 'telegram', icon: MessageCircle, placeholder: 'https://t.me/mytoken', label: 'Telegram' },
    { key: 'discord', icon: MessageCircle, placeholder: 'https://discord.gg/mytoken', label: 'Discord' }
  ];

  const deploymentCost = '0.05';
  const costSymbol = 'RON';

  const hasInsufficientBalance = isConnected && parseFloat(balance) < parseFloat(deploymentCost);
  const hasSmartVault = false; // This would be checked from the Smart Vault contract

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900/10 to-gray-900 pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <Rocket className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Launch Your Meme Token
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create and deploy your own meme token on Ronin Testnet. Launch on Katana DEX for instant liquidity!
          </p>
        </div>

        {/* Wallet Connection Warning */}
        {!isConnected && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 text-yellow-400 mb-2">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-semibold">Wallet Connection Required</span>
            </div>
            <p className="text-yellow-300 mb-4">
              You need to connect your wallet to launch tokens. This ensures secure deployment and ownership of your contracts.
            </p>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Connect Wallet Now
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Token Creation Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
                <span>Token Details</span>
              </h2>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Token Name *
                    </label>
                    <input
                      type="text"
                      value={tokenData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Token Name"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Symbol *
                    </label>
                    <input
                      type="text"
                      value={tokenData.symbol}
                      onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                      placeholder="TKN"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Network Info */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                    <ArrowRight className="w-4 h-4" />
                    <span className="font-medium">Launch Information</span>
                  </div>
                  <p className="text-yellow-300 text-sm">
                    Your token will be launched on <strong>Katana DEX</strong> on the <strong>Ronin Testnet</strong> network. 
                    Liquidity will be automatically added and trading will begin immediately.
                  </p>
                </div>

                {/* Network Mismatch Warning */}
                {isConnected && chainName !== 'Ronin Testnet' && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-orange-400 mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">Network Mismatch</span>
                    </div>
                    <p className="text-orange-300 text-sm">
                      Your wallet is connected to <strong>{chainName}</strong> but you need to be on <strong>Ronin Testnet</strong>. 
                      Please switch networks in your wallet.
                    </p>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={tokenData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Moon it! 🚀"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Token Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-yellow-500 transition-colors">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">Upload your meme logo</p>
                    <p className="text-sm text-gray-500">PNG, JPG, SVG up to 5MB</p>
                    <button className="mt-3 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                      Choose File
                    </button>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Social Links (Optional)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {socialLinks.map((social) => (
                      <div key={social.key}>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                          <social.icon className="w-4 h-4" />
                          <span>{social.label}</span>
                        </label>
                        <input
                          type="url"
                          value={tokenData[social.key as keyof TokenData] as string}
                          onChange={(e) => handleInputChange(social.key as keyof TokenData, e.target.value)}
                          placeholder={social.placeholder}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Initial Buy Option */}
                <div className="bg-gray-700/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-yellow-500" />
                        <span>Initial Buy (Optional)</span>
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Be the first token holder before it reaches Katana
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tokenData.initialBuy}
                        onChange={(e) => handleInputChange('initialBuy', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                    </label>
                  </div>
                  
                  {tokenData.initialBuy && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Amount (RON)
                      </label>
                      <input
                        type="text"
                        value={tokenData.initialBuyAmount}
                        onChange={(e) => handleInputChange('initialBuyAmount', e.target.value)}
                        placeholder="0.001"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet Status */}
            {isConnected && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Wallet Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Connected</span>
                    <span className="text-green-400">✓ {address?.slice(0, 6)}...{address?.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network</span>
                    <span className="text-white">{chainName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Balance</span>
                    <span className="text-white">{balance} {balanceSymbol}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Smart Vault Status */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Smart Vault Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Smart Vault</span>
                  <span className={hasSmartVault ? "text-green-400" : "text-red-400"}>
                    {hasSmartVault ? "✓ Active" : "✗ Not Minted"}
                  </span>
                </div>
                {!hasSmartVault && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <p className="text-yellow-300 text-sm">
                      Mint a Smart Vault NFT to automatically receive LP tokens and earn fees from your launched tokens.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Token Preview */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Token Preview</h3>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {tokenData.symbol.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {tokenData.name || 'Token Name'}
                    </div>
                    <div className="text-gray-400 text-sm">
                      ${tokenData.symbol || 'SYMBOL'}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  {tokenData.description || 'Token description will appear here...'}
                </p>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                    Ronin Testnet
                  </span>
                  <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
                    Katana
                  </span>
                </div>
              </div>
            </div>

            {/* Launch Stats */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Launch Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Supply</span>
                  <span className="text-white">1,000,000,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-white">0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network</span>
                  <span className="text-white">Ronin Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">DEX</span>
                  <span className="text-white">Katana</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Deploy Cost</span>
                  <span className={`text-white ${hasInsufficientBalance ? 'text-red-400' : ''}`}>
                    ~{deploymentCost} {costSymbol}
                  </span>
                </div>
              </div>
            </div>

            {/* Insufficient Balance Warning */}
            {hasInsufficientBalance && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-red-400 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Insufficient Balance</span>
                </div>
                <p className="text-red-300 text-sm">
                  You need at least {deploymentCost} {costSymbol} to deploy this token. 
                  Your current balance is {balance} {balanceSymbol}.
                </p>
              </div>
            )}

            {/* Launch Button */}
            <button
              onClick={handleLaunch}
              disabled={!tokenData.name || !tokenData.symbol || isLoading || !isConnected || hasInsufficientBalance || (isConnected && chainName !== 'Ronin Testnet')}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Launching...</span>
                </>
              ) : !isConnected ? (
                <>
                  <span>Connect Wallet to Launch</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Launch Token 🚀</span>
                </>
              )}
            </button>
            
            {!hasInsufficientBalance && !hasSmartVault && (
              <>
                <p className="text-m text-yellow-500 text-center">Warning:</p>
                <p className="text-s text-gray-400 text-center">
                  Launching without a Smart Vault will not earn you liquidity rewards post-bonding curve.
                </p>
                <p className="text-xs text-yellow-500 text-center">
                  Proceed with caution.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}