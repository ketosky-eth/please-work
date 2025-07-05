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
  hidden?: boolean; // New property to hide collections
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
      comingSoon: true,
      hidden: true // Hide for Phase 2
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
      isDynamicPrice: true,
      hidden: true // Hide for Phase 2
    }
  ];

  // Filter out hidden collections
  const visibleCollections = collections.filter(c => !c.hidden);
  const selectedNFT = collections.find(c => c.id === selectedCollection);

  // If no visible collections, show coming soon message
  if (visibleCollections.length === 0) {
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
              NFT Collections
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Exclusive NFT collections coming in Phase 2 of VYTO Protocol
            </p>
          </div>

          {/* Coming Soon Message */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <Clock className="w-12 h-12 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              NFT Collections Coming Soon!
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              We're working on exciting NFT collections that will unlock special features and benefits in the VYTO ecosystem. 
              Stay tuned for Phase 2 launch!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/launch'}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Launch Token Instead
              </button>
              <button 
                onClick={() => window.location.href = '/roadmap'}
                className="border border-gray-600 text-white hover:bg-gray-800 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                View Roadmap
              </button>
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
                <span className="text-gray-400 text-sm">
                  © VYTO Protocol 2025 - All Rights Reserved.
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}