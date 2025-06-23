import React, { useState } from 'react';
import { Palette, Zap, Shield, Star, Crown, Unlock } from 'lucide-react';

interface NFTCollection {
  id: string;
  name: string;
  description: string;
  price: number;
  totalSupply: number | null; // null for unlimited
  minted: number;
  icon: React.ComponentType<any>;
  gradient: string;
  features: string[];
  rarity: string;
}

export default function MintPage() {
  const [selectedCollection, setSelectedCollection] = useState<string>('founders');
  const [mintQuantity, setMintQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const collections: NFTCollection[] = [
    {
      id: 'founders',
      name: 'Founders Vault Shard',
      description: 'Exclusive limited edition NFTs for early supporters and founders. Only 350 pieces will ever exist, making each one a rare digital asset.',
      price: 65,
      totalSupply: 350,
      minted: 127,
      icon: Crown,
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      features: ['Limited Edition', 'Founder Benefits', 'Exclusive Access', 'Premium Rewards'],
      rarity: 'Legendary'
    },
    {
      id: 'smart',
      name: 'Smart Vault',
      description: 'Accessible NFTs for the community with unlimited minting. Perfect for getting started in the VYTO ecosystem.',
      price: 5,
      totalSupply: null,
      minted: 2847,
      icon: Unlock,
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      features: ['Unlimited Supply', 'Community Access', 'Affordable Entry', 'Utility Features'],
      rarity: 'Common'
    }
  ];

  const selectedNFT = collections.find(c => c.id === selectedCollection)!;
  const maxMintPerTx = selectedCollection === 'founders' ? 5 : 10;
  const remainingSupply = selectedNFT.totalSupply ? selectedNFT.totalSupply - selectedNFT.minted : null;

  const handleMint = async () => {
    setIsLoading(true);
    // Simulate minting process
    setTimeout(() => {
      setIsLoading(false);
      alert(`Successfully minted ${mintQuantity} ${selectedNFT.name} NFT${mintQuantity > 1 ? 's' : ''}! 🎉`);
    }, 3000);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = mintQuantity + change;
    const maxAllowed = remainingSupply ? Math.min(maxMintPerTx, remainingSupply) : maxMintPerTx;
    
    if (newQuantity >= 1 && newQuantity <= maxAllowed) {
      setMintQuantity(newQuantity);
    }
  };

  const totalCost = selectedNFT.price * mintQuantity;
  const estimatedGas = 0.003;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Palette className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            VYTO NFT Collection
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Mint exclusive NFTs and join the VYTO ecosystem. Choose from our premium collections.
          </p>
        </div>

        {/* Collection Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {collections.map((collection) => (
            <div
              key={collection.id}
              onClick={() => setSelectedCollection(collection.id)}
              className={`relative bg-gray-800/50 backdrop-blur-sm border-2 rounded-2xl p-6 cursor-pointer transition-all transform hover:scale-105 ${
                selectedCollection === collection.id
                  ? 'border-purple-500 ring-2 ring-purple-500/20'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              {selectedCollection === collection.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
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
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {collection.rarity}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>${collection.price} each</span>
                    <span>•</span>
                    <span>
                      {collection.totalSupply ? `${collection.minted}/${collection.totalSupply} minted` : `${collection.minted} minted`}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {collection.description}
              </p>

              <div className="grid grid-cols-2 gap-2">
                {collection.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs text-gray-400">
                    <Star className="w-3 h-3" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {collection.totalSupply && (
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
                <Zap className="w-6 h-6 text-purple-500" />
                <span>Mint {selectedNFT.name}</span>
              </h2>

              <div className="space-y-6">
                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Quantity to Mint
                  </label>
                  <div className="flex items-center justify-center space-x-4 bg-gray-700/50 rounded-xl p-4">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={mintQuantity <= 1}
                      className="w-12 h-12 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors"
                    >
                      -
                    </button>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{mintQuantity}</div>
                      <div className="text-xs text-gray-400">
                        Max {remainingSupply ? Math.min(maxMintPerTx, remainingSupply) : maxMintPerTx} per transaction
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={mintQuantity >= (remainingSupply ? Math.min(maxMintPerTx, remainingSupply) : maxMintPerTx)}
                      className="w-12 h-12 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Supply Warning */}
                {remainingSupply && remainingSupply <= 50 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-yellow-400">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Limited Supply Warning</span>
                    </div>
                    <p className="text-yellow-300 text-sm mt-1">
                      Only {remainingSupply} {selectedNFT.name} NFTs remaining! Once sold out, no more will be minted.
                    </p>
                  </div>
                )}

                {/* Cost Breakdown */}
                <div className="bg-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Cost Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Price per NFT</span>
                      <span className="text-white font-semibold">${selectedNFT.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Quantity</span>
                      <span className="text-white font-semibold">{mintQuantity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Subtotal</span>
                      <span className="text-white font-semibold">${totalCost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Gas Fee (Est.)</span>
                      <span className="text-white font-semibold">{estimatedGas} ETH</span>
                    </div>
                    <hr className="border-gray-600 my-3" />
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-lg">Total</span>
                      <span className="text-white font-bold text-lg">${totalCost}</span>
                    </div>
                  </div>
                </div>

                {/* Mint Button */}
                <button
                  onClick={handleMint}
                  disabled={isLoading || (remainingSupply !== null && remainingSupply <= 0)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Minting...</span>
                    </>
                  ) : remainingSupply !== null && remainingSupply <= 0 ? (
                    <span>Sold Out</span>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Mint NFTs</span>
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
                      <div className="text-white font-semibold">${selectedNFT.price}</div>
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
                    <div className="grid grid-cols-2 gap-2">
                      {selectedNFT.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs text-gray-300">
                          <Star className="w-3 h-3 text-purple-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}