import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("Deploying SmartVaultCore with UUPS proxy...");

  // Get the contract factory
  const SmartVaultCore = await ethers.getContractFactory("SmartVaultCore");

  // Deploy addresses (update these with actual addresses)
  const RON_TOKEN = "0x0000000000000000000000000000000000000000"; // RON token address
  const SMART_VAULT_SBT = "0x0000000000000000000000000000000000000000"; // Smart Vault SBT address
  const GENESIS_VAULT_SHARD = "0x0000000000000000000000000000000000000000"; // Genesis Vault Shard address
  const UNISWAP_ROUTER = "0x7D02c116b98d0965ba7B642ace0183ad8b8D2196"; // Katana Router on Ronin
  const TREASURY_WALLET = "0x1A4edf1D0F2a2e7dbe86479A7a95f86b87205802"; // Protocol treasury

  // Deploy the upgradeable contract
  const smartVaultCore = await upgrades.deployProxy(
    SmartVaultCore,
    [
      RON_TOKEN,
      SMART_VAULT_SBT,
      GENESIS_VAULT_SHARD,
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
  console.log(`Update CONTRACT_ADDRESSES.SMART_VAULT_CORE to: ${smartVaultCore.address}`);
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