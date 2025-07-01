// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./BondingCurveLib.sol";

interface IUniswapV2Pair {
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function totalSupply() external view returns (uint256);
    function balanceOf(address owner) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function skim(address to) external;
}

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
}

/**
 * @title MemeToken
 * @dev ERC20 token created through SmartVaultCore
 */
contract MemeToken is ERC20 {
    address public creator;
    address public smartVaultCore;
    string public description;
    string public logoURI;
    string public website;
    string public twitter;
    string public telegram;
    string public discord;
    
    modifier onlySmartVaultCore() {
        require(msg.sender == smartVaultCore, "Only SmartVaultCore");
        _;
    }
    
    constructor(
        string memory name,
        string memory symbol,
        string memory _description,
        string memory _logoURI,
        string memory _website,
        string memory _twitter,
        string memory _telegram,
        string memory _discord,
        address _creator,
        address _smartVaultCore
    ) ERC20(name, symbol) {
        creator = _creator;
        smartVaultCore = _smartVaultCore;
        description = _description;
        logoURI = _logoURI;
        website = _website;
        twitter = _twitter;
        telegram = _telegram;
        discord = _discord;
        
        // Mint total supply to SmartVaultCore for bonding curve
        _mint(_smartVaultCore, 1000000000 * 10**decimals()); // 1 billion tokens
    }
}

/**
 * @title SmartVaultCore
 * @dev Unified upgradeable contract for meme token creation with bonding curves and Smart Vault SBT benefits
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
    
    IERC20 public ronToken;
    IERC721 public smartVaultSBT;
    IERC721 public genesisVaultShard;
    IUniswapV2Router public uniswapRouter;
    address public treasuryWallet;
    
    // Protocol fees (in basis points, 10000 = 100%)
    uint256 public constant BASE_PROTOCOL_FEE = 50; // 0.5%
    uint256 public constant NON_RENOUNCED_FEE = 65; // 0.65%
    uint256 public constant GVS_HOLDER_FEE = 25; // 0.25%
    
    // Bonding curve rewards
    uint256 public constant CREATOR_REWARD = 250 ether; // 250 RON
    uint256 public constant PROTOCOL_REWARD = 100 ether; // 100 RON
    uint256 public constant AUTO_COMPOUND_THRESHOLD = 50 ether; // 50 RON
    
    // Token tracking
    struct TokenInfo {
        address tokenAddress;
        address creator;
        uint256 totalSupply;
        bool creatorHasSmartVault;
        bool rewardClaimed;
        BondingCurveLib.BondingCurveData bondingCurve;
    }
    
    // LP tracking
    struct LPInfo {
        address creator;
        bool isRenounced;
        uint256 accumulatedFees;
        uint256 lastCompoundTime;
    }
    
    // Storage mappings
    mapping(address => TokenInfo) public tokenInfo;
    mapping(address => address[]) public creatorTokens;
    mapping(address => LPInfo) public lpInfo;
    mapping(address => address[]) public creatorLPs;
    address[] public allTokens;
    address[] public allLPs;
    
    // ============ Events ============
    
    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        bool hasSmartVault
    );
    
    event TokensBought(
        address indexed token,
        address indexed buyer,
        uint256 ronAmount,
        uint256 tokenAmount,
        uint256 newPrice
    );
    
    event TokensSold(
        address indexed token,
        address indexed seller,
        uint256 tokenAmount,
        uint256 ronAmount,
        uint256 newPrice
    );
    
    event TokenGraduated(
        address indexed token,
        address indexed creator,
        uint256 liquidityRON,
        uint256 liquidityTokens,
        address pairAddress
    );
    
    event CreatorRewardClaimed(
        address indexed token,
        address indexed creator,
        uint256 amount
    );
    
    event LPAdded(
        address indexed lpToken,
        address indexed creator,
        bool isRenounced
    );
    
    event FeesHarvested(
        address indexed lpToken,
        address indexed creator,
        uint256 totalFees,
        uint256 creatorShare,
        uint256 protocolShare
    );
    
    event FeesWithdrawn(
        address indexed lpToken,
        address indexed creator,
        uint256 amount
    );
    
    event LPRenounced(
        address indexed lpToken,
        address indexed creator
    );

    // ============ Initialization ============
    
    function initialize(
        address _ronToken,
        address _smartVaultSBT,
        address _genesisVaultShard,
        address _uniswapRouter,
        address _treasuryWallet
    ) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();
        
        ronToken = IERC20(_ronToken);
        smartVaultSBT = IERC721(_smartVaultSBT);
        genesisVaultShard = IERC721(_genesisVaultShard);
        uniswapRouter = IUniswapV2Router(_uniswapRouter);
        treasuryWallet = _treasuryWallet;
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
    ) external nonReentrant returns (address) {
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
        bool hasSmartVault = smartVaultSBT.balanceOf(msg.sender) > 0;
        
        // Initialize token info
        tokenInfo[tokenAddress] = TokenInfo({
            tokenAddress: tokenAddress,
            creator: msg.sender,
            totalSupply: token.totalSupply(),
            creatorHasSmartVault: hasSmartVault,
            rewardClaimed: false,
            bondingCurve: BondingCurveLib.BondingCurveData({
                soldAmount: 0,
                collectedRON: 0,
                graduated: false,
                createdAt: block.timestamp
            })
        });
        
        creatorTokens[msg.sender].push(tokenAddress);
        allTokens.push(tokenAddress);
        
        emit TokenCreated(tokenAddress, msg.sender, name, symbol, hasSmartVault);
        
        return tokenAddress;
    }

    // ============ Bonding Curve Trading ============
    
    function buyTokens(address tokenAddress, uint256 ronAmount) external nonReentrant {
        require(ronAmount > 0, "Must buy with RON");
        TokenInfo storage token = tokenInfo[tokenAddress];
        require(token.tokenAddress != address(0), "Token not found");
        require(!token.bondingCurve.graduated, "Token already graduated");
        
        uint256 tokensToReceive = token.bondingCurve.calculateTokensForRON(ronAmount);
        require(
            token.bondingCurve.soldAmount + tokensToReceive <= BondingCurveLib.TOKENS_FOR_SALE,
            "Exceeds available tokens"
        );
        
        // Transfer RON from buyer
        ronToken.safeTransferFrom(msg.sender, address(this), ronAmount);
        
        // Update bonding curve state
        token.bondingCurve.soldAmount += tokensToReceive;
        token.bondingCurve.collectedRON += ronAmount;
        
        // Transfer tokens to buyer
        IERC20(tokenAddress).safeTransfer(msg.sender, tokensToReceive);
        
        emit TokensBought(
            tokenAddress,
            msg.sender,
            ronAmount,
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
        
        uint256 ronToReceive = token.bondingCurve.calculateRONForTokens(tokenAmount);
        require(ronToReceive <= ronToken.balanceOf(address(this)), "Insufficient contract balance");
        
        // Transfer tokens from seller
        IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), tokenAmount);
        
        // Update bonding curve state
        token.bondingCurve.soldAmount -= tokenAmount;
        token.bondingCurve.collectedRON -= ronToReceive;
        
        // Transfer RON to seller
        ronToken.safeTransfer(msg.sender, ronToReceive);
        
        emit TokensSold(
            tokenAddress,
            msg.sender,
            tokenAmount,
            ronToReceive,
            token.bondingCurve.getCurrentPrice()
        );
    }
    
    function _graduateToken(address tokenAddress) internal {
        TokenInfo storage token = tokenInfo[tokenAddress];
        require(!token.bondingCurve.graduated, "Already graduated");
        
        token.bondingCurve.graduated = true;
        
        // Calculate liquidity amounts
        uint256 totalRewards = CREATOR_REWARD + PROTOCOL_REWARD;
        uint256 liquidityRON = token.bondingCurve.collectedRON - totalRewards;
        uint256 liquidityTokens = BondingCurveLib.TOKENS_FOR_LIQUIDITY;
        
        // Approve router to spend tokens
        IERC20(tokenAddress).approve(address(uniswapRouter), liquidityTokens);
        ronToken.approve(address(uniswapRouter), liquidityRON);
        
        // Add liquidity (assuming RON is the base token)
        (uint256 amountToken, uint256 amountRON, uint256 liquidity) = uniswapRouter.addLiquidityETH{value: 0}(
            tokenAddress,
            liquidityTokens,
            0, // Accept any amount of tokens
            0, // Accept any amount of RON
            address(this), // LP tokens stay in contract
            block.timestamp + 300
        );
        
        // Handle rewards based on Smart Vault ownership
        if (token.creatorHasSmartVault) {
            // Creator can claim reward, protocol gets standard fee
            ronToken.safeTransfer(treasuryWallet, PROTOCOL_REWARD);
        } else {
            // All rewards go to protocol
            ronToken.safeTransfer(treasuryWallet, totalRewards);
        }
        
        emit TokenGraduated(tokenAddress, token.creator, amountRON, amountToken, address(0));
    }
    
    function claimCreatorReward(address tokenAddress) external nonReentrant {
        TokenInfo storage token = tokenInfo[tokenAddress];
        require(token.creator == msg.sender, "Not token creator");
        require(token.bondingCurve.graduated, "Token not graduated");
        require(!token.rewardClaimed, "Reward already claimed");
        require(token.creatorHasSmartVault, "Must have Smart Vault to claim");
        
        token.rewardClaimed = true;
        ronToken.safeTransfer(msg.sender, CREATOR_REWARD);
        
        emit CreatorRewardClaimed(tokenAddress, msg.sender, CREATOR_REWARD);
    }

    // ============ LP Management ============
    
    function addLPPair(address lpToken, bool isRenounced) external nonReentrant {
        require(lpToken != address(0), "Invalid LP token");
        require(lpInfo[lpToken].creator == address(0), "LP already added");
        
        // Verify it's a valid UniswapV2 pair
        IUniswapV2Pair pair = IUniswapV2Pair(lpToken);
        require(pair.token0() != address(0) && pair.token1() != address(0), "Invalid pair");
        
        lpInfo[lpToken] = LPInfo({
            creator: msg.sender,
            isRenounced: isRenounced,
            accumulatedFees: 0,
            lastCompoundTime: block.timestamp
        });
        
        creatorLPs[msg.sender].push(lpToken);
        allLPs.push(lpToken);
        
        emit LPAdded(lpToken, msg.sender, isRenounced);
    }
    
    function renounceLPOwnership(address lpToken) external nonReentrant {
        LPInfo storage lp = lpInfo[lpToken];
        require(lp.creator == msg.sender, "Not LP creator");
        require(!lp.isRenounced, "Already renounced");
        
        lp.isRenounced = true;
        
        emit LPRenounced(lpToken, msg.sender);
    }
    
    function skimAndSplit(address lpToken) external nonReentrant {
        LPInfo storage lp = lpInfo[lpToken];
        require(lp.creator != address(0), "LP not found");
        
        IUniswapV2Pair pair = IUniswapV2Pair(lpToken);
        
        // Get current reserves and calculate fees
        (uint112 reserve0, uint112 reserve1,) = pair.getReserves();
        uint256 balance0 = IERC20(pair.token0()).balanceOf(lpToken);
        uint256 balance1 = IERC20(pair.token1()).balanceOf(lpToken);
        
        // Calculate excess (fees)
        uint256 excess0 = balance0 > reserve0 ? balance0 - reserve0 : 0;
        uint256 excess1 = balance1 > reserve1 ? balance1 - reserve1 : 0;
        
        if (excess0 > 0 || excess1 > 0) {
            // Skim excess to this contract
            pair.skim(address(this));
            
            // Calculate protocol fee based on LP status
            uint256 protocolFeeRate = _getProtocolFeeRate(lp.creator, lp.isRenounced);
            
            // Convert fees to RON equivalent and split
            uint256 totalFeesInRON = _convertToRON(pair.token0(), excess0) + _convertToRON(pair.token1(), excess1);
            uint256 protocolShare = (totalFeesInRON * protocolFeeRate) / 10000;
            uint256 remainingFees = totalFeesInRON - protocolShare;
            
            // Handle fee distribution based on Smart Vault ownership
            bool hasSmartVault = smartVaultSBT.balanceOf(lp.creator) > 0;
            
            if (hasSmartVault) {
                // 50% to creator (withdrawable), 50% auto-compound
                uint256 creatorShare = remainingFees / 2;
                uint256 compoundShare = remainingFees - creatorShare;
                
                lp.accumulatedFees += creatorShare;
                
                // Auto-compound the other 50%
                _autoCompound(lpToken, compoundShare);
            } else {
                // All fees go to auto-compound
                _autoCompound(lpToken, remainingFees);
                
                // Check auto-compound threshold for non-SV holders
                if (remainingFees >= AUTO_COMPOUND_THRESHOLD) {
                    _autoCompound(lpToken, remainingFees);
                }
            }
            
            // Send protocol share to treasury
            if (protocolShare > 0) {
                ronToken.safeTransfer(treasuryWallet, protocolShare);
            }
            
            emit FeesHarvested(lpToken, lp.creator, totalFeesInRON, remainingFees - (remainingFees / 2), protocolShare);
        }
    }
    
    function claimFees(address lpToken) external nonReentrant {
        LPInfo storage lp = lpInfo[lpToken];
        require(lp.creator == msg.sender, "Not LP creator");
        require(smartVaultSBT.balanceOf(msg.sender) > 0, "Must have Smart Vault");
        require(lp.accumulatedFees > 0, "No fees to claim");
        
        uint256 amount = lp.accumulatedFees;
        lp.accumulatedFees = 0;
        
        ronToken.safeTransfer(msg.sender, amount);
        
        emit FeesWithdrawn(lpToken, msg.sender, amount);
    }
    
    function _autoCompound(address lpToken, uint256 amount) internal {
        // Implementation would add liquidity back to the pair
        // This is a simplified version - actual implementation would:
        // 1. Convert RON to appropriate tokens
        // 2. Add liquidity to the pair
        // 3. Burn the received LP tokens
        
        // For now, we'll just track that compounding occurred
        lpInfo[lpToken].lastCompoundTime = block.timestamp;
    }
    
    function _getProtocolFeeRate(address creator, bool isRenounced) internal view returns (uint256) {
        // Check for Genesis Vault Shard (lowest fee)
        if (genesisVaultShard.balanceOf(creator) > 0) {
            return GVS_HOLDER_FEE;
        }
        
        // Check renouncement status
        if (isRenounced) {
            return BASE_PROTOCOL_FEE;
        } else {
            return NON_RENOUNCED_FEE;
        }
    }
    
    function _convertToRON(address token, uint256 amount) internal view returns (uint256) {
        // Simplified conversion - in practice, this would use price oracles
        // or DEX price discovery to convert token amounts to RON equivalent
        if (token == address(ronToken)) {
            return amount;
        }
        
        // For now, return 0 for non-RON tokens
        // Real implementation would use price feeds or DEX queries
        return 0;
    }

    // ============ View Functions ============
    
    function getTokenInfo(address tokenAddress) external view returns (TokenInfo memory) {
        return tokenInfo[tokenAddress];
    }
    
    function getBondingCurveProgress(address tokenAddress) external view returns (uint256 progress, uint256 target) {
        TokenInfo memory token = tokenInfo[tokenAddress];
        return (token.bondingCurve.collectedRON, BondingCurveLib.GRADUATION_TARGET);
    }
    
    function getCurrentPrice(address tokenAddress) external view returns (uint256) {
        return tokenInfo[tokenAddress].bondingCurve.getCurrentPrice();
    }
    
    function canClaimReward(address tokenAddress, address creator) external view returns (bool) {
        TokenInfo memory token = tokenInfo[tokenAddress];
        return token.creator == creator && 
               token.bondingCurve.graduated && 
               !token.rewardClaimed && 
               token.creatorHasSmartVault;
    }
    
    function getCreatorTokens(address creator) external view returns (address[] memory) {
        return creatorTokens[creator];
    }
    
    function getCreatorLPs(address creator) external view returns (address[] memory) {
        return creatorLPs[creator];
    }
    
    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }
    
    function getAllLPs() external view returns (address[] memory) {
        return allLPs;
    }
    
    function getLPInfo(address lpToken) external view returns (LPInfo memory) {
        return lpInfo[lpToken];
    }

    // ============ Admin Functions ============
    
    function setTreasuryWallet(address _treasuryWallet) external onlyOwner {
        require(_treasuryWallet != address(0), "Invalid treasury wallet");
        treasuryWallet = _treasuryWallet;
    }
    
    function setSmartVaultSBT(address _smartVaultSBT) external onlyOwner {
        require(_smartVaultSBT != address(0), "Invalid Smart Vault SBT");
        smartVaultSBT = IERC721(_smartVaultSBT);
    }
    
    function setGenesisVaultShard(address _genesisVaultShard) external onlyOwner {
        require(_genesisVaultShard != address(0), "Invalid Genesis Vault Shard");
        genesisVaultShard = IERC721(_genesisVaultShard);
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