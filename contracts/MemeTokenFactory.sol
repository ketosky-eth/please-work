// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./SmartVault.sol";
import "./BondingCurve.sol";
import "./IPFSStorage.sol";

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
        
        // Mint total supply to this contract for bonding curve
        _mint(address(this), 1000000000 * 10**decimals()); // 1 billion tokens
    }
    
    function transfer(address to, uint256 amount) public override returns (bool) {
        // Allow transfers from bonding curve contract
        return super.transfer(to, amount);
    }
    
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        // Allow transfers from bonding curve contract
        return super.transferFrom(from, to, amount);
    }
}

contract MemeTokenFactory is Ownable, ReentrancyGuard {
    SmartVault public immutable smartVault;
    BondingCurve public immutable bondingCurve;
    IPFSStorage public immutable ipfsStorage;
    
    uint256 public deploymentFee = 0.5 ether; // 0.5 RON
    uint256 public freeDeploymentFee = 0 ether; // Free for Smart Vault holders
    address public constant PROTOCOL_ADDRESS = 0x1A4edf1D0F2a2e7dbe86479A7a95f86b87205802;
    
    struct TokenInfo {
        address tokenAddress;
        address creator;
        uint256 createdAt;
        bool hasSmartVault;
        bool usedFreeDeployment;
    }
    
    mapping(address => TokenInfo) public tokenInfo;
    mapping(address => address[]) public creatorTokens;
    mapping(address => bool) public hasUsedFreeDeployment;
    address[] public allTokens;
    
    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        bool hasSmartVault,
        bool usedFreeDeployment
    );

    constructor(
        address _smartVault,
        address _bondingCurve,
        address _ipfsStorage
    ) {
        smartVault = SmartVault(_smartVault);
        bondingCurve = BondingCurve(_bondingCurve);
        ipfsStorage = IPFSStorage(_ipfsStorage);
    }

    function createMemeToken(
        string memory name,
        string memory symbol,
        string memory description,
        string memory logoURI,
        string memory website,
        string memory twitter,
        string memory telegram,
        string memory discord
    ) external payable nonReentrant {
        bool hasSmartVaultNFT = smartVault.hasMinted(msg.sender);
        bool canUseFree = hasSmartVaultNFT && !hasUsedFreeDeployment[msg.sender];
        
        uint256 requiredFee = canUseFree ? freeDeploymentFee : deploymentFee;
        require(msg.value >= requiredFee, "Insufficient deployment fee");
        
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
        
        // Initialize bonding curve
        bondingCurve.initializeToken(tokenAddress, msg.sender, token.totalSupply());
        
        // Transfer tokens to bonding curve
        token.transfer(address(bondingCurve), token.totalSupply());
        
        // Store metadata in IPFS storage
        ipfsStorage.storeTokenMetadata(
            tokenAddress,
            name,
            symbol,
            description,
            logoURI,
            website,
            twitter,
            telegram,
            discord
        );
        
        // Store token info
        tokenInfo[tokenAddress] = TokenInfo({
            tokenAddress: tokenAddress,
            creator: msg.sender,
            createdAt: block.timestamp,
            hasSmartVault: hasSmartVaultNFT,
            usedFreeDeployment: canUseFree
        });
        
        creatorTokens[msg.sender].push(tokenAddress);
        allTokens.push(tokenAddress);
        
        // Mark free deployment as used
        if (canUseFree) {
            hasUsedFreeDeployment[msg.sender] = true;
        }
        
        // Transfer deployment fee to protocol
        if (msg.value > 0) {
            payable(PROTOCOL_ADDRESS).transfer(msg.value);
        }
        
        emit TokenCreated(tokenAddress, msg.sender, name, symbol, hasSmartVaultNFT, canUseFree);
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
    
    function canUseFreeDeployment(address user) external view returns (bool) {
        return smartVault.hasMinted(user) && !hasUsedFreeDeployment[user];
    }
    
    // Admin functions
    function setDeploymentFee(uint256 _newFee) external onlyOwner {
        deploymentFee = _newFee;
    }
    
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    receive() external payable {}
}