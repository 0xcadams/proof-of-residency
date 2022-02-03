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
// slither-disable-next-line all
contract ReentrantTreasuryTest {
  ProofOfResidency por;

  uint256 private _tokenId;
  uint16 private _country;
  string private _commitment;

  event HitFallback();

  constructor(address victim) {
    por = ProofOfResidency(victim);
  }

  function respondToChallenge(
    uint256 tokenId,
    uint16 country,
    string memory commitment
  ) external returns (bool) {
    _tokenId = tokenId;
    _commitment = commitment;
    _country = country;
    return por.respondToChallenge(tokenId, country, commitment);
  }

  receive() external payable {
    emit HitFallback();

    por.respondToChallenge(_tokenId, _country, _commitment);
  }
}
