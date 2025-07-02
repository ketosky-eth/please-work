import React, { useState, useEffect } from 'react';
import { Palette, Zap, Shield, Star, Crown, Unlock, Clock, Gift, CheckCircle, AlertTriangle, User, Wallet } from 'lucide-react';
import { useSmartVault } from '../hooks/useSmartVault';
import { useWallet } from '../hooks/useWallet';
import { formatCurrency } from '../hooks/useAnalytics';

interface NFTCollection {
  id: string;
  name: string;
  description: string;
  price: number | null; // null for dynamic pricing
  totalSupply: number | null; // null for unlimited
  minted: number | null; // null to hide minted count
  icon: React.ComponentType<any>;
  gradient: string;
  features: string[];
  rarity: string;
  comingSoon?: boolean;
  isDynamicPrice?: boolean;
}

export default function MintPage() {
  const [selectedCollection, setSelectedCollection] = useState<string>('smart');
  const [isLoading, setIsLoading] = useState(false);
  const [ronPrice, setRonPrice] = useState<number>(0.5); // Default fallback price
  const [smartVaultUsdPrice] = useState(5); // $5 USD
  const [priceLoading, setPriceLoading] = useState(true);

  const { isConnected, connect, address } = useWallet();
  const { hasMinted, mintPrice, mintSmartVault, isContractDeployed } = useSmartVault();

  // Fetch RON price for Smart Vault dynamic pricing
  useEffect(() => {
    const fetchRonPrice = async () => {
      setPriceLoading(true);
      try {
        // Try to fetch from CoinGecko API
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ronin&vs_currencies=usd');
        const data = await response.json();
        
        if (data.ronin && data.ronin.usd) {
          setRonPrice(data.ronin.usd);
        } else {
          // Fallback to fixed price for testnet
          setRonPrice(0.5);
        }
      } catch (error) {
        console.error('Failed to fetch RON price:', error);
        // Use fallback price for testnet
        setRonPrice(0.5);
      } finally {
        setPriceLoading(false);
      }
    };

    fetchRonPrice();
    
    // Update price every 5 minutes
    const interval = setInterval(fetchRonPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate RON amount needed for $5 USD
  const calculateRonAmount = () => {
    if (priceLoading || ronPrice <= 0) return 0;
    return smartVaultUsdPrice / ronPrice;
  };

  const collections: NFTCollection[] = [
    {
      id: 'genesis',
      name: 'Genesis Vault Shard',
      description: 'Exclusive limited edition NFTs for early supporters and founders. A rare digital asset with unique benefits and privileges.',
      price: null, // No price shown
      totalSupply: null, // No supply shown
      minted: null, // No minted count shown
      icon: Crown,
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      features: ['Limited Edition', 'Founder Benefits', 'Exclusive Access', 'Maximized Perks'],
      rarity: 'Legendary',
      comingSoon: true
    },
    {
      id: 'smart',
      name: 'Smart Vault',
      description: 'Essential NFT for the VYTO ecosystem. Mint once per wallet to unlock advanced features like LP token management and fee harvesting.',
      price: isContractDeployed && mintPrice ? Number(mintPrice) / 10**18 : calculateRonAmount(),
      totalSupply: null,
      minted: null, // Hide minted count
      icon: Unlock,
      gradient: 'from-yellow-500 via-orange-500 to-blue-500',
      features: ['One Per Wallet', 'LP Management', 'Fee Harvesting', '1x FREE Meme Token Creation'],
      rarity: 'Essential',
      isDynamicPrice: true
    }
  ];

  const selectedNFT = collections.find(c => c.id === selectedCollection)!;

  const handleMint = async () => {
    if (!isConnected) {
      connect?.();
      return;
    }

    if (!isContractDeployed) {
      alert('Smart contracts are not deployed yet. Please deploy the contracts first.');
      return;
    }

    if (selectedNFT.comingSoon) {
      alert('Genesis Vault Shard coming soon! 🚀');
      return;
    }

    if (selectedCollection === 'smart') {
      if (hasMinted) {
        alert('You have already minted a Smart Vault NFT! Only one per wallet is allowed.');
        return;
      }

      setIsLoading(true);
      try {
        await mintSmartVault();
        alert('Smart Vault NFT minted successfully! 🎉\n\nYou now have access to:\n• Free token creation\n• LP token management\n• Fee harvesting');
      } catch (error) {
        console.error('Mint error:', error);
        alert('Failed to mint Smart Vault NFT. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const totalCost = selectedNFT.price ? selectedNFT.price : 0;
  const estimatedGas = 0.003;

  // Format price display
  const formatPriceDisplay = (collection: NFTCollection) => {
    if (collection.price === null) return 'TBA';
    
    if (collection.isDynamicPrice) {
      if (priceLoading) return 'Loading...';
      return `$${smartVaultUsdPrice} (${collection.price.toFixed(3)} RON)`;
    }
    
    return `${collection.price} RON`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900/10 to-gray-900 pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <Palette className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Build the Future with VYTO
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Mint exclusive NFTs and join the VYTO ecosystem. Choose from our premium collections.
          </p>
        </div>

        {/* Contract Status Warning */}
        {!isContractDeployed && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 text-red-400 mb-2">
              <Shield className="w-6 h-6" />
              <span className="font-semibold">Contracts Not Deployed</span>
            </div>
            <p className="text-red-300">
              The smart contracts haven't been deployed yet. Please deploy them first before minting NFTs.
            </p>
          </div>
        )}

        {/* Price Update Status */}
        {priceLoading && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-8">
            <div className="flex items-center space-x-2 text-blue-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              <span className="text-sm">Updating RON market price...</span>
            </div>
          </div>
        )}

        {/* Collection Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {collections.map((collection) => (
            <div
              key={collection.id}
              onClick={() => !collection.comingSoon && setSelectedCollection(collection.id)}
              className={`relative bg-gray-800/50 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all transform hover:scale-105 ${
                collection.comingSoon 
                  ? 'border-gray-600 opacity-75 cursor-not-allowed' 
                  : selectedCollection === collection.id
                  ? 'border-yellow-500 ring-2 ring-yellow-500/20 cursor-pointer'
                  : 'border-gray-700 hover:border-gray-600 cursor-pointer'
              }`}
            >
              {!collection.comingSoon && selectedCollection === collection.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}

              <div className="flex items-start space-x-4 mb-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${collection.gradient} rounded-xl flex items-center justify-center`}>
                  <collection.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-xl font-bold text-white">{collection.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      collection.rarity === 'Legendary' 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : collection.rarity === 'Essential'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {collection.rarity}
                    </span>
                  </div>
                  {collection.comingSoon && (
                    <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 w-fit">
                      <Clock className="w-3 h-3" />
                      <span>Coming Soon</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mt-2">
                    <span>{formatPriceDisplay(collection)}</span>
                    {collection.minted !== null && (
                      <>
                        <span>•</span>
                        <span>
                          {collection.totalSupply ? `${collection.minted}/${collection.totalSupply} minted` : `${collection.minted} minted`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {collection.description}
              </p>

              <div className="grid grid-cols-2 gap-2">
                {collection.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs text-gray-400">
                    {feature === '1x FREE Meme Token Creation' ? (
                      <Gift className="w-3 h-3 text-green-400" />
                    ) : (
                      <Star className="w-3 h-3" />
                    )}
                    <span className={feature === '1x FREE Meme Token Creation' ? 'text-green-400 font-medium' : ''}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {collection.totalSupply && collection.minted !== null && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{Math.round((collection.minted / collection.totalSupply) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${collection.gradient}`}
                      style={{ width: `${(collection.minted / collection.totalSupply) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Minting Interface */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Mint Controls */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                <span>Mint {selectedNFT.name}</span>
              </h2>

              <div className="space-y-6">
                {/* Smart Vault Status Window */}
                {selectedCollection === 'smart' && (
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-yellow-400" />
                      <span>Smart Vault Status</span>
                    </h3>
                    
                    {!isConnected ? (
                      <div className="text-center py-6">
                        <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-400 mb-4">Connect your wallet to check Smart Vault status</p>
                        <button
                          onClick={connect}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Connect Wallet
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Wallet Info */}
                        <div className="bg-gray-600/50 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <User className="w-5 h-5 text-blue-400" />
                            <span className="text-white font-medium">Wallet Information</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Address</span>
                              <span className="text-white font-mono">
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Network</span>
                              <span className="text-white">Ronin Testnet</span>
                            </div>
                          </div>
                        </div>

                        {/* Smart Vault Status */}
                        <div className="bg-gray-600/50 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <Shield className="w-5 h-5 text-yellow-400" />
                            <span className="text-white font-medium">Smart Vault Status</span>
                          </div>
                          
                          {hasMinted ? (
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2 text-green-400">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Smart Vault Already Minted</span>
                              </div>
                              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                                <p className="text-green-300 text-sm">
                                  ✅ You already own a Smart Vault NFT! You can now:
                                </p>
                                <ul className="text-green-300 text-sm mt-2 space-y-1">
                                  <li>• Create tokens for FREE (first launch)</li>
                                  <li>• Automatically receive LP tokens</li>
                                  <li>• Harvest trading fees</li>
                                  <li>• Access advanced VYTO features</li>
                                </ul>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2 text-orange-400">
                                <AlertTriangle className="w-5 h-5" />
                                <span className="font-medium">No Smart Vault Detected</span>
                              </div>
                              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                                <p className="text-orange-300 text-sm">
                                  You haven't minted a Smart Vault NFT yet. Mint one to unlock:
                                </p>
                                <ul className="text-orange-300 text-sm mt-2 space-y-1">
                                  <li>• <span className="text-green-400 font-medium">FREE first token launch</span></li>
                                  <li>• Automatic LP token management</li>
                                  <li>• Trading fee harvesting</li>
                                  <li>• Advanced ecosystem features</li>
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Minting Eligibility */}
                        <div className="bg-gray-600/50 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <Zap className="w-5 h-5 text-purple-400" />
                            <span className="text-white font-medium">Minting Eligibility</span>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Wallet Connected</span>
                              <span className="text-green-400 flex items-center space-x-1">
                                <CheckCircle className="w-4 h-4" />
                                <span>Yes</span>
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Contracts Deployed</span>
                              <span className={`flex items-center space-x-1 ${isContractDeployed ? 'text-green-400' : 'text-red-400'}`}>
                                {isContractDeployed ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4" />
                                )}
                                <span>{isContractDeployed ? 'Yes' : 'No'}</span>
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Already Minted</span>
                              <span className={`flex items-center space-x-1 ${hasMinted ? 'text-red-400' : 'text-green-400'}`}>
                                {hasMinted ? (
                                  <AlertTriangle className="w-4 h-4" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                                <span>{hasMinted ? 'Yes' : 'No'}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Smart Vault Info for non-Smart Vault collections */}
                {selectedCollection !== 'smart' && selectedNFT.comingSoon && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Coming Soon</span>
                    </div>
                    <p className="text-yellow-300 text-sm">
                      This collection is not available yet. Stay tuned for the launch announcement!
                    </p>
                  </div>
                )}

                {/* Cost Breakdown */}
                {selectedNFT.price !== null && !hasMinted && !priceLoading && selectedCollection === 'smart' && (
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Cost Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Price per NFT</span>
                        <span className="text-white font-semibold">
                          {selectedNFT.isDynamicPrice 
                            ? `$${smartVaultUsdPrice} (${selectedNFT.price.toFixed(3)} RON)`
                            : `${selectedNFT.price} RON`
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Quantity</span>
                        <span className="text-white font-semibold">1</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Subtotal</span>
                        <span className="text-white font-semibold">{totalCost.toFixed(3)} RON</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Gas Fee (Est.)</span>
                        <span className="text-white font-semibold">{estimatedGas} RON</span>
                      </div>
                      <hr className="border-gray-600 my-3" />
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold text-lg">Total</span>
                        <span className="text-white font-bold text-lg">{totalCost.toFixed(3)} RON</span>
                      </div>
                      {selectedNFT.isDynamicPrice && (
                        <div className="text-xs text-gray-400 text-center">
                          ≈ ${smartVaultUsdPrice} USD at current market rate
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mint Button */}
                <button
                  onClick={handleMint}
                  disabled={
                    isLoading || 
                    priceLoading ||
                    !isContractDeployed ||
                    selectedNFT.comingSoon ||
                    selectedNFT.price === null ||
                    (selectedCollection === 'smart' && hasMinted)
                  }
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {selectedNFT.comingSoon ? (
                    <>
                      <Clock className="w-5 h-5" />
                      <span>Coming Soon</span>
                    </>
                  ) : isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Minting...</span>
                    </>
                  ) : priceLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Loading Price...</span>
                    </>
                  ) : !isContractDeployed ? (
                    <span>Deploy Contracts First</span>
                  ) : selectedNFT.price === null ? (
                    <span>Price Loading...</span>
                  ) : selectedCollection === 'smart' && hasMinted ? (
                    <span>Already Minted</span>
                  ) : !isConnected ? (
                    <span>Connect Wallet to Mint</span>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Mint NFT</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preview */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Preview</h3>
              <div className="bg-gray-700/50 rounded-2xl p-6">
                <div className={`aspect-square bg-gradient-to-br ${selectedNFT.gradient} rounded-xl mb-6 flex items-center justify-center relative overflow-hidden`}>
                  <selectedNFT.icon className="w-20 h-20 text-white opacity-80" />
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
                  {selectedNFT.comingSoon && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Clock className="w-12 h-12 mx-auto mb-2" />
                        <div className="text-lg font-bold">Coming Soon</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{selectedNFT.name}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedNFT.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-600/50 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-1">Price</div>
                      <div className="text-white font-semibold">
                        {formatPriceDisplay(selectedNFT)}
                      </div>
                    </div>
                    <div className="bg-gray-600/50 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-1">Supply</div>
                      <div className="text-white font-semibold">
                        {selectedNFT.totalSupply ? selectedNFT.totalSupply : 'Unlimited'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-gray-400 text-sm">Features:</div>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedNFT.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs text-gray-300">
                          {feature === '1x FREE Meme Token Creation' ? (
                            <Gift className="w-3 h-3 text-green-400" />
                          ) : (
                            <Star className="w-3 h-3 text-yellow-400" />
                          )}
                          <span className={feature === '1x FREE Meme Token Creation' ? 'text-green-400 font-medium' : ''}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="/Main Logo.jpg" 
                  alt="VYTO Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-bold text-white">VYTO Protocol</span>
            </div>
            
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
          </div>

          {/* Footer Links */}
          <div className="flex flex-col md:flex-row justify-between items-center py-4 border-t border-gray-800">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
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
            
            <div className="text-gray-400 text-sm text-center md:text-right">
              © VYTO Protocol - Powered by the Ronin Network
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}