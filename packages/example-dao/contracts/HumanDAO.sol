// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@proof-of-residency/contracts/contracts/ProofOfResidency.sol';

contract HumanDAO {
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
    // a malicious actor could push the PORP DAO to challenge an honest user, in order
    // to disenfranchise them in a downstream vote
    return _proofOfResidency.tokenChallengeExists(msg.sender);
  }
}
