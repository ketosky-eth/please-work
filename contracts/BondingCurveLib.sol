// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BondingCurveLib
 * @dev Library for linear bonding curve calculations for multi-chain deployment
 */
library BondingCurveLib {
    // Network-specific constants
    struct NetworkConfig {
        uint256 graduationTarget;
        uint256 startingPrice;
        uint256 protocolReward;
        uint256 feeThreshold; // $200 equivalent in native token
        uint256 launchCost;
    }
    
    // Ronin Network Configuration (Chain ID: 2020/2021)
    uint256 public constant RONIN_GRADUATION_TARGET = 69420 ether; // 69,420 RON
    uint256 public constant RONIN_STARTING_PRICE = 0.0001 ether; // 0.0001 RON
    uint256 public constant RONIN_PROTOCOL_REWARD = 250 ether; // 250 RON
    uint256 public constant RONIN_FEE_THRESHOLD = 400 ether; // ~$200 in RON
    uint256 public constant RONIN_LAUNCH_COST = 0.5 ether; // 0.5 RON
    
    // Base Network Configuration (Chain ID: 8453/84532)
    uint256 public constant BASE_GRADUATION_TARGET = 24 ether; // 24 ETH
    uint256 public constant BASE_STARTING_PRICE = 0.00000001 ether; // 0.00000001 ETH
    uint256 public constant BASE_PROTOCOL_REWARD = 0.05 ether; // 0.05 ETH
    uint256 public constant BASE_FEE_THRESHOLD = 0.08 ether; // ~$200 in ETH
    uint256 public constant BASE_LAUNCH_COST = 0.0001 ether; // 0.0001 ETH
    
    // Universal constants
    uint256 public constant TOKENS_FOR_SALE = 800000000 * 10**18; // 80% of 1B tokens
    uint256 public constant TOKENS_FOR_LIQUIDITY = 200000000 * 10**18; // 20% of 1B tokens
    uint256 public constant PROTOCOL_FEE_BPS = 50; // 0.5%
    uint256 public constant LP_FEE_PROTOCOL_CUT_BPS = 50; // 0.5% of LP fees
    
    struct BondingCurveData {
        uint256 soldAmount;
        uint256 collectedNative;
        bool graduated;
        uint256 createdAt;
        uint256 chainId;
    }
    
    /**
     * @dev Get network configuration based on chain ID
     */
    function getNetworkConfig(uint256 chainId) internal pure returns (NetworkConfig memory) {
        if (chainId == 2020 || chainId == 2021) { // Ronin Mainnet/Testnet
            return NetworkConfig({
                graduationTarget: RONIN_GRADUATION_TARGET,
                startingPrice: RONIN_STARTING_PRICE,
                protocolReward: RONIN_PROTOCOL_REWARD,
                feeThreshold: RONIN_FEE_THRESHOLD,
                launchCost: RONIN_LAUNCH_COST
            });
        } else if (chainId == 8453 || chainId == 84532) { // Base Mainnet/Sepolia
            return NetworkConfig({
                graduationTarget: BASE_GRADUATION_TARGET,
                startingPrice: BASE_STARTING_PRICE,
                protocolReward: BASE_PROTOCOL_REWARD,
                feeThreshold: BASE_FEE_THRESHOLD,
                launchCost: BASE_LAUNCH_COST
            });
        } else {
            revert("Unsupported network");
        }
    }
    
    /**
     * @dev Calculate tokens received for native token amount (linear curve)
     */
    function calculateTokensForNative(
        BondingCurveData memory curve,
        uint256 nativeAmount
    ) internal pure returns (uint256) {
        if (nativeAmount == 0) return 0;
        
        NetworkConfig memory config = getNetworkConfig(curve.chainId);
        uint256 currentPrice = getCurrentPrice(curve);
        return (nativeAmount * 10**18) / currentPrice;
    }
    
    /**
     * @dev Calculate native tokens received for token amount
     */
    function calculateNativeForTokens(
        BondingCurveData memory curve,
        uint256 tokenAmount
    ) internal pure returns (uint256) {
        if (tokenAmount == 0) return 0;
        
        uint256 currentPrice = getCurrentPrice(curve);
        return (tokenAmount * currentPrice) / 10**18;
    }
    
    /**
     * @dev Get current token price based on sold amount (linear curve)
     */
    function getCurrentPrice(BondingCurveData memory curve) internal pure returns (uint256) {
        NetworkConfig memory config = getNetworkConfig(curve.chainId);
        
        uint256 basePrice = config.startingPrice;
        uint256 maxPrice = config.graduationTarget * 10**18 / TOKENS_FOR_SALE;
        uint256 priceIncrease = ((maxPrice - basePrice) * curve.soldAmount) / TOKENS_FOR_SALE;
        
        return basePrice + priceIncrease;
    }
    
    /**
     * @dev Check if bonding curve has reached graduation target
     */
    function hasGraduated(BondingCurveData memory curve) internal pure returns (bool) {
        NetworkConfig memory config = getNetworkConfig(curve.chainId);
        return curve.collectedNative >= config.graduationTarget;
    }
    
    /**
     * @dev Get progress towards graduation (0-100%)
     */
    function getGraduationProgress(BondingCurveData memory curve) internal pure returns (uint256) {
        NetworkConfig memory config = getNetworkConfig(curve.chainId);
        if (curve.collectedNative >= config.graduationTarget) return 100;
        return (curve.collectedNative * 100) / config.graduationTarget;
    }
    
    /**
     * @dev Calculate protocol fee for transaction
     */
    function calculateProtocolFee(uint256 amount) internal pure returns (uint256) {
        return (amount * PROTOCOL_FEE_BPS) / 10000;
    }
    
    /**
     * @dev Check if LP fees meet auto-processing threshold
     */
    function shouldAutoProcessFees(uint256 feeAmount, uint256 chainId) internal pure returns (bool) {
        NetworkConfig memory config = getNetworkConfig(chainId);
        return feeAmount >= config.feeThreshold;
    }
}