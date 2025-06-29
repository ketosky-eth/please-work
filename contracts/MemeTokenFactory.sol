// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./SmartVault.sol";

interface IKatanaRouter {
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    
    function factory() external pure returns (address);
}

interface IKatanaFactory {
    function createPair(address tokenA, address tokenB) external returns (address pair);
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}

contract MemeToken is ERC20 {
    address public creator;
    string public description;
    string public logoURI;
    string public website;
    string public twitter;
    string public telegram;
    string public discord;
    
    constructor(
        string memory name,
        string memory symbol,
        string memory _description,
        string memory _logoURI,
        string memory _website,
        string memory _twitter,
        string memory _telegram,
        string memory _discord,
        address _creator
    ) ERC20(name, symbol) {
        creator = _creator;
        description = _description;
        logoURI = _logoURI;
        website = _website;
        twitter = _twitter;
        telegram = _telegram;
        discord = _discord;
        
        // Mint total supply to creator
        _mint(_creator, 1000000000 * 10**decimals()); // 1 billion tokens
    }
}

contract MemeTokenFactory is Ownable, ReentrancyGuard {
    IKatanaRouter public immutable katanaRouter;
    SmartVault public immutable smartVault;
    
    uint256 public deploymentFee = 0.5 ether; // 0.5 RON
    address public feeRecipient;
    
    struct TokenInfo {
        address tokenAddress;
        address creator;
        address pairAddress;
        uint256 createdAt;
        bool hasSmartVault;
    }
    
    mapping(address => TokenInfo) public tokenInfo;
    mapping(address => address[]) public creatorTokens;
    address[] public allTokens;
    
    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        address pairAddress,
        bool hasSmartVault
    );
    
    event LiquidityAdded(
        address indexed tokenAddress,
        address indexed pairAddress,
        uint256 tokenAmount,
        uint256 ethAmount,
        uint256 liquidity
    );

    constructor(
        address _katanaRouter,
        address _smartVault,
        address _feeRecipient
    ) {
        katanaRouter = IKatanaRouter(_katanaRouter);
        smartVault = SmartVault(_smartVault);
        feeRecipient = _feeRecipient;
    }

    function createMemeToken(
        string memory name,
        string memory symbol,
        string memory description,
        string memory logoURI,
        string memory website,
        string memory twitter,
        string memory telegram,
        string memory discord,
        bool initialBuy,
        uint256 initialBuyAmount
    ) external payable nonReentrant {
        require(msg.value >= deploymentFee, "Insufficient deployment fee");
        
        // Check if user has Smart Vault
        bool hasSmartVault = smartVault.hasMinted(msg.sender);
        
        // Create the meme token
        MemeToken token = new MemeToken(
            name,
            symbol,
            description,
            logoURI,
            website,
            twitter,
            telegram,
            discord,
            msg.sender
        );
        
        address tokenAddress = address(token);
        
        // Create pair on Katana
        IKatanaFactory factory = IKatanaFactory(katanaRouter.factory());
        address pairAddress = factory.createPair(tokenAddress, katanaRouter.WETH());
        
        // Store token info
        tokenInfo[tokenAddress] = TokenInfo({
            tokenAddress: tokenAddress,
            creator: msg.sender,
            pairAddress: pairAddress,
            createdAt: block.timestamp,
            hasSmartVault: hasSmartVault
        });
        
        creatorTokens[msg.sender].push(tokenAddress);
        allTokens.push(tokenAddress);
        
        // Handle initial liquidity
        uint256 liquidityAmount = 500000000 * 10**token.decimals(); // 50% of supply for liquidity
        
        // Transfer tokens to this contract for liquidity
        token.transferFrom(msg.sender, address(this), liquidityAmount);
        token.approve(address(katanaRouter), liquidityAmount);
        
        // Add liquidity
        uint256 ethForLiquidity = initialBuy ? msg.value - deploymentFee - initialBuyAmount : msg.value - deploymentFee;
        
        (uint256 amountToken, uint256 amountETH, uint256 liquidity) = katanaRouter.addLiquidityETH{value: ethForLiquidity}(
            tokenAddress,
            liquidityAmount,
            0, // Accept any amount of tokens
            0, // Accept any amount of ETH
            hasSmartVault ? address(smartVault) : msg.sender, // LP tokens go to Smart Vault if user has one
            block.timestamp + 300
        );
        
        // If user has Smart Vault, add LP tokens to their vault
        if (hasSmartVault) {
            uint256 userTokenId = smartVault.getUserTokenId(msg.sender);
            // The LP tokens are already sent to the Smart Vault contract
            // We need to call a function to register them in the user's vault
            // This would require additional function in SmartVault contract
        }
        
        // Handle initial buy if requested
        if (initialBuy && initialBuyAmount > 0) {
            // Implement initial buy logic here
            // This would involve swapping ETH for tokens on Katana
        }
        
        // Transfer deployment fee
        payable(feeRecipient).transfer(deploymentFee);
        
        // Refund any excess ETH
        if (address(this).balance > 0) {
            payable(msg.sender).transfer(address(this).balance);
        }
        
        emit TokenCreated(tokenAddress, msg.sender, name, symbol, pairAddress, hasSmartVault);
        emit LiquidityAdded(tokenAddress, pairAddress, amountToken, amountETH, liquidity);
    }
    
    function getCreatorTokens(address creator) external view returns (address[] memory) {
        return creatorTokens[creator];
    }
    
    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }
    
    function getTokenCount() external view returns (uint256) {
        return allTokens.length;
    }
    
    // Admin functions
    function setDeploymentFee(uint256 _newFee) external onlyOwner {
        deploymentFee = _newFee;
    }
    
    function setFeeRecipient(address _newRecipient) external onlyOwner {
        feeRecipient = _newRecipient;
    }
    
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    receive() external payable {}
}