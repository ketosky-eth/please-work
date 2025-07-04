// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./BondingCurveLib.sol";
import "./MemeToken.sol";

interface IUniswapV2Router {
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    
    function WETH() external pure returns (address);
    function factory() external pure returns (address);
}

interface IUniswapV2Factory {
    function createPair(address tokenA, address tokenB) external returns (address pair);
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}

interface IUniswapV2Pair {
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function totalSupply() external view returns (uint256);
    function balanceOf(address owner) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function skim(address to) external;
}

/**
 * @title SmartVaultCore
 * @dev Multi-chain meme token factory with bonding curves and LP management
 */
contract SmartVaultCore is 
    Initializable, 
    UUPSUpgradeable, 
    OwnableUpgradeable, 
    ReentrancyGuardUpgradeable 
{
    using SafeERC20 for IERC20;
    using BondingCurveLib for BondingCurveLib.BondingCurveData;

    // ============ State Variables ============
    
    IUniswapV2Router public dexRouter;
    address public treasuryWallet;
    uint256 public chainId;
    
    // Token tracking
    struct TokenInfo {
        address tokenAddress;
        address creator;
        uint256 totalSupply;
        bool graduated;
        uint256 lpTokenBalance; // LP tokens held for creator
        uint256 accumulatedFees; // Claimable fees for creator
        uint256 lastFeeProcessTime;
        BondingCurveLib.BondingCurveData bondingCurve;
    }
    
    // Storage mappings
    mapping(address => TokenInfo) public tokenInfo;
    mapping(address => address[]) public creatorTokens;
    mapping(address => uint256) public lpFeeBalances; // LP pair => accumulated fees
    address[] public allTokens;
    
    // ============ Events ============
    
    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint256 launchCost
    );
    
    event TokensBought(
        address indexed token,
        address indexed buyer,
        uint256 nativeAmount,
        uint256 tokenAmount,
        uint256 newPrice
    );
    
    event TokensSold(
        address indexed token,
        address indexed seller,
        uint256 tokenAmount,
        uint256 nativeAmount,
        uint256 newPrice
    );
    
    event TokenGraduated(
        address indexed token,
        address indexed creator,
        uint256 liquidityNative,
        uint256 liquidityTokens,
        address pairAddress
    );
    
    event FeesProcessed(
        address indexed lpPair,
        address indexed creator,
        uint256 totalFees,
        uint256 creatorShare,
        uint256 protocolShare,
        uint256 autoCompounded
    );
    
    event FeesWithdrawn(
        address indexed creator,
        address indexed token,
        uint256 amount
    );

    // ============ Initialization ============
    
    function initialize(
        address _dexRouter,
        address _treasuryWallet
    ) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();
        
        dexRouter = IUniswapV2Router(_dexRouter);
        treasuryWallet = _treasuryWallet;
        chainId = block.chainid;
    }
    
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    // ============ Token Creation ============
    
    function createMemeToken(
        string memory name,
        string memory symbol,
        string memory description,
        string memory logoURI,
        string memory website,
        string memory twitter,
        string memory telegram,
        string memory discord
    ) external payable nonReentrant returns (address) {
        BondingCurveLib.NetworkConfig memory config = BondingCurveLib.getNetworkConfig(chainId);
        require(msg.value >= config.launchCost, "Insufficient launch fee");
        
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
            msg.sender,
            address(this)
        );
        
        address tokenAddress = address(token);
        
        // Initialize token info
        tokenInfo[tokenAddress] = TokenInfo({
            tokenAddress: tokenAddress,
            creator: msg.sender,
            totalSupply: token.totalSupply(),
            graduated: false,
            lpTokenBalance: 0,
            accumulatedFees: 0,
            lastFeeProcessTime: block.timestamp,
            bondingCurve: BondingCurveLib.BondingCurveData({
                soldAmount: 0,
                collectedNative: 0,
                graduated: false,
                createdAt: block.timestamp,
                chainId: chainId
            })
        });
        
        creatorTokens[msg.sender].push(tokenAddress);
        allTokens.push(tokenAddress);
        
        // Enable trading
        token.enableTrading();
        
        // Send launch fee to treasury
        payable(treasuryWallet).transfer(config.launchCost);
        
        // Refund excess
        if (msg.value > config.launchCost) {
            payable(msg.sender).transfer(msg.value - config.launchCost);
        }
        
        emit TokenCreated(tokenAddress, msg.sender, name, symbol, config.launchCost);
        
        return tokenAddress;
    }

    // ============ Bonding Curve Trading ============
    
    function buyTokens(address tokenAddress) external payable nonReentrant {
        require(msg.value > 0, "Must send native tokens");
        TokenInfo storage token = tokenInfo[tokenAddress];
        require(token.tokenAddress != address(0), "Token not found");
        require(!token.bondingCurve.graduated, "Token already graduated");
        
        // Calculate protocol fee
        uint256 protocolFee = BondingCurveLib.calculateProtocolFee(msg.value);
        uint256 buyAmount = msg.value - protocolFee;
        
        uint256 tokensToReceive = token.bondingCurve.calculateTokensForNative(buyAmount);
        require(
            token.bondingCurve.soldAmount + tokensToReceive <= BondingCurveLib.TOKENS_FOR_SALE,
            "Exceeds available tokens"
        );
        
        // Update bonding curve state
        token.bondingCurve.soldAmount += tokensToReceive;
        token.bondingCurve.collectedNative += buyAmount;
        
        // Transfer tokens to buyer
        IERC20(tokenAddress).safeTransfer(msg.sender, tokensToReceive);
        
        // Send protocol fee to treasury
        if (protocolFee > 0) {
            payable(treasuryWallet).transfer(protocolFee);
        }
        
        emit TokensBought(
            tokenAddress,
            msg.sender,
            buyAmount,
            tokensToReceive,
            token.bondingCurve.getCurrentPrice()
        );
        
        // Check for graduation
        if (token.bondingCurve.hasGraduated()) {
            _graduateToken(tokenAddress);
        }
    }
    
    function sellTokens(address tokenAddress, uint256 tokenAmount) external nonReentrant {
        require(tokenAmount > 0, "Must sell positive amount");
        TokenInfo storage token = tokenInfo[tokenAddress];
        require(token.tokenAddress != address(0), "Token not found");
        require(!token.bondingCurve.graduated, "Token already graduated");
        
        uint256 nativeToReceive = token.bondingCurve.calculateNativeForTokens(tokenAmount);
        require(nativeToReceive <= address(this).balance, "Insufficient contract balance");
        
        // Calculate protocol fee
        uint256 protocolFee = BondingCurveLib.calculateProtocolFee(nativeToReceive);
        uint256 sellAmount = nativeToReceive - protocolFee;
        
        // Transfer tokens from seller
        IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), tokenAmount);
        
        // Update bonding curve state
        token.bondingCurve.soldAmount -= tokenAmount;
        token.bondingCurve.collectedNative -= nativeToReceive;
        
        // Transfer native tokens to seller
        payable(msg.sender).transfer(sellAmount);
        
        // Send protocol fee to treasury
        if (protocolFee > 0) {
            payable(treasuryWallet).transfer(protocolFee);
        }
        
        emit TokensSold(
            tokenAddress,
            msg.sender,
            tokenAmount,
            sellAmount,
            token.bondingCurve.getCurrentPrice()
        );
    }
    
    function _graduateToken(address tokenAddress) internal {
        TokenInfo storage token = tokenInfo[tokenAddress];
        require(!token.bondingCurve.graduated, "Already graduated");
        
        token.bondingCurve.graduated = true;
        token.graduated = true;
        
        BondingCurveLib.NetworkConfig memory config = BondingCurveLib.getNetworkConfig(chainId);
        
        // Calculate amounts for liquidity
        uint256 protocolReward = config.protocolReward;
        uint256 liquidityNative = token.bondingCurve.collectedNative - protocolReward;
        uint256 liquidityTokens = BondingCurveLib.TOKENS_FOR_LIQUIDITY;
        
        // Approve router to spend tokens
        IERC20(tokenAddress).approve(address(dexRouter), liquidityTokens);
        
        // Add liquidity
        (uint256 amountToken, uint256 amountNative, uint256 liquidity) = dexRouter.addLiquidityETH{value: liquidityNative}(
            tokenAddress,
            liquidityTokens,
            0, // Accept any amount of tokens
            0, // Accept any amount of native
            address(this), // LP tokens stay in contract
            block.timestamp + 300
        );
        
        // Store LP tokens for creator
        token.lpTokenBalance = liquidity;
        
        // Send protocol reward to treasury
        payable(treasuryWallet).transfer(protocolReward);
        
        // Get pair address for fee tracking
        address weth = dexRouter.WETH();
        address factory = dexRouter.factory();
        address pair = IUniswapV2Factory(factory).getPair(tokenAddress, weth);
        
        emit TokenGraduated(tokenAddress, token.creator, amountNative, amountToken, pair);
    }

    // ============ LP Fee Management ============
    
    function processLPFees(address tokenAddress) external nonReentrant {
        TokenInfo storage token = tokenInfo[tokenAddress];
        require(token.graduated, "Token not graduated");
        
        // Get pair address
        address weth = dexRouter.WETH();
        address factory = dexRouter.factory();
        address pair = IUniswapV2Factory(factory).getPair(tokenAddress, weth);
        require(pair != address(0), "Pair not found");
        
        IUniswapV2Pair pairContract = IUniswapV2Pair(pair);
        
        // Get current reserves and balances to calculate fees
        (uint112 reserve0, uint112 reserve1,) = pairContract.getReserves();
        uint256 balance0 = IERC20(pairContract.token0()).balanceOf(pair);
        uint256 balance1 = IERC20(pairContract.token1()).balanceOf(pair);
        
        // Calculate excess (fees) - simplified calculation
        uint256 totalFees = 0;
        if (balance0 > reserve0) totalFees += balance0 - reserve0;
        if (balance1 > reserve1) totalFees += balance1 - reserve1;
        
        require(totalFees > 0, "No fees to process");
        
        // Check if auto-processing threshold is met or allow manual trigger
        bool shouldAuto = BondingCurveLib.shouldAutoProcessFees(totalFees, chainId);
        require(shouldAuto || msg.sender == token.creator, "Fees below threshold");
        
        // Skim fees to this contract
        pairContract.skim(address(this));
        
        // Calculate fee distribution
        uint256 protocolCut = (totalFees * BondingCurveLib.LP_FEE_PROTOCOL_CUT_BPS) / 10000;
        uint256 remainingFees = totalFees - protocolCut;
        uint256 creatorShare = remainingFees / 2; // 50% to creator
        uint256 autoCompoundShare = remainingFees - creatorShare; // 50% auto-compound
        
        // Add to creator's claimable fees
        token.accumulatedFees += creatorShare;
        token.lastFeeProcessTime = block.timestamp;
        
        // Send protocol cut to treasury
        if (protocolCut > 0) {
            payable(treasuryWallet).transfer(protocolCut);
        }
        
        // Auto-compound by burning LP tokens (simplified - would need more complex logic)
        // For now, we'll just track that it happened
        
        emit FeesProcessed(pair, token.creator, totalFees, creatorShare, protocolCut, autoCompoundShare);
    }
    
    function claimFees(address tokenAddress) external nonReentrant {
        TokenInfo storage token = tokenInfo[tokenAddress];
        require(token.creator == msg.sender, "Not token creator");
        require(token.accumulatedFees > 0, "No fees to claim");
        
        uint256 amount = token.accumulatedFees;
        token.accumulatedFees = 0;
        
        payable(msg.sender).transfer(amount);
        
        emit FeesWithdrawn(msg.sender, tokenAddress, amount);
    }

    // ============ View Functions ============
    
    function getTokenInfo(address tokenAddress) external view returns (TokenInfo memory) {
        return tokenInfo[tokenAddress];
    }
    
    function getBondingCurveProgress(address tokenAddress) external view returns (uint256 progress, uint256 target) {
        TokenInfo memory token = tokenInfo[tokenAddress];
        BondingCurveLib.NetworkConfig memory config = BondingCurveLib.getNetworkConfig(chainId);
        return (token.bondingCurve.collectedNative, config.graduationTarget);
    }
    
    function getCurrentPrice(address tokenAddress) external view returns (uint256) {
        return tokenInfo[tokenAddress].bondingCurve.getCurrentPrice();
    }
    
    function getCreatorTokens(address creator) external view returns (address[] memory) {
        return creatorTokens[creator];
    }
    
    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }
    
    function getNetworkConfig() external view returns (BondingCurveLib.NetworkConfig memory) {
        return BondingCurveLib.getNetworkConfig(chainId);
    }
    
    function getLaunchCost() external view returns (uint256) {
        BondingCurveLib.NetworkConfig memory config = BondingCurveLib.getNetworkConfig(chainId);
        return config.launchCost;
    }

    // ============ Admin Functions ============
    
    function setTreasuryWallet(address _treasuryWallet) external onlyOwner {
        require(_treasuryWallet != address(0), "Invalid treasury wallet");
        treasuryWallet = _treasuryWallet;
    }
    
    function setDexRouter(address _dexRouter) external onlyOwner {
        require(_dexRouter != address(0), "Invalid DEX router");
        dexRouter = IUniswapV2Router(_dexRouter);
    }
    
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
    }
    
    // ============ Receive Function ============
    
    receive() external payable {}
}