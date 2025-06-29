import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts to Ronin Testnet...");

  // Deploy Smart Vault first
  const SmartVault = await ethers.getContractFactory("SmartVault");
  const smartVault = await SmartVault.deploy();
  await smartVault.waitForDeployment();
  
  console.log("SmartVault deployed to:", await smartVault.getAddress());

  // Deploy IPFS Storage
  const IPFSStorage = await ethers.getContractFactory("IPFSStorage");
  const ipfsStorage = await IPFSStorage.deploy();
  await ipfsStorage.waitForDeployment();
  
  console.log("IPFSStorage deployed to:", await ipfsStorage.getAddress());

  // Deploy Bonding Curve
  const BondingCurve = await ethers.getContractFactory("BondingCurve");
  const katanaRouter = "0x7D02c116b98d0965ba7B642ace0183ad8b8D2196"; // Katana Router on Ronin Testnet
  const bondingCurve = await BondingCurve.deploy(katanaRouter);
  await bondingCurve.waitForDeployment();
  
  console.log("BondingCurve deployed to:", await bondingCurve.getAddress());

  // Deploy Meme Token Factory
  const MemeTokenFactory = await ethers.getContractFactory("MemeTokenFactory");
  const memeTokenFactory = await MemeTokenFactory.deploy(
    await smartVault.getAddress(),
    await bondingCurve.getAddress(),
    await ipfsStorage.getAddress()
  );
  await memeTokenFactory.waitForDeployment();
  
  console.log("MemeTokenFactory deployed to:", await memeTokenFactory.getAddress());

  // Set the factory as owner of bonding curve
  await bondingCurve.transferOwnership(await memeTokenFactory.getAddress());
  console.log("BondingCurve ownership transferred to MemeTokenFactory");

  // Save deployment addresses
  const deploymentInfo = {
    smartVault: await smartVault.getAddress(),
    ipfsStorage: await ipfsStorage.getAddress(),
    bondingCurve: await bondingCurve.getAddress(),
    memeTokenFactory: await memeTokenFactory.getAddress(),
    network: "Ronin Testnet",
    chainId: 2021,
    protocolAddress: "0x1A4edf1D0F2a2e7dbe86479A7a95f86b87205802",
    graduationTarget: "108800 RON",
    creatorReward: "500 RON",
    protocolReward: "100 RON"
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