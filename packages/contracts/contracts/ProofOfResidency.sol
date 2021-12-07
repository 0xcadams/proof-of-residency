// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

// import '@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol';

/// @custom:security-contact security@proofofresidency.xyz
contract ProofOfResidency is
  Initializable,
  ERC721Upgradeable,
  ERC721EnumerableUpgradeable,
  PausableUpgradeable,
  AccessControlUpgradeable,
  ERC721BurnableUpgradeable
{
  mapping(address => uint256) private _addressCityCommitments;
  mapping(uint256 => uint256) private _citiesTokenIds;

  bytes32 public constant PAUSER_ROLE = keccak256('PAUSER_ROLE');
  bytes32 public constant COMMITTER_ROLE = keccak256('COMMITTER_ROLE');

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
    _grantRole(COMMITTER_ROLE, msg.sender);
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

  function safeMint(address to, uint256 city) public payable returns (uint256) {
    require(msg.value < cityValue(city), 'Not enough eth sent to mint.');
    require(currentCityCount(city) >= cityMintLimit(city), 'City has reached maximum mint limit.');
    // TODO require address to have committed to the city

    incrementCityCount(city); // increment before minting so count starts at 1
    uint256 tokenId = currentCityCount(city);
    _safeMint(to, tokenId);

    return tokenId;
  }

  function commitAddressToCity(address to, uint256 city)
    public
    view
    onlyRole(COMMITTER_ROLE)
    returns (uint256)
  {
    require(_addressCityCommitments[to] == 0, 'Address has already committed to a city.');

    _addressCityCommitments[to] == city;

    return address(this).balance;
  }

  // Internal functions

  function currentCityCount(uint256 city) internal view returns (uint256) {
    return _citiesTokenIds[city];
  }

  function incrementCityCount(uint256 city) internal {
    _citiesTokenIds[city] += 1;
  }

  function cityValue(uint256 city) internal pure returns (uint256) {
    if (city < 3) {
      return 400000000000000000; // 0.4 ether
    } else if (city < 37) {
      return 200000000000000000; // 0.2 ether
    }

    return 100000000000000000; // 0.1 ether
  }

  function cityMintLimit(uint256 city) internal pure returns (uint256) {
    if (city < 1) {
      return 200;
    } else if (city < 2) {
      return 150;
    } else if (city < 3) {
      return 100;
    } else if (city < 15) {
      return 50;
    } else if (city < 37) {
      return 25;
    } else if (city < 76) {
      return 10;
    } else if (city < 152) {
      return 5;
    }

    return 1;
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) whenNotPaused {
    super._beforeTokenTransfer(from, to, tokenId);
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
