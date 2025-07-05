// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IRewardRouter.sol";

/**
 * @title RewardRouterBasic
 * @dev Basic reward router that simply transfers rewards to the creator
 * Stateless and trustless implementation
 */
contract RewardRouterBasic is IRewardRouter {
    using SafeERC20 for IERC20;
    
    // ============ Events ============
    
    event RewardDistributed(
        address indexed lpToken,
        address indexed creator,
        address indexed rewardToken,
        uint256 amount
    );
    
    // ============ Main Function ============
    
    /**
     * @dev Distribute rewards directly to creator
     * @param lpToken The LP token address (for tracking purposes)
     * @param creator The creator address to receive rewards
     * @param rewardToken The reward token being distributed
     * @param amount The amount to distribute
     */
    function distribute(
        address lpToken,
        address creator,
        address rewardToken,
        uint256 amount
    ) external override {
        require(creator != address(0), "Invalid creator");
        require(rewardToken != address(0), "Invalid reward token");
        require(amount > 0, "Amount must be positive");
        
        // Transfer full amount to creator
        IERC20(rewardToken).safeTransferFrom(msg.sender, creator, amount);
        
        emit RewardDistributed(lpToken, creator, rewardToken, amount);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get router info
     */
    function getRouterInfo() external pure returns (
        string memory name,
        string memory version,
        bool isUpgradeable
    ) {
        return ("RewardRouterBasic", "1.0.0", false);
    }
}