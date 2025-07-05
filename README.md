# VYTO Protocol - Meme Token Factory 🚀

A revolutionary multi-chain meme token launchpad featuring bonding curves, automatic liquidity provision, and LP fee harvesting. Built for Ronin and Base networks.

## Features

### 🎯 Core Features
- **Multi-Chain Support**: Deploy on Ronin and Base networks
- **Bonding Curve Launches**: Fair launch mechanism with automatic price discovery
- **No Gatekeeping**: Anyone can launch tokens instantly with minimal fees
- **Automatic Liquidity**: Tokens graduate to major DEXs when targets are reached
- **LP Fee Harvesting**: Creators earn 50% of trading fees automatically
- **Rug Pull Prevention**: LP tokens are automatically burned

### 💎 Network Configurations

#### Ronin Network
- **Launch Cost**: 0.5 RON
- **Graduation Target**: 69,420 RON
- **Starting Price**: 0.0001 RON
- **DEX**: Katana
- **Protocol Reward**: 250 RON

#### Base Network
- **Launch Cost**: 0.0001 ETH
- **Graduation Target**: 24 ETH
- **Starting Price**: 0.00000001 ETH
- **DEX**: Uniswap V2
- **Protocol Reward**: 0.05 ETH

### 📈 Tokenomics
- **Total Supply**: 1,000,000,000 tokens
- **Bonding Curve**: 80% (800M tokens)
- **Liquidity**: 20% (200M tokens)
- **Protocol Fee**: 0.5% on all trades
- **LP Fee Split**: 50% to creator, 50% auto-compound

## Quick Start

### Prerequisites
- Node.js 18+
- MetaMask or compatible wallet
- RON tokens (Ronin) or ETH (Base) for gas fees

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

2. **Deploy to Saigon Testnet**
```bash
npm run deploy:ronin
```

3. **Deploy to Base Sepolia**
```bash
npm run deploy:base
```

4. **Verify contracts**
```bash
npm run verify:ronin <contract-address>
npm run verify:base <contract-address>
```

## Contract Architecture

### Core Contracts

#### SmartVaultCore.sol
- Multi-chain meme token factory
- Bonding curve implementation
- LP fee management
- Automatic liquidity provision
- Upgradeable proxy pattern

#### MemeToken.sol
- ERC20 token with metadata
- Social links integration
- Creator ownership tracking
- Trading controls

#### BondingCurveLib.sol
- Linear bonding curve mathematics
- Multi-chain configuration
- Price calculation utilities
- Graduation logic

### Contract Addresses

Update these after deployment:

**Saigon Testnet:**
- SmartVaultCore: `TBD`
- Katana Router: `0x7D02c116b98d0965ba7B642ace0183ad8b8D2196`

**Base Sepolia:**
- SmartVaultCore: `TBD`
- Uniswap V2 Router: `0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24`

## Usage Guide

### For Token Creators

1. **Connect Wallet**
   - Support for Ronin and Base networks
   - MetaMask, WalletConnect, and other wallets

2. **Launch Your Token**
   - Fill in token details and upload logo
   - Pay minimal launch fee (0.5 RON or 0.0001 ETH)
   - Token immediately available for trading

3. **Monitor Progress**
   - Track bonding curve progress
   - Monitor trading volume and holders
   - Claim LP fees when available

### For Traders

1. **Discover Tokens**
   - Browse all tokens across networks
   - Filter by new, trending, or graduating
   - Check bonding curve progress

2. **Trade on Bonding Curve**
   - Buy tokens directly from the curve
   - Sell back to the curve anytime
   - Prices increase with demand

3. **Trade on DEX**
   - Graduated tokens trade on major DEXs
   - Full liquidity and advanced trading features

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Blockchain**: Solidity, Hardhat, OpenZeppelin
- **Web3**: Wagmi, RainbowKit, Viem
- **Storage**: IPFS (Pinata)
- **Networks**: Saigon Testnet, Base Sepolia

## Configuration

### Environment Variables

```env
# Contract Addresses (auto-generated after deployment)
VITE_RONIN_SMART_VAULT_CORE=0x...
VITE_BASE_SMART_VAULT_CORE=0x...

# IPFS Configuration
VITE_PINATA_API_KEY=your_api_key
VITE_PINATA_SECRET_KEY=your_secret_key

# Deployment
PRIVATE_KEY=your_private_key
BASESCAN_API_KEY=your_basescan_api_key
```

### Network Configuration

The app supports multiple networks:
- **Saigon Testnet**: Chain ID 2021
- **Base Sepolia**: Chain ID 84532

## Security Features

- **Upgradeable Contracts**: UUPS proxy pattern for future improvements
- **Reentrancy Protection**: All state-changing functions protected
- **Access Controls**: Proper ownership and permission management
- **LP Token Burning**: Prevents rug pulls automatically
- **Fee Validation**: Built-in protections for fee calculations

## Roadmap

### Phase 1 (Q1 2025) - Current
- ✅ Multi-chain smart contracts
- ✅ Bonding curve implementation
- ✅ Frontend development
- 🔄 Testnet deployment
- 🔄 Community building

### Phase 2 (Q2 2025)
- 📋 NFT collections integration
- 📋 Advanced analytics
- 📋 Mobile app
- 📋 Mainnet launch

### Phase 3 (Q3 2025)
- 📋 Additional chain support
- 📋 DEX partnerships
- 📋 Institutional features

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
- Join our Discord: https://discord.gg/AQdEfUaV8x
- Follow us on X: https://twitter.com/vyto_xyz

---

**Built with ❤️ for the meme token revolution**