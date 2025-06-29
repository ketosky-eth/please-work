import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    roninTestnet: {
      url: "https://site1.moralis-nodes.com/ronin-testnet/22d6b97153ed4427b60914f349b2336c",
      chainId: 2021,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      roninTestnet: "no-api-key-needed"
    },
    customChains: [
      {
        network: "roninTestnet",
        chainId: 2021,
        urls: {
          apiURL: "https://sourcify.roninchain.com/server/verify",
          browserURL: "https://saigon-explorer.roninchain.com"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

export default config;