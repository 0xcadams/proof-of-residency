<div align="center">
  <h1>
    Proof of Residency
  </h1>

  <img src="https://proofofresidency.xyz/russia.png" alt="Russia POR" width="100%" />

  <br />

Proof of Residency is a Sybil-resistant Proof of Personhood protocol which issues **non-transferable** ERC-721 tokens based on physical mailing addresses. Please read the [whitepaper](WHITEPAPER.md) to learn how we issue tokens and retain privacy, as well as our plans for future decentralization.

[![npm version](https://badge.fury.io/js/@proof-of-residency%2Fcontracts.svg)](https://badge.fury.io/js/@proof-of-residency%2Fcontracts)
[![codecov](https://codecov.io/gh/proof-of-residency/proof-of-residency/branch/main/graph/badge.svg?token=SO2ERYVI0O)](https://codecov.io/gh/proof-of-residency/proof-of-residency)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

</div>

---

## Overview

### Installation

```console
$ npm install @proof-of-residency/contracts
```

The Proof of Residency contracts are non-upgradeable, so the API will remain stable indefinitely.

### Usage

Once installed, you can use the contracts by importing them:

```solidity
pragma solidity ^0.8.0;

import "@proof-of-residency/contracts/contracts/ProofOfResidency.sol";

contract MyDAO {
  ProofOfResidency private immutable proofOfResidency;

  constructor(address proofOfResidencyAddress) {
    proofOfResidency = ProofOfResidency(proofOfResidencyAddress)
  }

  function isSenderHuman() external view override returns (bool) {
    return proofOfResidency.balanceOf(msg.sender) == 1;
  }

  function doesSenderHaveOutstandingTokenChallenge() external view override returns (bool) {
    return proofOfResidency.tokenChallengeExists(msg.sender);
  }
}
```

This will not increase the size of your contract, it will only add the appropriate function selectors to the compiled bytecode (as long as you don't use the `new` keyword and create a new Proof of Residency contract). The API for the Proof of Residency ERC-721 is documented extensively in the contract and in the whitepaper.

### Mainnet/Rinkeby Addresses

Coming soon (TODO)...

## Contributing

This stack uses [Hardhat](https://hardhat.org) to orchestrate tasks and [Ethers](https://docs.ethers.io/v5/) for all Ethereum interactions and testing. There are also shared types between the tests and smart contract layer using [Typechain](https://github.com/dethcrypto/TypeChain).

Clone this repository, then install the dependencies with `yarn install`. The smart contract code is under `packages/contracts` and the web code is under `packages/web`. This repository does not contain the code behind the artwork for each ERC-721.

Please see the [website](https://proofofresidency.xyz) for more information!

## License

Licensed under the [MIT license](LICENSE).
