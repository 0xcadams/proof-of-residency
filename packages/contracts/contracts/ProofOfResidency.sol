// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

/// @custom:security-contact security@proofofresidency.xyz
contract ProofOfResidency is
  Initializable,
  ERC721Upgradeable,
  ERC721EnumerableUpgradeable,
  PausableUpgradeable,
  AccessControlUpgradeable
{
  mapping(address => bytes32) private _addressCommitments;
  mapping(uint256 => uint256) private _citiesTokenCounts;

  bytes32 public constant PAUSER_ROLE = keccak256('PAUSER_ROLE');
  bytes32 public constant COMMITTER_ROLE = keccak256('COMMITTER_ROLE');

  event Commitment(address indexed _to, bytes32 _commitment);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() initializer {}

  function initialize() public initializer {
    __ERC721_init('Proof of Residency', 'POR');
    __Pausable_init();
    __AccessControl_init();

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(PAUSER_ROLE, msg.sender);
    _grantRole(COMMITTER_ROLE, msg.sender);
  }

  function _baseURI() internal pure override returns (string memory) {
    return 'ipfs://bafybeihrbi6ghrxckdzlitupwnxzicocrfeuqqoavktxp7oruw2bbejdhu/';
  }

  function contractURI() public pure returns (string memory) {
    return string(abi.encodePacked(_baseURI(), 'contract'));
  }

  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function grantCommitterRole(address to) public onlyRole(COMMITTER_ROLE) {
    _grantRole(COMMITTER_ROLE, to);
  }

  function safeMint(uint256 city, string memory secret) public payable returns (uint256) {
    require(msg.value >= _cityValue(city), 'Not enough ETH sent to mint.');
    require(_currentCityCount(city) < _cityMintLimit(city), 'City has reached maximum mint limit.');
    require(
      _addressCommitments[msg.sender] == keccak256(abi.encode(msg.sender, city, secret)),
      'Commitment is incorrect.'
    );

    _incrementCityCount(city); // increment before minting so count starts at 1
    uint256 tokenId = city * 1e3 + _currentCityCount(city);
    _safeMint(msg.sender, tokenId);

    return tokenId;
  }

  function commitAddress(address to, bytes32 commitment) public onlyRole(COMMITTER_ROLE) {
    require(_addressCommitments[to] == 0, 'Address has already committed to another city.');

    _addressCommitments[to] = commitment;

    emit Commitment(to, commitment);
  }

  function currentCityMintedCount(uint256 city) public view returns (uint256) {
    return _currentCityCount(city);
  }

  // Internal functions

  function _currentCityCount(uint256 city) internal view returns (uint256) {
    return _citiesTokenCounts[city];
  }

  function _incrementCityCount(uint256 city) internal {
    _citiesTokenCounts[city] += 1;
  }

  function _cityValue(uint256 city) internal pure returns (uint256) {
    if (city < 3) {
      return 400000000000000000; // 0.4 ether
    } else if (city < 37) {
      return 200000000000000000; // 0.2 ether
    }

    return 100000000000000000; // 0.1 ether
  }

  function _cityMintLimit(uint256 city) internal pure returns (uint256) {
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
