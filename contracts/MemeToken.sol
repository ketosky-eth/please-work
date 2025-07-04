// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MemeToken
 * @dev ERC20 token with metadata for meme tokens created through MemeTokenFactory
 */
contract MemeToken is ERC20, Ownable {
    // Token metadata
    string public description;
    string public logoURI;
    string public website;
    string public twitter;
    string public telegram;
    string public discord;
    
    // Token info
    address public creator;
    address public factory;
    uint256 public launchTime;
    uint256 public chainId;
    
    // Trading state
    bool public tradingEnabled;
    
    event TradingEnabled();
    event MetadataUpdated();
    
    modifier onlyFactory() {
        require(msg.sender == factory, "Only factory can call");
        _;
    }
    
    modifier onlyCreatorOrFactory() {
        require(msg.sender == creator || msg.sender == factory, "Only creator or factory");
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
        address _factory
    ) ERC20(name, symbol) Ownable(_factory) {
        description = _description;
        logoURI = _logoURI;
        website = _website;
        twitter = _twitter;
        telegram = _telegram;
        discord = _discord;
        creator = _creator;
        factory = _factory;
        launchTime = block.timestamp;
        chainId = block.chainid;
        tradingEnabled = false;
        
        // Mint total supply to factory for bonding curve management
        _mint(_factory, 1000000000 * 10**decimals()); // 1 billion tokens
    }
    
    /**
     * @dev Enable trading (called by factory when bonding curve starts)
     */
    function enableTrading() external onlyFactory {
        tradingEnabled = true;
        emit TradingEnabled();
    }
    
    /**
     * @dev Update token metadata (only creator can update)
     */
    function updateMetadata(
        string memory _description,
        string memory _logoURI,
        string memory _website,
        string memory _twitter,
        string memory _telegram,
        string memory _discord
    ) external {
        require(msg.sender == creator, "Only creator can update metadata");
        
        description = _description;
        logoURI = _logoURI;
        website = _website;
        twitter = _twitter;
        telegram = _telegram;
        discord = _discord;
        
        emit MetadataUpdated();
    }
    
    /**
     * @dev Get all token metadata
     */
    function getMetadata() external view returns (
        string memory _name,
        string memory _symbol,
        string memory _description,
        string memory _logoURI,
        string memory _website,
        string memory _twitter,
        string memory _telegram,
        string memory _discord,
        address _creator,
        uint256 _launchTime,
        uint256 _chainId
    ) {
        return (
            name(),
            symbol(),
            description,
            logoURI,
            website,
            twitter,
            telegram,
            discord,
            creator,
            launchTime,
            chainId
        );
    }
    
    /**
     * @dev Override transfer to check trading status
     */
    function _update(address from, address to, uint256 value) internal override {
        // Allow minting (from == address(0)) and factory transfers
        if (from != address(0) && from != factory && to != factory) {
            require(tradingEnabled, "Trading not enabled yet");
        }
        super._update(from, to, value);
    }
}