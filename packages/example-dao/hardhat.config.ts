import { HardhatUserConfig } from 'hardhat/types';

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-etherscan';
import 'solidity-coverage';
import 'hardhat-contract-sizer';

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
    hardhat: {},
    localhost: {}
  }
};

export default config;
