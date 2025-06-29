import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Deploying VYTO Protocol to Ronin Testnet...");
  console.log("=====================================");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "RON");

  // Deploy Smart Vault first
  console.log("\n📦 Deploying SmartVault...");
  const SmartVault = await ethers.getContractFactory("SmartVault");
  const smartVault = await SmartVault.deploy();
  await smartVault.waitForDeployment();
  const smartVaultAddress = await smartVault.getAddress();
  console.log("✅ SmartVault deployed to:", smartVaultAddress);

  // Deploy IPFS Storage
  console.log("\n📦 Deploying IPFSStorage...");
  const IPFSStorage = await ethers.getContractFactory("IPFSStorage");
  const ipfsStorage = await IPFSStorage.deploy();
  await ipfsStorage.waitForDeployment();
  const ipfsStorageAddress = await ipfsStorage.getAddress();
  console.log("✅ IPFSStorage deployed to:", ipfsStorageAddress);

  // Deploy Bonding Curve
  console.log("\n📦 Deploying BondingCurve...");
  const BondingCurve = await ethers.getContractFactory("BondingCurve");
  const katanaRouter = "0x7D02c116b98d0965ba7B642ace0183ad8b8D2196"; // Katana Router on Ronin Testnet
  const bondingCurve = await BondingCurve.deploy(katanaRouter);
  await bondingCurve.waitForDeployment();
  const bondingCurveAddress = await bondingCurve.getAddress();
  console.log("✅ BondingCurve deployed to:", bondingCurveAddress);

  // Deploy Meme Token Factory
  console.log("\n📦 Deploying MemeTokenFactory...");
  const MemeTokenFactory = await ethers.getContractFactory("MemeTokenFactory");
  const memeTokenFactory = await MemeTokenFactory.deploy(
    smartVaultAddress,
    bondingCurveAddress,
    ipfsStorageAddress
  );
  await memeTokenFactory.waitForDeployment();
  const memeTokenFactoryAddress = await memeTokenFactory.getAddress();
  console.log("✅ MemeTokenFactory deployed to:", memeTokenFactoryAddress);

  // Set the factory as owner of bonding curve
  console.log("\n🔧 Transferring BondingCurve ownership to MemeTokenFactory...");
  await bondingCurve.transferOwnership(memeTokenFactoryAddress);
  console.log("✅ BondingCurve ownership transferred");

  // Create deployment info
  const deploymentInfo = {
    network: "Ronin Testnet",
    chainId: 2021,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    contracts: {
      smartVault: smartVaultAddress,
      ipfsStorage: ipfsStorageAddress,
      bondingCurve: bondingCurveAddress,
      memeTokenFactory: memeTokenFactoryAddress
    },
    config: {
      protocolAddress: "0x1A4edf1D0F2a2e7dbe86479A7a95f86b87205802",
      graduationTarget: "108800 RON",
      creatorReward: "500 RON",
      protocolReward: "100 RON",
      katanaRouter: katanaRouter
    }
  };

  // Save deployment info to file
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  const deploymentFile = path.join(deploymentsDir, "ronin-testnet.json");
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  // Create .env file with contract addresses
  const envContent = `# VYTO Protocol Contract Addresses - Ronin Testnet
VITE_SMART_VAULT_ADDRESS=${smartVaultAddress}
VITE_IPFS_STORAGE_ADDRESS=${ipfsStorageAddress}
VITE_BONDING_CURVE_ADDRESS=${bondingCurveAddress}
VITE_MEME_TOKEN_FACTORY_ADDRESS=${memeTokenFactoryAddress}

# Add your Pinata API keys here
VITE_PINATA_API_KEY=your_pinata_api_key_here
VITE_PINATA_SECRET_KEY=your_pinata_secret_key_here

# Private key for deployment (keep this secure!)
PRIVATE_KEY=your_private_key_here
`;

  fs.writeFileSync(path.join(__dirname, "..", ".env"), envContent);

  console.log("\n🎉 DEPLOYMENT COMPLETE!");
  console.log("=====================================");
  console.log("📄 Deployment details saved to:", deploymentFile);
  console.log("🔧 Environment file created: .env");
  console.log("\n📋 Contract Addresses:");
  console.log("SmartVault:", smartVaultAddress);
  console.log("IPFSStorage:", ipfsStorageAddress);
  console.log("BondingCurve:", bondingCurveAddress);
  console.log("MemeTokenFactory:", memeTokenFactoryAddress);
  
  console.log("\n🔗 Verification Commands:");
  console.log(`npx hardhat verify --network roninTestnet ${smartVaultAddress}`);
  console.log(`npx hardhat verify --network roninTestnet ${ipfsStorageAddress}`);
  console.log(`npx hardhat verify --network roninTestnet ${bondingCurveAddress} "${katanaRouter}"`);
  console.log(`npx hardhat verify --network roninTestnet ${memeTokenFactoryAddress} "${smartVaultAddress}" "${bondingCurveAddress}" "${ipfsStorageAddress}"`);

  console.log("\n🚀 Next Steps:");
  console.log("1. Update your .env file with Pinata API keys");
  console.log("2. Verify contracts on Ronin Explorer");
  console.log("3. Test the application with the deployed contracts");
  console.log("4. Deploy to production when ready!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });