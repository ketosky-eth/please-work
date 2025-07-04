import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("Deploying SmartVaultCore to Base Sepolia...");

  // Get the contract factory
  const SmartVaultCore = await ethers.getContractFactory("SmartVaultCore");

  // Base Sepolia configuration
  const UNISWAP_ROUTER = "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24"; // Uniswap V2 Router on Base
  const TREASURY_WALLET = "0x1A4edf1D0F2a2e7dbe86479A7a95f86b87205802"; // Protocol treasury

  // Deploy the upgradeable contract
  const smartVaultCore = await upgrades.deployProxy(
    SmartVaultCore,
    [
      UNISWAP_ROUTER,
      TREASURY_WALLET
    ],
    {
      kind: "uups",
      initializer: "initialize"
    }
  );

  await smartVaultCore.deployed();

  console.log("SmartVaultCore deployed to:", smartVaultCore.address);
  console.log("Implementation address:", await upgrades.erc1967.getImplementationAddress(smartVaultCore.address));
  console.log("Admin address:", await upgrades.erc1967.getAdminAddress(smartVaultCore.address));

  // Update the contract address in constants
  console.log("\n=== UPDATE CONTRACT ADDRESS ===");
  console.log(`Update CONTRACT_ADDRESSES.BASE_SEPOLIA.SMART_VAULT_CORE to: ${smartVaultCore.address}`);
  console.log("File: src/constants/contracts.ts");

  // Verify the contract
  console.log("Waiting for block confirmations...");
  await smartVaultCore.deployTransaction.wait(5);

  try {
    await hre.run("verify:verify", {
      address: smartVaultCore.address,
      constructorArguments: [],
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.log("Verification failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });