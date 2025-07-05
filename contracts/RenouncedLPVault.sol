// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IRewardRouter.sol";

/**
 * @title RenouncedLPVault
 * @dev Individual vault for permanently locking LP tokens while earning rewards
 */
contract RenouncedLPVault is ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    // ============ Immutable Variables ============
    
    address public immutable lpToken;
    address public immutable creator;
    address public immutable protocolTreasury;
    uint256 public immutable protocolFeeBps;
    
    // ============ State Variables ============
    
    address public rewardRouter;
    bool public rewardRouterFrozen;
    uint256 public totalLPLocked;
    uint256 public createdAt;
    
    // Reward tracking: token => amount
    mapping(address => uint256) public accruedRewards;
    mapping(address => uint256) public totalRewardsClaimed;
    
    // Constants
    uint256 public constant AUTO_CLAIM_THRESHOLD_USD = 250e18; // $250 in 18 decimals
    uint256 public constant BASIS_POINTS = 10000;
    
    // Storage gap for future upgrades
    uint256[50] private __gap;
    
    // ============ Events ============
    
    event LPDeposited(address indexed depositor, uint256 amount, uint256 totalLocked);
    event RewardClaimed(
        address indexed rewardToken,
        uint256 grossAmount,
        uint256 protocolFee,
        uint256 netAmount,
        bool isAutoClaim
    );
    event RewardRouterUpdated(address oldRouter, address newRouter);
    event RewardRouterFrozen();
    event RewardAccrued(address indexed rewardToken, uint256 amount);
    
    // ============ Modifiers ============
    
    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator");
        _;
    }
    
    modifier routerNotFrozen() {
        require(!rewardRouterFrozen, "Router frozen");
        _;
    }
    
    // ============ Constructor ============
    
    constructor(
        address _lpToken,
        address _creator,
        address _protocolTreasury,
        address _rewardRouter,
        uint256 _protocolFeeBps
    ) {
        require(_lpToken != address(0), "Invalid LP token");
        require(_creator != address(0), "Invalid creator");
        require(_protocolTreasury != address(0), "Invalid treasury");
        require(_rewardRouter != address(0), "Invalid router");
        require(_protocolFeeBps <= 100, "Fee too high"); // Max 1%
        
        lpToken = _lpToken;
        creator = _creator;
        protocolTreasury = _protocolTreasury;
        protocolFeeBps = _protocolFeeBps;
        rewardRouter = _rewardRouter;
        createdAt = block.timestamp;
    }
    
    // ============ LP Management ============
    
    /**
     * @dev Deposit LP tokens (only creator can deposit, tokens are permanently locked)
     */
    function depositLP(uint256 amount) external onlyCreator nonReentrant {
        require(amount > 0, "Amount must be positive");
        
        IERC20(lpToken).safeTransferFrom(msg.sender, address(this), amount);
        totalLPLocked += amount;
        
        emit LPDeposited(msg.sender, amount, totalLPLocked);
    }
    
    /**
     * @dev Emergency function to recover non-LP tokens sent by mistake
     */
    function recoverToken(address token, uint256 amount) external onlyCreator {
        require(token != lpToken, "Cannot recover LP token");
        require(amount > 0, "Amount must be positive");
        
        IERC20(token).safeTransfer(creator, amount);
    }
    
    // ============ Reward Management ============
    
    /**
     * @dev Accrue rewards (can be called by anyone, typically by reward distributors)
     */
    function accrueReward(address rewardToken, uint256 amount) external nonReentrant {
        require(rewardToken != address(0), "Invalid reward token");
        require(amount > 0, "Amount must be positive");
        
        IERC20(rewardToken).safeTransferFrom(msg.sender, address(this), amount);
        accruedRewards[rewardToken] += amount;
        
        emit RewardAccrued(rewardToken, amount);
    }
    
    /**
     * @dev Manual claim rewards (no threshold, creator only)
     */
    function manualClaim(address rewardToken, uint256 amount) external onlyCreator nonReentrant {
        _claimReward(rewardToken, amount, false);
    }
    
    /**
     * @dev Auto claim rewards (only when amount >= $250 threshold)
     */
    function autoClaim(address rewardToken, uint256 amount) external nonReentrant {
        require(_isAboveThreshold(rewardToken, amount), "Below auto-claim threshold");
        _claimReward(rewardToken, amount, true);
    }
    
    /**
     * @dev Internal claim logic
     */
    function _claimReward(address rewardToken, uint256 amount, bool isAutoClaim) internal {
        require(rewardToken != address(0), "Invalid reward token");
        require(amount > 0, "Amount must be positive");
        require(accruedRewards[rewardToken] >= amount, "Insufficient accrued rewards");
        
        // Calculate protocol fee
        uint256 protocolFee = (amount * protocolFeeBps) / BASIS_POINTS;
        uint256 netAmount = amount - protocolFee;
        
        // Update state
        accruedRewards[rewardToken] -= amount;
        totalRewardsClaimed[rewardToken] += amount;
        
        // Transfer protocol fee
        if (protocolFee > 0) {
            IERC20(rewardToken).safeTransfer(protocolTreasury, protocolFee);
        }
        
        // Distribute net amount via reward router
        IERC20(rewardToken).safeApprove(rewardRouter, netAmount);
        IRewardRouter(rewardRouter).distribute(lpToken, creator, rewardToken, netAmount);
        
        emit RewardClaimed(rewardToken, amount, protocolFee, netAmount, isAutoClaim);
    }
    
    /**
     * @dev Check if amount is above auto-claim threshold
     * For MVP, we'll use a simple token amount check
     * In production, this would integrate with price oracles
     */
    function _isAboveThreshold(address rewardToken, uint256 amount) internal pure returns (bool) {
        // For MVP: assume 1 token = $1 (would need oracle integration for real pricing)
        return amount >= AUTO_CLAIM_THRESHOLD_USD;
    }
    
    // ============ Router Management ============
    
    /**
     * @dev Set reward router (only creator, only if not frozen)
     */
    function setRewardRouter(address _rewardRouter) external onlyCreator routerNotFrozen {
        require(_rewardRouter != address(0), "Invalid router");
        address oldRouter = rewardRouter;
        rewardRouter = _rewardRouter;
        emit RewardRouterUpdated(oldRouter, _rewardRouter);
    }
    
    /**
     * @dev Permanently freeze reward router configuration
     */
    function freezeRewardRouter() external onlyCreator {
        require(!rewardRouterFrozen, "Already frozen");
        rewardRouterFrozen = true;
        emit RewardRouterFrozen();
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get vault info
     */
    function getVaultInfo() external view returns (
        address _lpToken,
        address _creator,
        uint256 _totalLPLocked,
        uint256 _createdAt,
        address _rewardRouter,
        bool _routerFrozen
    ) {
        return (
            lpToken,
            creator,
            totalLPLocked,
            createdAt,
            rewardRouter,
            rewardRouterFrozen
        );
    }
    
    /**
     * @dev Get reward info for specific token
     */
    function getRewardInfo(address rewardToken) external view returns (
        uint256 accrued,
        uint256 totalClaimed,
        bool canAutoClaim
    ) {
        uint256 accruedAmount = accruedRewards[rewardToken];
        return (
            accruedAmount,
            totalRewardsClaimed[rewardToken],
            _isAboveThreshold(rewardToken, accruedAmount)
        );
    }
    
    /**
     * @dev Calculate claim amounts (gross, fee, net)
     */
    function calculateClaimAmounts(uint256 amount) external view returns (
        uint256 grossAmount,
        uint256 protocolFee,
        uint256 netAmount
    ) {
        grossAmount = amount;
        protocolFee = (amount * protocolFeeBps) / BASIS_POINTS;
        netAmount = amount - protocolFee;
        
        return (grossAmount, protocolFee, netAmount);
    }
}