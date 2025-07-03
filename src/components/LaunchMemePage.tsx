import React, { useState, useRef } from 'react';
import { Upload, Rocket, Twitter, Globe, MessageCircle, DollarSign, Zap, TrendingUp, ArrowRight, AlertTriangle, X, Image, CheckCircle, ShoppingCart } from 'lucide-react';
import { TokenData } from '../types';
import { useWallet } from '../hooks/useWallet';
import { useSmartVaultCore } from '../hooks/useSmartVaultCore';
import { ipfsService } from '../utils/ipfs';

export default function LaunchMemePage() {
  const { isConnected, address, chainName, balance, balanceSymbol, connect } = useWallet();
  const { createMemeToken, isContractDeployed } = useSmartVaultCore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [buyAmount, setBuyAmount] = useState<string>('');

  const handleInputChange = (field: keyof TokenData, value: string | boolean) => {
    setTokenData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (now includes GIF)
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (PNG, JPG, GIF, or SVG)');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLaunch = async () => {
    if (!isConnected) {
      connect?.();
      return;
    }

    if (!tokenData.name || !tokenData.symbol) {
      alert('Please fill in the required fields (Name and Symbol)');
      return;
    }

    setIsLoading(true);
    
    try {
      let logoIPFS = '';
      
      // Upload logo to IPFS if provided
      if (logoFile) {
        console.log('Uploading logo to IPFS...');
        logoIPFS = await ipfsService.uploadFile(logoFile);
        console.log('Logo uploaded to IPFS:', logoIPFS);
      }

      // Create token on blockchain
      console.log('Creating token on blockchain...');
      await createMemeToken(
        tokenData.name,
        tokenData.symbol,
        tokenData.description,
        logoIPFS,
        tokenData.website,
        tokenData.twitter,
        tokenData.telegram,
        tokenData.discord
      );

      alert(`Token "${tokenData.name}" (${tokenData.symbol}) launched successfully! 🚀\n\nYour token is now live on the bonding curve and ready for trading.`);
      
      // Reset form
      setTokenData({
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
      setLogoFile(null);
      setLogoPreview('');
      setBuyAmount('');
      
    } catch (error) {
      console.error('Launch error:', error);
      alert('Failed to launch token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyTokens = async () => {
    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      alert('Please enter a valid buy amount');
      return;
    }

    // This would integrate with the bonding curve buy function
    alert(`Buy function would purchase ${buyAmount} RON worth of tokens`);
  };

  const socialLinks = [
    { key: 'website', icon: Globe, placeholder: 'https://mytoken.com', label: 'Website' },
    { key: 'twitter', icon: Twitter, placeholder: 'https://twitter.com/mytoken', label: 'Twitter' },
    { key: 'telegram', icon: MessageCircle, placeholder: 'https://t.me/mytoken', label: 'Telegram' },
    { key: 'discord', icon: MessageCircle, placeholder: 'https://discord.gg/mytoken', label: 'Discord' }
  ];

  // Format balance to 6 decimals
  const formatBalance = (balance: string): string => {
    const num = parseFloat(balance);
    return num.toFixed(6);
  };

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
            Create and deploy your own meme token on Ronin Testnet with bonding curve mechanics!
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
            <button
              onClick={connect}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
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
                  
                  {logoPreview ? (
                    <div className="relative bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-600">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{logoFile?.name}</p>
                          <p className="text-gray-400 text-sm">
                            {logoFile && (logoFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={removeLogo}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={handleFileSelect}
                      className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-yellow-500 transition-colors cursor-pointer"
                    >
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-400 mb-2">Upload your meme logo</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF, SVG up to 5MB</p>
                      <button 
                        type="button"
                        className="mt-3 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Choose File
                      </button>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Bonding Curve Info - Moved below Logo Upload */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                    <ArrowRight className="w-4 h-4" />
                    <span className="font-medium">Bonding Curve Launch</span>
                  </div>
                  <p className="text-yellow-300 text-sm">
                    Your token will launch on a bonding curve. When 69,420 RON is raised, your token graduates to <strong>Katana DEX</strong> with automatic liquidity. Smart Vault holders earn 250 RON creator reward!
                  </p>
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
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Connected</span>
                    <span className="text-green-400">✓ {address?.slice(0, 6)}...{address?.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Network</span>
                    <span className="text-white">{chainName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Balance</span>
                    <span className="text-white">{formatBalance(balance)} {balanceSymbol}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Token Preview */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Token Preview</h3>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Token logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold">
                        {tokenData.symbol.charAt(0) || '?'}
                      </span>
                    )}
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
                
                {/* Social Links Icons */}
                {(tokenData.website || tokenData.twitter || tokenData.telegram || tokenData.discord) && (
                  <div className="flex items-center space-x-2 mb-3">
                    {tokenData.website && (
                      <a
                        href={tokenData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                      >
                        <Globe className="w-4 h-4 text-gray-300 hover:text-white" />
                      </a>
                    )}
                    {tokenData.twitter && (
                      <a
                        href={tokenData.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                      >
                        <Twitter className="w-4 h-4 text-gray-300 hover:text-blue-400" />
                      </a>
                    )}
                    {tokenData.telegram && (
                      <a
                        href={tokenData.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-gray-300 hover:text-blue-400" />
                      </a>
                    )}
                    {tokenData.discord && (
                      <a
                        href={tokenData.discord}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-gray-300 hover:text-purple-400" />
                      </a>
                    )}
                  </div>
                )}
                
                <div className="flex items-center space-x-2 text-xs">
                  <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                    Bonding Curve
                  </span>
                  <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
                    Ronin Testnet
                  </span>
                </div>
              </div>
            </div>

            {/* Launch Details */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Launch Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total Supply</span>
                  <span className="text-white text-sm font-medium">1,000,000,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Creator Reward</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400 text-sm font-medium">SV holders</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Deploy Cost</span>
                  <span className="text-green-400 text-sm font-medium">FREE</span>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleLaunch}
              disabled={!tokenData.name || !tokenData.symbol || isLoading || !isConnected || (isConnected && chainName !== 'Ronin Testnet')}
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

            {/* Notice Message */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-orange-400 font-medium text-sm mb-1"><strong>Irreversible Notice</strong></div>
                  <p className="text-orange-300 text-sm leading-relaxed">
                    Launching without a Smart Vault will disable Creator Rewards and fee earnings.
                  </p>
                </div>
              </div>
            </div>

            {/* Optional Buy Function */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-green-400" />
                <span>Buy Tokens (Optional)</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    RON Amount
                  </label>
                  <input
                    type="number"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    placeholder="0.0"
                    min="0"
                    step="0.001"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleBuyTokens}
                  disabled={!buyAmount || parseFloat(buyAmount) <= 0 || !isConnected}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy Tokens</span>
                </button>
                <p className="text-gray-400 text-xs text-center">
                  Purchase tokens immediately after launch
                </p>
              </div>
            </div>
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
      </div>
    </div>
  );
}