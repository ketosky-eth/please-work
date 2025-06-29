# VYTO Protocol 🚀

A revolutionary meme token launchpad on the Ronin Network featuring bonding curves, Smart Vault NFTs, and automated liquidity management.

## Features

### 🎯 Core Features
- **Bonding Curve Token Launches**: Fair launch mechanism with automatic price discovery
- **Smart Vault NFTs**: Exclusive NFTs that provide LP token management and fee harvesting
- **IPFS Integration**: Decentralized metadata storage for tokens and NFTs
- **Automated Liquidity**: Tokens graduate to Katana DEX when bonding curve target is reached
- **Creator Rewards**: 500 RON reward for successful token graduations

### 💎 Smart Vault Benefits
- **Free Token Creation**: First token launch is completely free for Smart Vault holders
- **LP Token Management**: Automatically receive and manage LP tokens
- **Fee Harvesting**: Earn trading fees from your token pairs
- **Non-Transferable**: Permanently linked to your wallet for security

### 📈 Bonding Curve Mechanics
- **Graduation Target**: 108,800 RON raised
- **Token Distribution**: 80% for bonding curve, 20% for liquidity
- **Creator Reward**: 500 RON upon graduation
- **Protocol Fee**: 100 RON to protocol treasury

## Quick Start

### Prerequisites
- Node.js 18+
- MetaMask or compatible wallet
- RON tokens for gas fees

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd vyto-protocol
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development server**
```bash
npm run dev
```

### Deployment

1. **Compile contracts**
```bash
npm run compile
```

2. **Deploy to Ronin Testnet**
```bash
npm run deploy
```

3. **Verify contracts**
```bash
npm run verify <contract-address>
```

## Contract Architecture

### Core Contracts

#### SmartVault.sol
- ERC721 NFT contract for vault management
- One mint per wallet restriction
- LP token storage and fee harvesting
- $5 USD mint price (dynamic RON pricing)

#### MemeTokenFactory.sol
- Token creation and deployment
- Integration with bonding curve
- Free deployment for Smart Vault holders
- IPFS metadata storage

#### BondingCurve.sol
- Linear bonding curve implementation
- Automatic graduation to Katana DEX
- Creator and protocol reward distribution
- Buy/sell functionality

#### IPFSStorage.sol
- Decentralized metadata storage
- Token information management
- Creator tracking

### Contract Addresses (Ronin Testnet)

Update these after deployment:
- SmartVault: `TBD`
- MemeTokenFactory: `TBD`
- BondingCurve: `TBD`
- IPFSStorage: `TBD`

## Usage Guide

### For Token Creators

1. **Mint Smart Vault NFT** (Optional but recommended)
   - Visit the NFT Mint page
   - Pay 5 RON (≈$5 USD)
   - Unlock free token creation and LP management

2. **Launch Your Token**
   - Go to Launch Meme page
   - Fill in token details and upload logo
   - Deploy for 0.5 RON (FREE with Smart Vault)
   - Your token starts on the bonding curve

3. **Monitor Progress**
   - Track your token in My Vault
   - Watch bonding curve progress
   - Claim 500 RON reward when graduated

### For Traders

1. **Discover Tokens**
   - Browse tokens on the home page
   - Filter by new, trending, or graduating
   - Check bonding curve progress

2. **Trade on Bonding Curve**
   - Buy tokens directly from the curve
   - Sell back to the curve anytime
   - Prices increase with demand

3. **Trade on DEX**
   - Graduated tokens trade on Katana DEX
   - Full liquidity and advanced trading features

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Blockchain**: Solidity, Hardhat
- **Web3**: Wagmi, RainbowKit, Viem
- **Storage**: IPFS (Pinata)
- **Network**: Ronin Testnet

## Configuration

### Environment Variables

```env
# Contract Addresses (auto-generated after deployment)
VITE_SMART_VAULT_ADDRESS=0x...
VITE_IPFS_STORAGE_ADDRESS=0x...
VITE_BONDING_CURVE_ADDRESS=0x...
VITE_MEME_TOKEN_FACTORY_ADDRESS=0x...

# IPFS Configuration
VITE_PINATA_API_KEY=your_api_key
VITE_PINATA_SECRET_KEY=your_secret_key

# Deployment
PRIVATE_KEY=your_private_key
```

### Network Configuration

The app is configured for Ronin Testnet:
- Chain ID: 2021
- RPC URL: Moralis Ronin Testnet endpoint
- Explorer: Saigon Explorer

## Security Features

- **Non-transferable NFTs**: Smart Vaults are permanently linked to wallets
- **Reentrancy Protection**: All state-changing functions protected
- **Access Controls**: Proper ownership and permission management
- **Slippage Protection**: Built-in protections for trading

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Follow us on Twitter

---

**Built with ❤️ by Ketosky.ron for the Ronin ecosystem**