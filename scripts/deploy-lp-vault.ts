import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("Deploying Renounced LP Vault System...");

  // Deploy RewardRouterBasic first
  console.log("Deploying RewardRouterBasic...");
  const RewardRouterBasic = await ethers.getContractFactory("RewardRouterBasic");
  const rewardRouter = await RewardRouterBasic.deploy();
  await rewardRouter.deployed();
  console.log("RewardRouterBasic deployed to:", rewardRouter.address);

  // Deploy RenouncedLPVaultFactory
  console.log("Deploying RenouncedLPVaultFactory...");
  const RenouncedLPVaultFactory = await ethers.getContractFactory("RenouncedLPVaultFactory");
  
  const PROTOCOL_TREASURY = "0x1A4edf1D0F2a2e7dbe86479A7a95f86b87205802"; // Protocol treasury
  
  const factory = await RenouncedLPVaultFactory.deploy(
    PROTOCOL_TREASURY,
    rewardRouter.address
  );
  await factory.deployed();
  console.log("RenouncedLPVaultFactory deployed to:", factory.address);

  // Verify contracts
  console.log("Waiting for block confirmations...");
  await rewardRouter.deployTransaction.wait(5);
  await factory.deployTransaction.wait(5);

  try {
    console.log("Verifying RewardRouterBasic...");
    await hre.run("verify:verify", {
      address: rewardRouter.address,
      constructorArguments: [],
    });

    console.log("Verifying RenouncedLPVaultFactory...");
    await hre.run("verify:verify", {
      address: factory.address,
      constructorArguments: [PROTOCOL_TREASURY, rewardRouter.address],
    });
    
    console.log("Contracts verified successfully");
  } catch (error) {
    console.log("Verification failed:", error);
  }

  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("RewardRouterBasic:", rewardRouter.address);
  console.log("RenouncedLPVaultFactory:", factory.address);
  console.log("Protocol Treasury:", PROTOCOL_TREASURY);
  console.log("\n=== UPDATE CONTRACT ADDRESSES ===");
  console.log("Update src/constants/contracts.ts with the deployed addresses");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });