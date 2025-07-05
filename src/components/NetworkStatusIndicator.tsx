import React from 'react';
import { Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNetworkDetection } from '../hooks/useNetworkDetection';

interface NetworkStatusIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export default function NetworkStatusIndicator({ 
  showDetails = false, 
  className = '' 
}: NetworkStatusIndicatorProps) {
  const { 
    isConnected, 
    isSupported, 
    currentChain, 
    networkConfig,
    getServiceCompatibility 
  } = useNetworkDetection();

  const compatibility = getServiceCompatibility();

  if (!isConnected) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <WifiOff className="w-4 h-4 text-gray-400" />
        {showDetails && <span className="text-gray-400 text-sm">Not Connected</span>}
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <AlertTriangle className="w-4 h-4 text-red-400" />
        {showDetails && (
          <span className="text-red-400 text-sm">
            Unsupported Network
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <CheckCircle className="w-4 h-4 text-green-400" />
      {showDetails && (
        <div className="text-sm">
          <span className="text-green-400 font-medium">{currentChain?.name}</span>
          <div className="text-gray-400 text-xs">
            {compatibility.memeTokenFactory && '✓ Meme Tokens'} 
            {compatibility.lpVaults && ' ✓ LP Vaults'}
          </div>
        </div>
      )}
    </div>
  );
}