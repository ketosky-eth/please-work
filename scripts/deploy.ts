import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts to Ronin Testnet...");

  // Deploy Smart Vault first
  const SmartVault = await ethers.getContractFactory("SmartVault");
  const protocolFeeRecipient = "0x742d35Cc6634C0532925a3b8D4C9db4C4C4C4C4C"; // Replace with actual address
  const smartVault = await SmartVault.deploy(protocolFeeRecipient);
  await smartVault.waitForDeployment();
  
  console.log("SmartVault deployed to:", await smartVault.getAddress());

  // Deploy IPFS Storage
  const IPFSStorage = await ethers.getContractFactory("IPFSStorage");
  const ipfsStorage = await IPFSStorage.deploy();
  await ipfsStorage.waitForDeployment();
  
  console.log("IPFSStorage deployed to:", await ipfsStorage.getAddress());

  // Deploy Meme Token Factory
  const MemeTokenFactory = await ethers.getContractFactory("MemeTokenFactory");
  const katanaRouter = "0x7D02c116b98d0965ba7B642ace0183ad8b8D2196"; // Katana Router on Ronin Testnet
  const feeRecipient = protocolFeeRecipient; // Same as protocol fee recipient
  
  const memeTokenFactory = await MemeTokenFactory.deploy(
    katanaRouter,
    await smartVault.getAddress(),
    feeRecipient
  );
  await memeTokenFactory.waitForDeployment();
  
  console.log("MemeTokenFactory deployed to:", await memeTokenFactory.getAddress());

  // Save deployment addresses
  const deploymentInfo = {
    smartVault: await smartVault.getAddress(),
    ipfsStorage: await ipfsStorage.getAddress(),
    memeTokenFactory: await memeTokenFactory.getAddress(),
    network: "Ronin Testnet",
    chainId: 2021
  };

  console.log("\nDeployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });