// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol';

/// @custom:security-contact security@proofofresidency.xyz
contract ProofOfResidency is
  Initializable,
  ERC721Upgradeable,
  ERC721EnumerableUpgradeable,
  PausableUpgradeable,
  AccessControlUpgradeable,
  ERC721BurnableUpgradeable
{
  using CountersUpgradeable for CountersUpgradeable.Counter;

  struct City {
    CountersUpgradeable.Counter counter;
  }

  mapping(uint256 => City) private _cities;

  bytes32 public constant PAUSER_ROLE = keccak256('PAUSER_ROLE');
  bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() initializer {}

  function initialize() public initializer {
    __ERC721_init('Proof of Residency', 'POR');
    __ERC721Enumerable_init();
    __Pausable_init();
    __AccessControl_init();
    __ERC721Burnable_init();

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(PAUSER_ROLE, msg.sender);
    _grantRole(MINTER_ROLE, msg.sender);
  }

  function _baseURI() internal pure override returns (string memory) {
    return 'ipfs://bafybeihu5xtkokpi2nlzaguprjjut5mu7tndl7zx6gqdhurqnitqn7rwfi/';
  }

  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function safeMint(address to, uint256 city) public onlyRole(MINTER_ROLE) returns (uint256) {
    incrementCityCount(city);
    uint256 tokenId = currentCityCount(city);
    _safeMint(to, tokenId);

    return tokenId;
  }

  function commitAddressToCity(address to, uint256 city)
    public
    onlyRole(MINTER_ROLE)
    returns (uint256)
  {
    // TODO
  }

  // Internal functions

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) whenNotPaused {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function currentCityCount(uint256 city) internal view returns (uint256) {
    return _cities[city].counter.current();
  }

  function incrementCityCount(uint256 city) internal {
    _cities[city].counter.increment();
  }

  // The following functions are overrides required by Solidity.

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721Upgradeable, ERC721EnumerableUpgradeable, AccessControlUpgradeable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
