import { useAccount, useBalance, useConnect, useDisconnect, useChainId } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useNetworkDetection } from './useNetworkDetection';

export function useWallet() {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const { isSupported, networkConfig } = useNetworkDetection();
  
  const { data: balanceData } = useBalance({
    address: address,
  });

  const connect = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  // Get network-specific information
  const getNetworkInfo = () => {
    if (!isSupported || !networkConfig) {
      return {
        symbol: 'ETH',
        dexName: 'Unknown',
        launchCost: '0',
        graduationTarget: '0'
      };
    }

    return {
      symbol: networkConfig.symbol,
      dexName: networkConfig.dexName,
      launchCost: networkConfig.launchCost,
      graduationTarget: networkConfig.graduationTarget
    };
  };

  const networkInfo = getNetworkInfo();

  return {
    address,
    isConnected: isConnected && isSupported, // Only consider connected if on supported network
    chainId,
    chainName: chain?.name || 'Unknown',
    balance: balanceData?.formatted || '0',
    balanceSymbol: balanceData?.symbol || networkInfo.symbol,
    isSupported,
    networkConfig,
    networkInfo,
    connect,
    disconnect,
  };
}