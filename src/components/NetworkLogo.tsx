import React from 'react';

interface NetworkLogoProps {
  chainId: string | number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function NetworkLogo({ chainId, size = 'md', className = '' }: NetworkLogoProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const getNetworkLogo = () => {
    const id = typeof chainId === 'string' ? chainId : chainId.toString();
    
    switch (id) {
      case '2021': // Ronin Testnet
        return (
          <img 
            src="/networks/ronin-logo.svg" 
            alt="Ronin Network" 
            className={`${sizeClasses[size]} ${className}`}
          />
        );
      case '84532': // Base Sepolia
        return (
          <img 
            src="/networks/base-logo.svg" 
            alt="Base Network" 
            className={`${sizeClasses[size]} ${className}`}
          />
        );
      default:
        // Fallback gradient circle for unknown networks
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-gray-500 to-gray-600 ${className}`}></div>
        );
    }
  };

  return getNetworkLogo();
}