// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IRewardRouter
 * @dev Interface for reward distribution routers
 */
interface IRewardRouter {
    /**
     * @dev Distribute rewards according to router logic
     * @param lpToken The LP token address
     * @param creator The vault creator address
     * @param rewardToken The reward token being distributed
     * @param amount The amount to distribute
     */
    function distribute(
        address lpToken,
        address creator,
        address rewardToken,
        uint256 amount
    ) external;
}