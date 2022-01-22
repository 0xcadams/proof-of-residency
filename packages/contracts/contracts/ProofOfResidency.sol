// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

import './ERC721NonTransferable.sol';

/**
 * @title Proof of Residency
 * @custom:security-contact security@proofofresidency.xyz
 *
 * @notice An ERC721 token for Proof of Personhood. Proves residency at a physical address
 * which is private. Based on a non-transferable ERC721 token.
 *
 * @dev Uses a commit-reveal scheme to commit to a country and have a token issued based on that commitment.
 */
contract ProofOfResidency is ERC721NonTransferable, Pausable, Ownable {
  uint256 private constant BASE_PRICE = (1 ether * 8) / 1000;
  uint256 private constant LOCATION_MULTIPLIER = 1e15;

  /// @notice Mint price for tokens to contribute to the protocol
  uint256 public mintPrice;

  /// @notice Treasury address for transferring out contributions
  address public treasury;
  /// @notice Committer address responsible for managing secret commitments to an address
  address public committer;

  /// @notice The struct to represent commitments to an address
  struct Commitment {
    uint256 invalidAt;
    bytes32 commitment;
  }

  /// @notice Commitments for an address
  mapping(address => Commitment) private _commitments;
  /// @notice Token counts for a country
  mapping(uint256 => uint256) private _countriesTokenCounts;

  /// @notice Total contributions to the contract
  uint256 private _totalContributions;
  /// @notice Total withdrawn from the contract
  uint256 private _totalWithdrawn;

  /// @notice Event emitted when a commitment is made to an address
  event CommitmentCreated(address indexed _to, bytes32 _commitment);

  constructor(address initialCommitter, address initialTreasury)
    ERC721NonTransferable('Proof of Residency Protocol', 'PORP')
  {
    // slither-disable-next-line missing-zero-check
    committer = initialCommitter;
    // slither-disable-next-line missing-zero-check
    treasury = initialTreasury;

    mintPrice = BASE_PRICE;
  }

  /**
   * @notice Contract URI for OpenSea and other NFT services.
   */
  function contractURI() external pure returns (string memory) {
    return string(abi.encodePacked(_baseURI(), 'contract'));
  }

  /**
   * @dev Base URI override for the contract.
   */
  function _baseURI() internal pure override returns (string memory) {
    return 'ipfs://bafybeihrbi6ghrxckdzlitupwnxzicocrfeuqqoavktxp7oruw2bbejdhu/';
  }

  /**
   * @notice Sets the committer address for the contract.
   */
  function setCommitter(address newCommitter) external onlyOwner {
    // slither-disable-next-line missing-zero-check
    committer = newCommitter;
  }

  /**
   * @notice Sets the treasury address for the contract.
   */
  function setTreasury(address newTreasury) external onlyOwner {
    // slither-disable-next-line missing-zero-check
    treasury = newTreasury;
  }

  /**
   * @notice Sets the value required to mint an NFT. Deliberately as low as possible,
   * this may be changed to be higher/lower.
   */
  function setPrice(uint256 newPrice) external onlyOwner {
    mintPrice = newPrice;
  }

  /**
   * @notice Pauses the contract's commit-reveal functions.
   */
  function pause() public onlyOwner {
    _pause();
  }

  /**
   * @notice Unpauses the contract's commit-reveal functions.
   */
  function unpause() public onlyOwner {
    _unpause();
  }

  /**
   * @notice Mints a new NFT for the given country/secret.
   */
  function mint(uint256 country, string memory secret)
    external
    payable
    whenNotPaused
    returns (uint256)
  {
    Commitment storage existingCommitment = _commitments[msg.sender];

    require(msg.value == mintPrice, 'Incorrect ETH sent');
    require(
      existingCommitment.commitment == keccak256(abi.encode(msg.sender, country, secret)),
      'Commitment is incorrect'
    );
    // slither-disable-next-line timestamp
    require(block.timestamp <= existingCommitment.invalidAt, 'Time limit reached');

    _totalContributions += msg.value;

    _countriesTokenCounts[country] += 1; // increment before minting so count starts at 1
    uint256 tokenId = country * LOCATION_MULTIPLIER + _countriesTokenCounts[country];

    _safeMint(msg.sender, tokenId);

    return tokenId;
  }

  /**
   * @notice Commits an address to a physical address.
   */
  function commitAddress(address to, bytes32 commitment) external whenNotPaused {
    require(committer == msg.sender, 'Caller is not the committer');

    Commitment storage existingCommitment = _commitments[to];

    // slither-disable-next-line timestamp
    require(
      existingCommitment.commitment == 0 || block.timestamp > existingCommitment.invalidAt,
      'Address has existing commitment'
    );

    existingCommitment.invalidAt = block.timestamp + 12 weeks;
    existingCommitment.commitment = commitment;

    emit CommitmentCreated(to, commitment);
  }

  /**
   * @notice Withdraws a specified amount of funds from the contract to the treasury.
   */
  function withdraw(uint256 amount) external onlyOwner {
    require((_totalContributions - _totalWithdrawn) >= amount, 'Withdrawal amount not available');

    _totalWithdrawn += amount;

    // slither-disable-next-line low-level-calls
    (bool success, ) = treasury.call{ value: amount }('');
    require(success, 'Unable to withdraw');
  }

  /**
   * @notice Withdraws a specified amount of funds from the contract to the treasury.
   */
  function currentCountryCount(uint256 country) external view returns (uint256) {
    return _countriesTokenCounts[country];
  }

  /**
   * @dev Required by Solidity.
   */
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721NonTransferable) whenNotPaused {
    super._beforeTokenTransfer(from, to, tokenId);
  }
}
