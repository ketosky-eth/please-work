import React from 'react';
import { AlertTriangle, Zap, ExternalLink } from 'lucide-react';
import { useNetworkDetection } from '../hooks/useNetworkDetection';

export default function NetworkCompatibilityBanner() {
  const { 
    isConnected, 
    isSupported, 
    needsSwitch, 
    currentChain, 
    recommendedChain,
    switchToRecommendedNetwork,
    getServiceCompatibility 
  } = useNetworkDetection();

  const compatibility = getServiceCompatibility();

  // Don't show banner if not connected or network is supported
  if (!isConnected || isSupported) {
    return null;
  }

  return (
    <div className="bg-red-500/10 border-l-4 border-red-500 p-4 mb-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-red-400 font-semibold mb-2">
            Unsupported Network Detected
          </h3>
          <p className="text-red-300 text-sm mb-4">
            You're currently connected to <strong>{currentChain?.name || 'an unsupported network'}</strong>. 
            VYTO Protocol services are not available on this network.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={switchToRecommendedNetwork}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span>Switch to {recommendedChain?.name}</span>
            </button>
            
            <div className="flex items-center space-x-4 text-xs text-red-300">
              <span>Supported networks:</span>
              <div className="flex space-x-2">
                <span className="bg-red-500/20 px-2 py-1 rounded">Saigon Testnet</span>
                <span className="bg-red-500/20 px-2 py-1 rounded">Base Sepolia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}