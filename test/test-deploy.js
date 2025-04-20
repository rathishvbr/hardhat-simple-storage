const { beforeEach } = require('mocha');
const { ethers } = require('hardhat');
const { assert } = require('chai');

describe('SimpleStorage', () => {
  let simpleStorageFactory, simpleStorage;
  beforeEach(async () => {
    simpleStorageFactory = await ethers.getContractFactory('SimpleStorage')
    simpleStorage = await simpleStorageFactory.deploy();
    await simpleStorage.waitForDeployment();
  })
  it('Should start with a favorite number of 0', async () => {
    const currentValue = await simpleStorage.retrieve();
    assert.equal(currentValue, '0');
  })
  it('Should update when we call store', async () => {
    const txResponse = await simpleStorage.store(1);
    await txResponse.wait();
    const updatedValue = await simpleStorage.retrieve();
    assert.equal(updatedValue, '1');
  })
})