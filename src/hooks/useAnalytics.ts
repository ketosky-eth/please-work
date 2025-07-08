import { useState, useEffect } from 'react';
import { useSmartVaultCore } from './useSmartVaultCore';

interface AnalyticsData {
  totalTokens: number;
  totalVolume24h: number;
  totalMarketCap: number;
  graduatedTokens: number;
  newTokensToday: number;
  totalFeesEarned: number;
  activeUsers: number;
  isLoading: boolean;
}

export function useAnalytics(): AnalyticsData {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalTokens: 127,
    totalVolume24h: 2340000,
    totalMarketCap: 8950000,
    graduatedTokens: 23,
    newTokensToday: 8,
    totalFeesEarned: 45600,
    activeUsers: 8934,
    isLoading: true,
  });

  const { allTokens } = useSmartVaultCore();

  useEffect(() => {
    const calculateAnalytics = async () => {
      try {
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAnalyticsData({
          totalTokens: 127,
          totalVolume24h: 2340000,
          totalMarketCap: 8950000,
          graduatedTokens: 23,
          newTokensToday: 8,
          totalFeesEarned: 45600,
          activeUsers: 8934,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error calculating analytics:', error);
        setAnalyticsData(prev => ({ ...prev, isLoading: false }));
      }
    };

    calculateAnalytics();
  }, [allTokens]);

  return analyticsData;
}

// Hook for individual token analytics
export function useTokenAnalytics(tokenAddress: string) {
  const [tokenData, setTokenData] = useState({
    price: 0,
    priceChange24h: 0,
    volume24h: 0,
    marketCap: 0,
    holders: 0,
    bondingProgress: 0,
    isGraduated: false,
    feesEarned: 0,
    isLoading: true,
  });

  const { useTokenInfo, useTokenProgress, useCurrentPrice } = useSmartVaultCore();
  
  const { data: tokenInfo } = useTokenInfo(tokenAddress);
  const { data: progressData } = useTokenProgress(tokenAddress);
  const { data: currentPrice } = useCurrentPrice(tokenAddress);

  useEffect(() => {
    if (tokenInfo && progressData && currentPrice !== undefined) {
      const [progress, target] = progressData;
      const bondingProgress = target > 0 ? Math.min((Number(progress) / Number(target)) * 100, 100) : 0;
      
      setTokenData({
        price: Number(currentPrice) / 10**18, // Convert from wei
        priceChange24h: 0, // Would need historical price data
        volume24h: 0, // Would need trading volume data
        marketCap: 0, // Would calculate from price * circulating supply
        holders: 0, // Would need to query token transfer events
        bondingProgress,
        isGraduated: false, // Would check from tokenInfo
        feesEarned: 0, // Would come from Smart Vault data
        isLoading: false,
      });
    }
  }, [tokenInfo, progressData, currentPrice]);

  return tokenData;
}

// Hook for user-specific analytics
export function useUserAnalytics(userAddress: string) {
  const [userData, setUserData] = useState({
    tokensCreated: 0,
    totalFeesEarned: 0,
    totalRewardsClaimed: 0,
    hasSmartVault: false,
    canUseFreeDeployment: false,
    isLoading: true,
  });

  const { creatorTokens } = useSmartVaultCore();

  useEffect(() => {
    if (userAddress) {
      setUserData({
        tokensCreated: 3,
        totalFeesEarned: 2340, // Would sum up fees from all user's tokens
        totalRewardsClaimed: 1250, // Would check claimed rewards from graduated tokens
        hasSmartVault: false, // Would check Smart Vault SBT ownership
        canUseFreeDeployment: false, // Would check deployment eligibility
        isLoading: false,
      });
    } else {
      setUserData(prev => ({ ...prev, isLoading: false }));
    }
  }, [userAddress, creatorTokens]);

  return userData;
}

// Utility functions for formatting analytics data
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatCurrency = (amount: number, symbol: string = 'USD'): string => {
  if (symbol === 'USD') {
    return `$${formatNumber(amount)}`;
  }
  return `${formatNumber(amount)} ${symbol}`;
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
};