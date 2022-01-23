<div align="center">
  <h1>
    Proof of Residency
  </h1>

  <!-- <img src="https://proofofresidency.xyz/washington.png" alt="Seattle POR" width="100%" /> -->

  <br />

Proof of Residency is a Sybil-resistant Proof of Personhood protocol which issues **non-transferable** ERC-721 tokens based on physical mailing addresses. Please read the [whitepaper](WHITEPAPER.md) to learn how we issue tokens and retain privacy, as well as our plans for future decentralization.

[![codecov](https://codecov.io/gh/proof-of-residency/proof-of-residency/branch/main/graph/badge.svg?token=SO2ERYVI0O)](https://codecov.io/gh/proof-of-residency/proof-of-residency)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

</div>

---

## Contributing

This stack uses [Hardhat](https://hardhat.org) to orchestrate tasks and [Ethers](https://docs.ethers.io/v5/) for all Ethereum interactions and testing. There are also shared types between the tests and smart contract layer using [Typechain](https://github.com/dethcrypto/TypeChain).

Clone this repository, then install the dependencies with `yarn install`. The smart contract code is under `packages/contracts` and the web code is under `packages/web`. This repository does not contain the code behind the artwork for each NFT.

Please see the [website](https://proofofresidency.xyz) for more information!

## License

Licensed under the [MIT license](LICENSE).
