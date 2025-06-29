import { useState, useEffect } from 'react';
import { useMemeTokenFactory } from './useMemeTokenFactory';
import { useBondingCurve } from './useBondingCurve';

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
    totalTokens: 0,
    totalVolume24h: 0,
    totalMarketCap: 0,
    graduatedTokens: 0,
    newTokensToday: 0,
    totalFeesEarned: 0,
    activeUsers: 0,
    isLoading: true,
  });

  const { allTokens } = useMemeTokenFactory();

  useEffect(() => {
    const calculateAnalytics = async () => {
      try {
        // For now, we'll use the contract data we have
        const totalTokens = allTokens?.length || 0;
        
        // Since we're starting fresh, all values are 0
        // In a real implementation, these would come from:
        // - Subgraph queries
        // - Contract event logs
        // - API endpoints
        // - Cached analytics data
        
        setAnalyticsData({
          totalTokens,
          totalVolume24h: 0, // Would be calculated from DEX trading data
          totalMarketCap: 0, // Sum of all token market caps
          graduatedTokens: 0, // Tokens that reached graduation target
          newTokensToday: 0, // Tokens created in last 24h
          totalFeesEarned: 0, // Total fees earned by all Smart Vault holders
          activeUsers: 0, // Unique users who interacted in last 24h
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

  const { useTokenInfo, useTokenProgress, useIsGraduated, useCurrentPrice } = useBondingCurve();
  
  const { data: tokenInfo } = useTokenInfo(tokenAddress);
  const { data: progressData } = useTokenProgress(tokenAddress);
  const { data: isGraduated } = useIsGraduated(tokenAddress);
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
        isGraduated: !!isGraduated,
        feesEarned: 0, // Would come from Smart Vault data
        isLoading: false,
      });
    }
  }, [tokenInfo, progressData, isGraduated, currentPrice]);

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

  const { creatorTokens, canUseFreeDeployment } = useMemeTokenFactory();
  const { hasMinted } = useSmartVault();

  useEffect(() => {
    if (userAddress) {
      setUserData({
        tokensCreated: creatorTokens?.length || 0,
        totalFeesEarned: 0, // Would sum up fees from all user's tokens
        totalRewardsClaimed: 0, // Would check claimed rewards from graduated tokens
        hasSmartVault: !!hasMinted,
        canUseFreeDeployment: !!canUseFreeDeployment,
        isLoading: false,
      });
    }
  }, [userAddress, creatorTokens, hasMinted, canUseFreeDeployment]);

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