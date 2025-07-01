import React, { useState, useRef } from 'react';
import { Upload, Rocket, Twitter, Globe, MessageCircle, DollarSign, Zap, TrendingUp, ArrowRight, AlertTriangle, X, Image, CheckCircle } from 'lucide-react';
import { TokenData } from '../types';
import { useWallet } from '../hooks/useWallet';
import { useMemeTokenFactory } from '../hooks/useMemeTokenFactory';
import { useSmartVault } from '../hooks/useSmartVault';
import { ipfsService } from '../utils/ipfs';

export default function LaunchMemePage() {
  const { isConnected, address, chainName, balance, balanceSymbol, connect } = useWallet();
  const { createMemeToken, deploymentFee, canUseFreeDeployment, isContractDeployed } = useMemeTokenFactory();
  const { hasMinted: hasSmartVault, isContractDeployed: isSmartVaultDeployed } = useSmartVault();
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

  const handleInputChange = (field: keyof TokenData, value: string | boolean) => {
    setTokenData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (PNG, JPG, or SVG)');
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

    if (!isContractDeployed) {
      alert('Smart contracts are not deployed yet. Please deploy the contracts first using the deployment script.');
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
      
    } catch (error) {
      console.error('Launch error:', error);
      alert('Failed to launch token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const socialLinks = [
    { key: 'website', icon: Globe, placeholder: 'https://mytoken.com', label: 'Website' },
    { key: 'twitter', icon: Twitter, placeholder: 'https://twitter.com/mytoken', label: 'Twitter' },
    { key: 'telegram', icon: MessageCircle, placeholder: 'https://t.me/mytoken', label: 'Telegram' },
    { key: 'discord', icon: MessageCircle, placeholder: 'https://discord.gg/mytoken', label: 'Discord' }
  ];

  const deploymentCost = deploymentFee ? (Number(deploymentFee) / 10**18).toString() : '0.5';
  const costSymbol = 'RON';
  const actualCost = canUseFreeDeployment ? '0' : deploymentCost;

  const hasInsufficientBalance = isConnected && parseFloat(balance) < parseFloat(actualCost);

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

        {/* Contract Deployment Warning */}
        {!isContractDeployed && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 text-red-400 mb-2">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-semibold">Contracts Not Deployed</span>
            </div>
            <p className="text-red-300 mb-4">
              The smart contracts haven't been deployed yet. You need to deploy them first before you can launch tokens.
            </p>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-300 text-sm font-mono">
                Run: <strong>npm run deploy</strong>
              </p>
            </div>
          </div>
        )}

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

        {/* Free Deployment Banner */}
        {isConnected && canUseFreeDeployment && isContractDeployed && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 text-green-400 mb-2">
              <Zap className="w-6 h-6" />
              <span className="font-semibold">FREE Token Launch Available!</span>
            </div>
            <p className="text-green-300">
              You have a Smart Vault NFT! Your first token launch is completely FREE. Take advantage of this exclusive benefit.
            </p>
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

                {/* Bonding Curve Info */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                    <ArrowRight className="w-4 h-4" />
                    <span className="font-medium">Bonding Curve Launch</span>
                  </div>
                  <p className="text-yellow-300 text-sm">
                    Your token will launch on a bonding curve. When 108,800 RON is raised, your token graduates to <strong>Katana DEX</strong> with automatic liquidity. You'll earn <strong>500 RON</strong> as creator reward!
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
                      <p className="text-sm text-gray-500">PNG, JPG, SVG up to 5MB</p>
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
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                    onChange={handleFileChange}
                    className="hidden"
                  />
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
                    <span className="text-white">{balance} {balanceSymbol}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Smart Vault Status */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Smart Vault Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Smart Vault</span>
                  <span className={hasSmartVault ? "text-green-400" : "text-red-400"}>
                    {hasSmartVault ? "✓ Active" : "✗ Not Minted"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Free Launch</span>
                  <span className={canUseFreeDeployment ? "text-green-400" : "text-gray-400"}>
                    {canUseFreeDeployment ? "✓ Available" : "✗ Used/Unavailable"}
                  </span>
                </div>
                {!hasSmartVault && isSmartVaultDeployed && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <p className="text-yellow-300 text-sm">
                      Mint a Smart Vault to automatically receive LP tokens and earn fees from your launched tokens.
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

            {/* Launch Details - Fixed Alignment */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Launch Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total Supply</span>
                  <span className="text-white text-sm font-medium">1,000,000,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">For Sale</span>
                  <span className="text-white text-sm font-medium">800M (80%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">For Liquidity</span>
                  <span className="text-white text-sm font-medium">200M (20%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Graduation Target</span>
                  <span className="text-white text-sm font-medium">108,800 RON</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Creator Reward</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Deploy Cost</span>
                  <span className={`text-sm font-medium ${canUseFreeDeployment ? 'text-green-400' : hasInsufficientBalance ? 'text-red-400' : 'text-white'}`}>
                    {canUseFreeDeployment ? 'FREE' : `${actualCost} ${costSymbol}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Insufficient Balance Warning */}
            {hasInsufficientBalance && !canUseFreeDeployment && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-red-400 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Insufficient Balance</span>
                </div>
                <p className="text-red-300 text-sm">
                  You need at least {actualCost} {costSymbol} to deploy this token. 
                  Your current balance is {balance} {balanceSymbol}.
                </p>
              </div>
            )}

            {/* Launch Button */}
            <button
              onClick={handleLaunch}
              disabled={!tokenData.name || !tokenData.symbol || isLoading || !isConnected || !isContractDeployed || (hasInsufficientBalance && !canUseFreeDeployment) || (isConnected && chainName !== 'Ronin Testnet')}
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
              ) : !isContractDeployed ? (
                <>
                  <span>Deploy Contracts First</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Launch Token 🚀</span>
                </>
              )}
            </button>
            
            {!hasInsufficientBalance && !hasSmartVault && !canUseFreeDeployment && isContractDeployed && (
              <>
                <p className="text-sm text-yellow-500 text-center font-medium">💡 Pro Tip:</p>
                <p className="text-xs text-gray-400 text-center">
                  Mint a Smart Vault NFT to get your first token launch for FREE and earn LP rewards!
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}