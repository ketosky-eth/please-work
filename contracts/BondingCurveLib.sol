// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BondingCurveLib
 * @dev Library for linear bonding curve calculations
 */
library BondingCurveLib {
    uint256 public constant GRADUATION_TARGET = 69420 ether; // 69,420 RON
    uint256 public constant TOKENS_FOR_SALE = 800000000 * 10**18; // 80% of 1B tokens
    uint256 public constant TOKENS_FOR_LIQUIDITY = 200000000 * 10**18; // 20% of 1B tokens
    
    struct BondingCurveData {
        uint256 soldAmount;
        uint256 collectedRON;
        bool graduated;
        uint256 createdAt;
    }
    
    /**
     * @dev Calculate tokens received for RON amount (linear curve)
     * Price starts at 0.0001 RON and increases linearly to target price at graduation
     */
    function calculateTokensForRON(
        BondingCurveData memory curve,
        uint256 ronAmount
    ) internal pure returns (uint256) {
        if (ronAmount == 0) return 0;
        
        uint256 currentPrice = getCurrentPrice(curve);
        return (ronAmount * 10**18) / currentPrice;
    }
    
    /**
     * @dev Calculate RON received for token amount
     */
    function calculateRONForTokens(
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
        uint256 basePrice = 0.0001 ether; // Starting price: 0.0001 RON
        uint256 maxPrice = GRADUATION_TARGET * 10**18 / TOKENS_FOR_SALE; // Price at graduation
        uint256 priceIncrease = ((maxPrice - basePrice) * curve.soldAmount) / TOKENS_FOR_SALE;
        
        return basePrice + priceIncrease;
    }
    
    /**
     * @dev Check if bonding curve has reached graduation target
     */
    function hasGraduated(BondingCurveData memory curve) internal pure returns (bool) {
        return curve.collectedRON >= GRADUATION_TARGET;
    }
    
    /**
     * @dev Get progress towards graduation (0-100%)
     */
    function getGraduationProgress(BondingCurveData memory curve) internal pure returns (uint256) {
        if (curve.collectedRON >= GRADUATION_TARGET) return 100;
        return (curve.collectedRON * 100) / GRADUATION_TARGET;
    }
}