import { ethers } from 'hardhat';

export const timeTravel = async (days: number) => {
  // skip forward x days
  await ethers.provider.send('evm_increaseTime', [days * 24 * 60 * 60]);
  await ethers.provider.send('evm_mine', []);
};

async function main() {
  await timeTravel(7);

  console.log('Time traveling complete.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
