import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export function useWallet() {
  const { address, isConnected, chain } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  
  const { data: balanceData } = useBalance({
    address: address,
  });

  const connect = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  return {
    address,
    isConnected,
    chainName: chain?.name || 'Unknown',
    balance: balanceData?.formatted || '0',
    balanceSymbol: balanceData?.symbol || 'ETH',
    connect,
    disconnect,
  };
}