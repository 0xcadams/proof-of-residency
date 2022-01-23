// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '../ProofOfResidency.sol';

/**
 * @title Reentrant Treasury
 * @custom:security-contact security@proofofresidency.xyz
 * @dev Used for tests to test a reentrant treasury contract.
 *
 * This is not deployed to mainnet.
 */
contract ReentrantTreasuryTest {
  ProofOfResidency por;

  event HitFallback();

  constructor(address victim) {
    por = ProofOfResidency(victim);
  }

  receive() external payable {
    emit HitFallback();

    por.withdraw(100);
  }
}
