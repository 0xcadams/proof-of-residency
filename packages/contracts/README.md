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
pragma solidity ^0.8.7;

import '@proof-of-residency/contracts/contracts/ProofOfResidency.sol';

contract SomeDAOTest {
  ProofOfResidency private immutable _proofOfResidency;

  constructor(address proofOfResidencyAddress) {
    _proofOfResidency = ProofOfResidency(proofOfResidencyAddress);
  }

  function joinDao() external view returns (bool) {
    require(isSenderHuman() && !doesSenderHaveOutstandingTokenChallenge(), 'Not allowed!');

    return true;
  }

  function isSenderHuman() private view returns (bool) {
    return _proofOfResidency.balanceOf(msg.sender) > 0;
  }

  function doesSenderHaveOutstandingTokenChallenge() private view returns (bool) {
    // this should only be used in specific circumstances - there is a chance that
    // a malicious actor could push the PoR DAO to challenge an honest user, in order
    // to disenfranchise them in a downstream vote
    return _proofOfResidency.tokenChallengeExists(msg.sender);
  }
}

```

This will not increase the size of your contract, it will only add the appropriate function selectors to the compiled bytecode (as long as you don't use the `new` keyword and create a new Proof of Residency contract!)

The API for the Proof of Residency ERC-721 is documented extensively in the [contract](packages/contracts/contracts/ProofOfResidency.sol) and the [whitepaper](WHITEPAPER.md).

### Contract Addresses

#### L1/L2s

- **Mainnet:** Coming soon...
- **Arbitrum:** [0x6f66...a4661B4](https://arbiscan.io/address/0x6f668f1892c62860c295B052739B3290fa4661B4)

#### Testnets

- **Rinkeby:** [0xDe1e...4d3857f](https://rinkeby.etherscan.io/address/0xDe1eAc02F7967f73479c2c4ef4CAbF8274d3857f)
- **Arbitrum Rinkeby:** [0xeB52....C27f677](https://testnet.arbiscan.io/address/0xeB528308c07AedEb22353ff4ae70143D5C27f677)

## License

Licensed under the [MIT license](LICENSE).
