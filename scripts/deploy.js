const { ethers, run, network } = require('hardhat')

async function main() {
  const contractFactory = await ethers.getContractFactory('SimpleStorage')
  console.log('Deploying contract...')
  const contract = await contractFactory.deploy()
  await contract.waitForDeployment()
  console.log(`Contract deployed: ${contract.target}`)

  // Verifiying contract on Sepolia, seems to be broken
  //   if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
  //     // Wait for 6 block confirmations
  //     const deploymentTx = contract.deploymentTransaction();
  //     await deploymentTx.wait(6);

  //     // Add a delay to give Etherscan time to index the contract
  //     console.log("Waiting for 30 seconds before verification...");
  //     await new Promise(resolve => setTimeout(resolve, 30000));

  //     await verifyContract(contract.target);
  //   }

  const currentFavoriteNumber = await contract.retrieve()
  console.log(`Current favorite number: ${currentFavoriteNumber}`)

  const txResponse = await contract.store(10)
  await txResponse.wait(1)
  const updatedFavoriteNumber = await contract.retrieve()
  console.log(`Updated favorite number: ${updatedFavoriteNumber}`)
}

async function verifyContract(contractAddress) {
  console.log('Verifying contract...')
  try {
    await run('verify:verify', {
      address: contractAddress,
    })
  } catch (error) {
    if (error.message.toLowerCase().includes('already verified')) {
      console.log('Contract already verified')
    } else {
      console.log(error)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
