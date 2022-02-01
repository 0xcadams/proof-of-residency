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

Once installed, you can use the contracts in the library by importing them:

```solidity
pragma solidity ^0.8.0;

import "@proof-of-residency/contracts/ProofOfResidency.sol";

contract MyDAO {
  public ProofOfResidency proofOfResidency;

  constructor(address proofOfResidencyAddress) {
    proofOfResidency = ProofOfResidency(proofOfResidencyAddress)
  }

  function getIsRequesterHuman() internal view override returns (bool) {
    return proofOfResidency.balanceOf(msg.sender) == 1;
  }
}
```

The API for the Proof of Residency ERC-721 is documented extensively in the contract and in the whitepaper.

## License

Licensed under the [MIT license](LICENSE).
