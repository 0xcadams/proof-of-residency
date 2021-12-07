// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import './ProofOfResidency.sol';

/// @custom:security-contact security@proofofresidency.xyz
contract ProofOfResidencyTest is ProofOfResidency {
  function currentCityCount(uint256 city) external view returns (uint256) {
    return _currentCityCount(city);
  }

  function incrementCityCount(uint256 city) external {
    _incrementCityCount(city);
  }

  function cityValue(uint256 city) external pure returns (uint256) {
    return _cityValue(city);
  }

  function cityMintLimit(uint256 city) external pure returns (uint256) {
    return _cityMintLimit(city);
  }
}
