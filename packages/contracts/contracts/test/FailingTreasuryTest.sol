// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/**
 * @title Failing Treasury
 * @custom:security-contact security@proofofresidency.xyz
 * @dev Used for tests to test a failing treasury contract.
 *
 * This is not deployed to mainnet.
 */
contract FailingTreasuryTest {
  // Sending Ether to this contract will cause an exception,
  // because the fallback function does not have the `payable`
  // modifier.
  fallback() external {}
}
