import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig({ path: '../../.env' });

import { HardhatUserConfig } from 'hardhat/types';

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-etherscan';
import '@openzeppelin/hardhat-upgrades';
import 'solidity-coverage';
import 'hardhat-contract-sizer';

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [{ version: '0.8.10', settings: {} }]
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
        blockNumber: 13762650
      }
    },
    localhost: {
      // accounts: [`${PRIVATE_KEY}`]
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`
      // accounts: [`${PRIVATE_KEY}`]
    },
    coverage: {
      url: 'http://127.0.0.1:8555' // Coverage launches its own ganache-cli client
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY
  },
  typechain: {
    outDir: '../web/types/typechain-types'
  }
};

export default config;
