// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IKatanaRouter {
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    
    function WETH() external pure returns (address);
}

contract BondingCurve is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct TokenInfo {
        address tokenAddress;
        address creator;
        uint256 totalSupply;
        uint256 soldAmount;
        uint256 collectedETH;
        bool graduated;
        bool rewardClaimed;
        uint256 createdAt;
    }

    IKatanaRouter public immutable katanaRouter;
    address public constant PROTOCOL_ADDRESS = 0x1A4edf1D0F2a2e7dbe86479A7a95f86b87205802;
    
    uint256 public constant GRADUATION_TARGET = 108800 ether; // 108,800 RON
    uint256 public constant CREATOR_REWARD = 500 ether; // 500 RON
    uint256 public constant PROTOCOL_REWARD = 100 ether; // 100 RON
    uint256 public constant TOKENS_FOR_SALE = 800000000 * 10**18; // 80% of supply for bonding curve
    uint256 public constant TOKENS_FOR_LIQUIDITY = 200000000 * 10**18; // 20% for liquidity
    
    mapping(address => TokenInfo) public tokenInfo;
    mapping(address => uint256) public userContributions;
    address[] public allTokens;
    
    event TokenBought(
        address indexed token,
        address indexed buyer,
        uint256 ethAmount,
        uint256 tokenAmount,
        uint256 newPrice
    );
    
    event TokenSold(
        address indexed token,
        address indexed seller,
        uint256 tokenAmount,
        uint256 ethAmount,
        uint256 newPrice
    );
    
    event TokenGraduated(
        address indexed token,
        address indexed creator,
        uint256 liquidityETH,
        uint256 liquidityTokens,
        address pairAddress
    );
    
    event RewardClaimed(
        address indexed token,
        address indexed creator,
        uint256 amount
    );

    constructor(address _katanaRouter) {
        katanaRouter = IKatanaRouter(_katanaRouter);
    }

    function initializeToken(
        address tokenAddress,
        address creator,
        uint256 totalSupply
    ) external onlyOwner {
        require(tokenInfo[tokenAddress].tokenAddress == address(0), "Token already initialized");
        
        tokenInfo[tokenAddress] = TokenInfo({
            tokenAddress: tokenAddress,
            creator: creator,
            totalSupply: totalSupply,
            soldAmount: 0,
            collectedETH: 0,
            graduated: false,
            rewardClaimed: false,
            createdAt: block.timestamp
        });
        
        allTokens.push(tokenAddress);
    }

    function buyTokens(address tokenAddress) external payable nonReentrant {
        require(msg.value > 0, "Must send ETH");
        TokenInfo storage token = tokenInfo[tokenAddress];
        require(token.tokenAddress != address(0), "Token not found");
        require(!token.graduated, "Token already graduated");
        
        uint256 tokensToReceive = calculateTokensForETH(tokenAddress, msg.value);
        require(token.soldAmount + tokensToReceive <= TOKENS_FOR_SALE, "Exceeds available tokens");
        
        token.soldAmount += tokensToReceive;
        token.collectedETH += msg.value;
        userContributions[msg.sender] += msg.value;
        
        // Transfer tokens to buyer
        IERC20(tokenAddress).safeTransfer(msg.sender, tokensToReceive);
        
        emit TokenBought(
            tokenAddress,
            msg.sender,
            msg.value,
            tokensToReceive,
            getCurrentPrice(tokenAddress)
        );
        
        // Check if graduation target is reached
        if (token.collectedETH >= GRADUATION_TARGET) {
            _graduateToken(tokenAddress);
        }
    }

    function sellTokens(address tokenAddress, uint256 tokenAmount) external nonReentrant {
        require(tokenAmount > 0, "Must sell positive amount");
        TokenInfo storage token = tokenInfo[tokenAddress];
        require(token.tokenAddress != address(0), "Token not found");
        require(!token.graduated, "Token already graduated");
        
        uint256 ethToReceive = calculateETHForTokens(tokenAddress, tokenAmount);
        require(ethToReceive <= address(this).balance, "Insufficient contract balance");
        
        token.soldAmount -= tokenAmount;
        token.collectedETH -= ethToReceive;
        
        // Transfer tokens from seller
        IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), tokenAmount);
        
        // Transfer ETH to seller
        payable(msg.sender).transfer(ethToReceive);
        
        emit TokenSold(
            tokenAddress,
            msg.sender,
            tokenAmount,
            ethToReceive,
            getCurrentPrice(tokenAddress)
        );
    }

    function _graduateToken(address tokenAddress) internal {
        TokenInfo storage token = tokenInfo[tokenAddress];
        require(!token.graduated, "Already graduated");
        
        token.graduated = true;
        
        // Calculate liquidity amounts
        uint256 liquidityETH = token.collectedETH - CREATOR_REWARD - PROTOCOL_REWARD;
        uint256 liquidityTokens = TOKENS_FOR_LIQUIDITY;
        
        // Approve router to spend tokens
        IERC20(tokenAddress).approve(address(katanaRouter), liquidityTokens);
        
        // Add liquidity to Katana
        (uint256 amountToken, uint256 amountETH, uint256 liquidity) = katanaRouter.addLiquidityETH{value: liquidityETH}(
            tokenAddress,
            liquidityTokens,
            0, // Accept any amount of tokens
            0, // Accept any amount of ETH
            address(this), // LP tokens stay in contract
            block.timestamp + 300
        );
        
        // Send protocol reward
        payable(PROTOCOL_ADDRESS).transfer(PROTOCOL_REWARD);
        
        emit TokenGraduated(tokenAddress, token.creator, amountETH, amountToken, address(0));
    }

    function claimCreatorReward(address tokenAddress) external nonReentrant {
        TokenInfo storage token = tokenInfo[tokenAddress];
        require(token.creator == msg.sender, "Not token creator");
        require(token.graduated, "Token not graduated");
        require(!token.rewardClaimed, "Reward already claimed");
        
        token.rewardClaimed = true;
        payable(msg.sender).transfer(CREATOR_REWARD);
        
        emit RewardClaimed(tokenAddress, msg.sender, CREATOR_REWARD);
    }

    function calculateTokensForETH(address tokenAddress, uint256 ethAmount) public view returns (uint256) {
        TokenInfo memory token = tokenInfo[tokenAddress];
        if (token.tokenAddress == address(0)) return 0;
        
        // Simple linear bonding curve: price increases linearly with sold amount
        uint256 currentPrice = getCurrentPrice(tokenAddress);
        return (ethAmount * 10**18) / currentPrice;
    }

    function calculateETHForTokens(address tokenAddress, uint256 tokenAmount) public view returns (uint256) {
        TokenInfo memory token = tokenInfo[tokenAddress];
        if (token.tokenAddress == address(0)) return 0;
        
        uint256 currentPrice = getCurrentPrice(tokenAddress);
        return (tokenAmount * currentPrice) / 10**18;
    }

    function getCurrentPrice(address tokenAddress) public view returns (uint256) {
        TokenInfo memory token = tokenInfo[tokenAddress];
        if (token.tokenAddress == address(0)) return 0;
        
        // Linear price curve: starts at 0.0001 RON, increases to target price at graduation
        uint256 basePrice = 0.0001 ether; // Starting price
        uint256 maxPrice = GRADUATION_TARGET * 10**18 / TOKENS_FOR_SALE; // Price at graduation
        uint256 priceIncrease = ((maxPrice - basePrice) * token.soldAmount) / TOKENS_FOR_SALE;
        
        return basePrice + priceIncrease;
    }

    function getTokenProgress(address tokenAddress) external view returns (uint256 progress, uint256 target) {
        TokenInfo memory token = tokenInfo[tokenAddress];
        return (token.collectedETH, GRADUATION_TARGET);
    }

    function isGraduated(address tokenAddress) external view returns (bool) {
        return tokenInfo[tokenAddress].graduated;
    }

    function canClaimReward(address tokenAddress, address creator) external view returns (bool) {
        TokenInfo memory token = tokenInfo[tokenAddress];
        return token.creator == creator && token.graduated && !token.rewardClaimed;
    }

    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }

    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
}