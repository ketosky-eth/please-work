// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./RenouncedLPVault.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title RenouncedLPVaultFactory
 * @dev Factory contract for deploying individual LP vaults per user per LP token
 */
contract RenouncedLPVaultFactory is Ownable, ReentrancyGuard {
    
    // ============ State Variables ============
    
    address public protocolTreasury;
    address public defaultRewardRouter;
    uint256 public protocolFeeBps = 30; // 0.3%
    
    // Mapping: user => lpToken => vault address
    mapping(address => mapping(address => address)) public userVaults;
    
    // Array of all created vaults for enumeration
    address[] public allVaults;
    
    // Mapping: vault => isValid
    mapping(address => bool) public isValidVault;
    
    // ============ Events ============
    
    event VaultCreated(
        address indexed user,
        address indexed lpToken,
        address indexed vault,
        uint256 vaultIndex
    );
    
    event ProtocolTreasuryUpdated(address oldTreasury, address newTreasury);
    event DefaultRewardRouterUpdated(address oldRouter, address newRouter);
    event ProtocolFeeUpdated(uint256 oldFee, uint256 newFee);
    
    // ============ Constructor ============
    
    constructor(
        address _protocolTreasury,
        address _defaultRewardRouter
    ) {
        require(_protocolTreasury != address(0), "Invalid treasury");
        require(_defaultRewardRouter != address(0), "Invalid router");
        
        protocolTreasury = _protocolTreasury;
        defaultRewardRouter = _defaultRewardRouter;
    }
    
    // ============ Main Functions ============
    
    /**
     * @dev Create a new vault for user and LP token combination
     * @param lpToken The LP token address to create vault for
     * @return vault The address of the created vault
     */
    function createVault(address lpToken) external nonReentrant returns (address vault) {
        require(lpToken != address(0), "Invalid LP token");
        require(userVaults[msg.sender][lpToken] == address(0), "Vault already exists");
        
        // Generate salt for deterministic address
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, lpToken, block.timestamp));
        
        // Deploy new vault using CREATE2
        vault = address(new RenouncedLPVault{salt: salt}(
            lpToken,
            msg.sender,
            protocolTreasury,
            defaultRewardRouter,
            protocolFeeBps
        ));
        
        // Update mappings
        userVaults[msg.sender][lpToken] = vault;
        allVaults.push(vault);
        isValidVault[vault] = true;
        
        emit VaultCreated(msg.sender, lpToken, vault, allVaults.length - 1);
        
        return vault;
    }
    
    /**
     * @dev Get vault address for user and LP token (returns zero if doesn't exist)
     */
    function getVault(address user, address lpToken) external view returns (address) {
        return userVaults[user][lpToken];
    }
    
    /**
     * @dev Get all vaults for a specific user
     */
    function getUserVaults(address user) external view returns (address[] memory vaults, address[] memory lpTokens) {
        uint256 count = 0;
        
        // First pass: count user's vaults
        for (uint256 i = 0; i < allVaults.length; i++) {
            if (RenouncedLPVault(allVaults[i]).creator() == user) {
                count++;
            }
        }
        
        // Second pass: populate arrays
        vaults = new address[](count);
        lpTokens = new address[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allVaults.length; i++) {
            RenouncedLPVault vault = RenouncedLPVault(allVaults[i]);
            if (vault.creator() == user) {
                vaults[index] = allVaults[i];
                lpTokens[index] = vault.lpToken();
                index++;
            }
        }
        
        return (vaults, lpTokens);
    }
    
    /**
     * @dev Get total number of vaults created
     */
    function getTotalVaults() external view returns (uint256) {
        return allVaults.length;
    }
    
    /**
     * @dev Get vault at specific index
     */
    function getVaultAt(uint256 index) external view returns (address) {
        require(index < allVaults.length, "Index out of bounds");
        return allVaults[index];
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Update protocol treasury address
     */
    function setProtocolTreasury(address _protocolTreasury) external onlyOwner {
        require(_protocolTreasury != address(0), "Invalid treasury");
        address oldTreasury = protocolTreasury;
        protocolTreasury = _protocolTreasury;
        emit ProtocolTreasuryUpdated(oldTreasury, _protocolTreasury);
    }
    
    /**
     * @dev Update default reward router
     */
    function setDefaultRewardRouter(address _defaultRewardRouter) external onlyOwner {
        require(_defaultRewardRouter != address(0), "Invalid router");
        address oldRouter = defaultRewardRouter;
        defaultRewardRouter = _defaultRewardRouter;
        emit DefaultRewardRouterUpdated(oldRouter, _defaultRewardRouter);
    }
    
    /**
     * @dev Update protocol fee (max 1%)
     */
    function setProtocolFee(uint256 _protocolFeeBps) external onlyOwner {
        require(_protocolFeeBps <= 100, "Fee too high"); // Max 1%
        uint256 oldFee = protocolFeeBps;
        protocolFeeBps = _protocolFeeBps;
        emit ProtocolFeeUpdated(oldFee, _protocolFeeBps);
    }
}