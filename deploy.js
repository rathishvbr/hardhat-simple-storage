const { ethers } = require('ethers');
const fs = require('fs');
require('dotenv').config();

//compile the contract
async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const encryptedJsonKey = fs.readFileSync('./.encryptedKey.json', 'utf-8');
  let wallet = ethers.Wallet.fromEncryptedJsonSync(
    encryptedJsonKey,
    process.env.PRIVATE_KEY_PASSWORD,
  );
  wallet = wallet.connect(provider);

  const abi = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.abi', 'utf-8');
  const binary = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.bin', 'utf-8');

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log('Deploying contract...')
  const contract = await contractFactory.deploy();
  await contract.deploymentTransaction().wait(1);
  // Get number from contract
  const currentFavoriteNumber = await contract.retrieve();
  console.log(`Current favorite number: ${currentFavoriteNumber}`);

  // Store new number in contract
  const tx = await contract.store(100);
  await tx.wait();
  const updatedFavoriteNumber = await contract.retrieve();
  console.log(`Updated favorite number: ${updatedFavoriteNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
