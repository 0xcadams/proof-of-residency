import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig({ path: '../../.env' });

import { HardhatUserConfig } from 'hardhat/types';

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-etherscan';
import 'solidity-coverage';
import 'hardhat-contract-sizer';
import 'hardhat-gas-reporter';

process.env.REPORT_GAS = 'y';

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? '';
const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID ?? '';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ?? '';
const ARBISCAN_API_KEY = process.env.ARBISCAN_API_KEY ?? '';
const OPTIMISTIC_ETHERSCAN_API_KEY = process.env.OPTIMISTIC_ETHERSCAN_API_KEY ?? '';
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY ?? '';

const PRIVATE_KEY = process.env.PRIVATE_KEY || undefined;

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [
      {
        version: '0.8.7',
        settings: {
          optimizer: {
            enabled: true
          }
        }
      }
    ]
  },
  networks: {
    hardhat: {
      chainId: 1337
      // forking: {
      //   url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      //   blockNumber: 14090042
      // }
    },
    localhost: {
      // accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined
    },
    'arbitrum-rinkeby': {
      url: `https://arbitrum-rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined
    },
    arbitrum: {
      url: `https://arbitrum-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined
    },
    'optimistic-kovan': {
      url: `https://optimism-kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined
    },
    optimism: {
      url: `https://optimism-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined
    },
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined
    },
    'polygon-mumbai': {
      url: `https://polygon-mumbai.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`
      // accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined
    },
    'truffle-dashboard': {
      url: 'http://localhost:24012/rpc'
    }
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      rinkeby: ETHERSCAN_API_KEY,
      goerli: ETHERSCAN_API_KEY,
      // Arbitrum
      arbitrumOne: ARBISCAN_API_KEY,
      arbitrumTestnet: ARBISCAN_API_KEY,
      // optimism
      optimisticEthereum: OPTIMISTIC_ETHERSCAN_API_KEY,
      optimisticKovan: OPTIMISTIC_ETHERSCAN_API_KEY,
      // polygon
      polygon: POLYGONSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY
    }
  },
  typechain: {
    outDir: '../web/types/typechain-types'
  },
  gasReporter: {
    currency: 'USD',
    coinmarketcap: '181841aa-db2a-4825-8359-f0dcce4d0db5'
    // gasPriceApi: 'https://api.arbiscan.io/api?module=proxy&action=eth_gasPrice'
  }
};

export default config;
