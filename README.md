<div align="center">
  <h1>
    Solidity Starter
  </h1>

  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png" alt="Solidity logo" width="250" />

  <br />

  <img src="https://github.com/chase-adams/solidity-starter/actions/workflows/node.js.yml/badge.svg" alt="Build status" />

  <br />

  Solidity Starter is a boilerplate project for developing, testing, and deploying smart contracts with Solidity/Typescript. This stack uses [Hardhat](https://hardhat.org) to orchestrate tasks and [Ethers](https://docs.ethers.io/v5/) for all Ethereum interactions and testing. There are also shared types between the tests and smart contract layer using [Typechain](https://github.com/dethcrypto/TypeChain).
</div>

---

## Using this Project

Clone this repository, then install the dependencies with `yarn install`.

### Build

To build the Solidity contracts and generate Typechain typings, run `yarn build`.

### Tests

#### Simple

In order to run the contract tests with simple output, run `yarn test`.

#### Interactive

To run the tests with better output, open a separate terminal and run `yarn hardhat node`. Then run the contract tests with `yarn test --network localhost`.

### Coverage

To get coverage on the tests, run `yarn coverage`. Coverage uses [solidity-coverage](https://github.com/sc-forks/solidity-coverage) to get code coverage for tests.

### Deploy

Ensure that your API keys and mnemonic (if you do not have a mnemonic, use `npx mnemonics` to generate one) are in your `.env`. To deploy, use the command:

```bash
yarn hardhat run --network rinkeby scripts/deploy.ts
```

This will deploy the smart contract to the Rinkeby network.

#### Verify on Etherscan

Ensure that the Etherscan API key is added to your `.env`, then run:

```bash
yarn hardhat verify --network rinkeby {DEPLOYED ADDRESS}
```

## License

Licensed under the [MIT license](LICENSE).
