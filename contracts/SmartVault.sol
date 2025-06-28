// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IUniswapV2Pair {
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function totalSupply() external view returns (uint256);
    function balanceOf(address owner) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
}

contract SmartVault is ERC721, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 private _tokenIdCounter = 1;
    uint256 public constant PROTOCOL_FEE = 50; // 0.5% (50 basis points)
    uint256 public constant BASIS_POINTS = 10000;
    
    address public protocolFeeRecipient;
    
    // Mapping from token ID to LP tokens held
    mapping(uint256 => address[]) public vaultLPTokens;
    mapping(uint256 => mapping(address => uint256)) public vaultLPBalances;
    mapping(uint256 => mapping(address => uint256)) public accumulatedFees;
    
    // Mapping to track if a wallet has minted
    mapping(address => bool) public hasMinted;
    mapping(address => uint256) public walletToTokenId;
    
    // Events
    event VaultMinted(address indexed owner, uint256 indexed tokenId);
    event LPTokensAdded(uint256 indexed tokenId, address indexed lpToken, uint256 amount);
    event FeesHarvested(uint256 indexed tokenId, address indexed lpToken, uint256 amount);
    event FeesWithdrawn(uint256 indexed tokenId, address indexed owner, uint256 amount);

    constructor(address _protocolFeeRecipient) ERC721("Smart Vault", "SVAULT") {
        protocolFeeRecipient = _protocolFeeRecipient;
    }

    modifier onlyVaultOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Not vault owner");
        _;
    }

    modifier onlyOncePerWallet() {
        require(!hasMinted[msg.sender], "Already minted");
        _;
    }

    function mint() external onlyOncePerWallet nonReentrant {
        uint256 tokenId = _tokenIdCounter++;
        
        hasMinted[msg.sender] = true;
        walletToTokenId[msg.sender] = tokenId;
        
        _safeMint(msg.sender, tokenId);
        
        emit VaultMinted(msg.sender, tokenId);
    }

    function addLPTokens(uint256 tokenId, address lpToken, uint256 amount) 
        external 
        onlyVaultOwner(tokenId) 
        nonReentrant 
    {
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20(lpToken).safeTransferFrom(msg.sender, address(this), amount);
        
        // Add to vault if not already present
        if (vaultLPBalances[tokenId][lpToken] == 0) {
            vaultLPTokens[tokenId].push(lpToken);
        }
        
        vaultLPBalances[tokenId][lpToken] += amount;
        
        emit LPTokensAdded(tokenId, lpToken, amount);
    }

    function harvestFees(uint256 tokenId, address lpToken) 
        external 
        onlyVaultOwner(tokenId) 
        nonReentrant 
    {
        // This would integrate with the specific DEX's fee harvesting mechanism
        // For now, this is a placeholder that would need to be implemented
        // based on the specific DEX being used (Katana on Ronin)
        
        // Placeholder logic - in reality this would call the DEX's harvest function
        uint256 harvestedAmount = _simulateHarvest(lpToken);
        
        if (harvestedAmount > 0) {
            uint256 protocolCut = (harvestedAmount * PROTOCOL_FEE) / BASIS_POINTS;
            uint256 remainingAmount = harvestedAmount - protocolCut;
            
            // 50% to LP pool (stays in contract), 50% to vault owner
            uint256 ownerShare = remainingAmount / 2;
            uint256 lpShare = remainingAmount - ownerShare;
            
            accumulatedFees[tokenId][lpToken] += ownerShare;
            
            // Transfer protocol fee
            if (protocolCut > 0) {
                // Transfer protocol fee to fee recipient
                // Implementation depends on the token being harvested
            }
            
            emit FeesHarvested(tokenId, lpToken, harvestedAmount);
        }
    }

    function withdrawFees(uint256 tokenId, address feeToken) 
        external 
        onlyVaultOwner(tokenId) 
        nonReentrant 
    {
        uint256 amount = accumulatedFees[tokenId][feeToken];
        require(amount > 0, "No fees to withdraw");
        
        accumulatedFees[tokenId][feeToken] = 0;
        
        IERC20(feeToken).safeTransfer(msg.sender, amount);
        
        emit FeesWithdrawn(tokenId, msg.sender, amount);
    }

    function getVaultLPTokens(uint256 tokenId) external view returns (address[] memory) {
        return vaultLPTokens[tokenId];
    }

    function getVaultLPBalance(uint256 tokenId, address lpToken) external view returns (uint256) {
        return vaultLPBalances[tokenId][lpToken];
    }

    function getAccumulatedFees(uint256 tokenId, address feeToken) external view returns (uint256) {
        return accumulatedFees[tokenId][feeToken];
    }

    function getUserTokenId(address user) external view returns (uint256) {
        require(hasMinted[user], "User has not minted");
        return walletToTokenId[user];
    }

    // Override transfer functions to make NFT non-transferable
    function transferFrom(address, address, uint256) public pure override {
        revert("Smart Vault NFTs are non-transferable");
    }

    function safeTransferFrom(address, address, uint256) public pure override {
        revert("Smart Vault NFTs are non-transferable");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert("Smart Vault NFTs are non-transferable");
    }

    function approve(address, uint256) public pure override {
        revert("Smart Vault NFTs are non-transferable");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("Smart Vault NFTs are non-transferable");
    }

    // Internal function to simulate fee harvesting (placeholder)
    function _simulateHarvest(address lpToken) internal view returns (uint256) {
        // This is a placeholder - real implementation would depend on DEX integration
        return 0;
    }

    // Admin functions
    function setProtocolFeeRecipient(address _newRecipient) external onlyOwner {
        protocolFeeRecipient = _newRecipient;
    }

    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
}