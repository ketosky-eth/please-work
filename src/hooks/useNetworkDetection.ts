import { useEffect, useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { SUPPORTED_CHAINS } from '../constants/chains';
import { NETWORK_CONFIG } from '../constants/contracts';

interface NetworkState {
  currentChain: any;
  isSupported: boolean;
  isConnected: boolean;
  needsSwitch: boolean;
  recommendedChain: any;
  networkConfig: any;
}

export function useNetworkDetection() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  
  const [networkState, setNetworkState] = useState<NetworkState>({
    currentChain: null,
    isSupported: false,
    isConnected: false,
    needsSwitch: false,
    recommendedChain: null,
    networkConfig: null
  });

  const [lastKnownChain, setLastKnownChain] = useState<number | null>(null);

  // Get current chain info
  const getCurrentChain = () => {
    if (!chainId) return null;
    return SUPPORTED_CHAINS.find(chain => parseInt(chain.id) === chainId);
  };

  // Check if current chain is supported
  const isChainSupported = (chainId: number | undefined) => {
    if (!chainId) return false;
    return SUPPORTED_CHAINS.some(chain => parseInt(chain.id) === chainId);
  };

  // Get recommended chain (prefer Ronin, fallback to Base)
  const getRecommendedChain = () => {
    return SUPPORTED_CHAINS.find(chain => chain.id === '2021') || SUPPORTED_CHAINS[0];
  };

  // Get network configuration
  const getNetworkConfig = (chainId: number | undefined) => {
    if (!chainId) return null;
    return NETWORK_CONFIG[chainId as keyof typeof NETWORK_CONFIG] || null;
  };

  // Handle network changes
  useEffect(() => {
    const currentChain = getCurrentChain();
    const isSupported = isChainSupported(chainId);
    const recommendedChain = getRecommendedChain();
    const networkConfig = getNetworkConfig(chainId);

    // Detect network switch
    const hasNetworkChanged = lastKnownChain !== null && lastKnownChain !== chainId;
    
    if (hasNetworkChanged && chainId) {
      console.log(`Network switched from ${lastKnownChain} to ${chainId}`);
      
      // Show notification about network change
      if (isSupported) {
        showNetworkChangeNotification(currentChain?.name || 'Unknown');
      } else {
        showUnsupportedNetworkNotification();
      }
    }

    setNetworkState({
      currentChain,
      isSupported,
      isConnected,
      needsSwitch: isConnected && !isSupported,
      recommendedChain,
      networkConfig
    });

    // Update last known chain
    if (chainId) {
      setLastKnownChain(chainId);
    }
  }, [chainId, isConnected, lastKnownChain]);

  // Show network change notification
  const showNetworkChangeNotification = (chainName: string) => {
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all transform translate-x-full';
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span>Switched to ${chainName}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  // Show unsupported network notification
  const showUnsupportedNetworkNotification = () => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all transform translate-x-full';
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <span>Unsupported network detected</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 5000);
  };

  // Switch to recommended network
  const switchToRecommendedNetwork = async () => {
    if (!recommendedChain) return;
    
    try {
      await switchChain({ chainId: parseInt(recommendedChain.id) });
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  // Switch to specific network
  const switchToNetwork = async (targetChainId: string) => {
    try {
      await switchChain({ chainId: parseInt(targetChainId) });
    } catch (error) {
      console.error('Failed to switch network:', error);
      throw error;
    }
  };

  // Get service compatibility for current network
  const getServiceCompatibility = () => {
    if (!networkState.isSupported || !networkState.networkConfig) {
      return {
        memeTokenFactory: false,
        lpVaults: false,
        dexName: 'Unknown',
        launchCost: '0',
        symbol: 'ETH'
      };
    }

    return {
      memeTokenFactory: true,
      lpVaults: true,
      dexName: networkState.networkConfig.dexName,
      launchCost: networkState.networkConfig.launchCost,
      symbol: networkState.networkConfig.symbol
    };
  };

  return {
    ...networkState,
    switchToRecommendedNetwork,
    switchToNetwork,
    getServiceCompatibility,
    supportedChains: SUPPORTED_CHAINS
  };
}