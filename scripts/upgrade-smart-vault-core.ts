import { ethers, upgrades } from "hardhat";

async function main() {
  const PROXY_ADDRESS = "0x0000000000000000000000000000000000000000"; // Update with deployed proxy address

  console.log("Upgrading SmartVaultCore...");

  const SmartVaultCoreV2 = await ethers.getContractFactory("SmartVaultCore");
  
  const upgraded = await upgrades.upgradeProxy(PROXY_ADDRESS, SmartVaultCoreV2);
  
  console.log("SmartVaultCore upgraded at:", upgraded.address);
  console.log("New implementation address:", await upgrades.erc1967.getImplementationAddress(upgraded.address));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });