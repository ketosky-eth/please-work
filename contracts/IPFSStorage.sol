// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract IPFSStorage is Ownable {
    struct TokenMetadata {
        string name;
        string symbol;
        string description;
        string logoIPFS;
        string website;
        string twitter;
        string telegram;
        string discord;
        address tokenAddress;
        address creator;
        uint256 createdAt;
    }
    
    mapping(address => TokenMetadata) public tokenMetadata;
    mapping(address => address[]) public creatorTokens;
    address[] public allTokensWithMetadata;
    
    event MetadataStored(
        address indexed tokenAddress,
        address indexed creator,
        string logoIPFS
    );
    
    function storeTokenMetadata(
        address tokenAddress,
        string memory name,
        string memory symbol,
        string memory description,
        string memory logoIPFS,
        string memory website,
        string memory twitter,
        string memory telegram,
        string memory discord
    ) external {
        require(tokenAddress != address(0), "Invalid token address");
        
        tokenMetadata[tokenAddress] = TokenMetadata({
            name: name,
            symbol: symbol,
            description: description,
            logoIPFS: logoIPFS,
            website: website,
            twitter: twitter,
            telegram: telegram,
            discord: discord,
            tokenAddress: tokenAddress,
            creator: msg.sender,
            createdAt: block.timestamp
        });
        
        creatorTokens[msg.sender].push(tokenAddress);
        allTokensWithMetadata.push(tokenAddress);
        
        emit MetadataStored(tokenAddress, msg.sender, logoIPFS);
    }
    
    function getTokenMetadata(address tokenAddress) 
        external 
        view 
        returns (TokenMetadata memory) 
    {
        return tokenMetadata[tokenAddress];
    }
    
    function getCreatorTokens(address creator) 
        external 
        view 
        returns (address[] memory) 
    {
        return creatorTokens[creator];
    }
    
    function getAllTokensWithMetadata() 
        external 
        view 
        returns (address[] memory) 
    {
        return allTokensWithMetadata;
    }
}