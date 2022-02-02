// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '../ProofOfResidency.sol';

contract SomeDAOTest {
  ProofOfResidency private immutable _proofOfResidency;

  constructor(address proofOfResidencyAddress) {
    _proofOfResidency = ProofOfResidency(proofOfResidencyAddress);
  }

  function canJoinDao() external view returns (bool) {
    require(isSenderHuman() && !doesSenderHaveOutstandingTokenChallenge(), 'Not allowed!');

    return true;
  }

  function isSenderHuman() private view returns (bool) {
    return _proofOfResidency.balanceOf(msg.sender) > 0;
  }

  function doesSenderHaveOutstandingTokenChallenge() private view returns (bool) {
    return _proofOfResidency.tokenChallengeExists(msg.sender);
  }
}
