// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

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
contract ProofOfResidency is ERC721NonTransferable, Pausable, Ownable, ReentrancyGuard {
  uint256 private constant BASE_PRICE = (1 ether * 8) / 1000;
  uint256 private constant LOCATION_MULTIPLIER = 1e15;

  /// @notice The version of this contract
  string public constant VERSION = '1';

  /// @notice The EIP-712 typehash for the contract's domain
  bytes32 public constant DOMAIN_TYPEHASH =
    keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)');

  /// @notice The EIP-712 typehash for the commitment struct used by the contract
  bytes32 public constant COMMITMENT_TYPEHASH =
    keccak256('Commitment(address to,bytes32 commitment,bytes32 hashedMailingAddress)');

  /// @notice Mint price for tokens to contribute to the protocol
  uint256 public mintPrice;

  /// @notice The baseURI for the metadata of this contract
  string private baseUri;

  /// @notice Committer addresses responsible for managing secret commitments to an address
  /// @dev Maps to treasury accounts for a committer for transferring out contributions
  mapping(address => address) private _committerTreasuries;

  /// @notice The struct to represent commitments to an address
  struct Commitment {
    uint256 validAt;
    uint256 invalidAt;
    bytes32 commitment;
    address committer;
  }

  /// @notice Commitments for an address
  mapping(address => Commitment) private _commitments;
  /// @notice Token counts for a country
  mapping(uint256 => uint256) private _countriesTokenCounts;

  /// @notice Commitments for each mailing address ID
  mapping(uint256 => uint256) private _mailingAddressCounts;
  /// @notice Blacklist for mailing addresses
  mapping(uint256 => bool) private _mailingAddressBlacklist;

  /// @notice Total contributions for each committer
  mapping(address => uint256) private _committerContributions;

  /// @notice Event emitted when a commitment is made to an address
  event CommitmentCreated(
    address indexed to,
    address indexed committer,
    uint256 indexed mailingAddressId,
    bytes32 commitment
  );

  /// @notice Event emitted when a committer is added
  event CommitterAdded(address indexed committer);

  /// @notice Event emitted when a committer is removed
  event CommitterRemoved(address indexed committer);

  /// @notice Event emitted when the price is changed
  event PriceChanged(uint256 indexed newPrice);

  /// @notice Event emitted when a mailing address is blacklisted
  event MailingAddressBlacklisted(uint256 indexed blacklistedAddress);

  constructor(address initialCommitter, address initialTreasury)
    ERC721NonTransferable('Proof of Residency Protocol', 'PORP')
  {
    _committerTreasuries[initialCommitter] = initialTreasury;

    mintPrice = BASE_PRICE;
    baseUri = 'ipfs://bafybeihrbi6ghrxckdzlitupwnxzicocrfeuqqoavktxp7oruw2bbejdhu/';
  }

  /**
   * @dev Throws if called by any account other than a committer.
   */
  modifier onlyCommitter() {
    require(_committerTreasuries[_msgSender()] != address(0), 'Caller is not a committer');
    _;
  }

  /**
   * @notice Contract URI for OpenSea and other NFT services.
   */
  function contractURI() external view returns (string memory) {
    return string(abi.encodePacked(_baseURI(), 'contract'));
  }

  /**
   * @dev Base URI override for the contract.
   */
  function _baseURI() internal view override returns (string memory) {
    return baseUri;
  }

  /**
   * @notice Sets the base URI for the metadata.
   */
  function setBaseURI(string memory newBaseUri) external onlyOwner {
    baseUri = newBaseUri;
  }

  /**
   * @notice Adds a new committer address with their treasury.
   */
  function addCommitter(address newCommitter, address newTreasury) external onlyOwner {
    // -disable-next-line missing-zero-check
    _committerTreasuries[newCommitter] = newTreasury;

    emit CommitterAdded(newCommitter);
  }

  /**
   * @notice Removes a new committer address with their treasury.
   */
  function removeCommitter(address removedCommitter) external onlyOwner {
    // -disable-next-line missing-zero-check
    delete _committerTreasuries[removedCommitter];

    emit CommitterRemoved(removedCommitter);
  }

  /**
   * @notice Blacklists a mailing address from being used. This is for cases of fraud.
   */
  function blacklistMailingAddress(uint256 mailingAddressId) external onlyOwner {
    _mailingAddressBlacklist[mailingAddressId] = true;

    emit MailingAddressBlacklisted(mailingAddressId);
  }

  /**
   * @notice Sets the value required to mint an NFT. Deliberately as low as possible to
   * incentivize committers, this may be changed to be lower/higher.
   */
  function setPrice(uint256 newPrice) external onlyOwner {
    mintPrice = newPrice;

    emit PriceChanged(newPrice);
  }

  /**
   * @notice Pauses the contract's commit-reveal functions.
   */
  function pause() external onlyOwner {
    _pause();
  }

  /**
   * @notice Unpauses the contract's commit-reveal functions.
   */
  function unpause() external onlyOwner {
    _unpause();
  }

  /**
   * @notice Mints a new NFT for the given country/publicKey.
   */
  function mint(uint256 country, string memory publicKey)
    external
    payable
    whenNotPaused
    nonReentrant
    returns (uint256)
  {
    Commitment storage existingCommitment = _commitments[_msgSender()];

    require(msg.value == mintPrice, 'Incorrect ETH sent');
    require(
      existingCommitment.commitment == keccak256(abi.encode(_msgSender(), country, publicKey)),
      'Commitment is incorrect'
    );
    // slither-disable-next-line timestamp
    require(block.timestamp >= existingCommitment.validAt, 'Cannot mint yet');
    // slither-disable-next-line timestamp
    require(block.timestamp <= existingCommitment.invalidAt, 'Commitment expired');

    _committerContributions[existingCommitment.committer] += msg.value;

    _countriesTokenCounts[country] += 1; // increment before minting so count starts at 1
    uint256 tokenId = country * LOCATION_MULTIPLIER + _countriesTokenCounts[country];

    delete _commitments[_msgSender()];

    _safeMint(_msgSender(), tokenId);

    return tokenId;
  }

  /**
   * @notice Commits a wallet address to a physical address using signed data from a committer.
   * Signatures are used to prevent committers from paying gas fees for commitments.
   *
   * @dev Must be signed according to https://eips.ethereum.org/EIPS/eip-712
   */
  function commitAddress(
    address to,
    bytes32 commitment,
    bytes32 hashedMailingAddress,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) external whenNotPaused {
    address signatory = _validateSignature(to, commitment, hashedMailingAddress, v, r, s);
    require(_committerTreasuries[signatory] != address(0), 'Signatory is not a committer');

    uint256 mailingAddressId = uint256(hashedMailingAddress);
    require(!_mailingAddressBlacklist[mailingAddressId], 'Mailing address is blacklisted');

    _mailingAddressCounts[mailingAddressId] += 1;

    Commitment storage existingCommitment = _commitments[to];

    // slither-disable-next-line timestamp
    require(
      existingCommitment.commitment == 0 || block.timestamp > existingCommitment.invalidAt,
      'Address has existing commitment'
    );

    existingCommitment.committer = signatory;
    existingCommitment.validAt = block.timestamp + 1 weeks;
    existingCommitment.invalidAt = block.timestamp + 10 weeks;
    existingCommitment.commitment = commitment;

    emit CommitmentCreated(to, signatory, mailingAddressId, commitment);
  }

  /**
   * @notice Withdraws a specified amount of funds from the contract to the committer's treasury.
   */
  function withdraw(uint256 amount) external onlyCommitter nonReentrant {
    require(_committerContributions[_msgSender()] >= amount, 'Withdrawal amount not available');

    _committerContributions[_msgSender()] -= amount;

    // slther-disable-next-line low-level-calls
    (bool success, ) = _committerTreasuries[_msgSender()].call{ value: amount }('');
    require(success, 'Unable to withdraw');
  }

  /**
   * @notice Gets if the commitment for the sender's address exists or they already have a token.
   */
  function getCommitmentExists() external view returns (bool) {
    Commitment storage existingCommitment = _commitments[_msgSender()];

    return existingCommitment.validAt != 0;
  }

  /**
   * @notice Gets if the commitment for the sender's address is in the time window where they
   * are able to mint.
   */
  function getCommitmentPeriodIsValid() external view returns (bool) {
    Commitment storage existingCommitment = _commitments[_msgSender()];

    // slither-disable-next-line timestamp
    return
      block.timestamp >= existingCommitment.validAt &&
      block.timestamp <= existingCommitment.invalidAt;
  }

  /**
   * @notice Gets the current country count for a country ID.
   */
  function getCountryCount(uint256 country) external view returns (uint256) {
    return _countriesTokenCounts[country];
  }

  /**
   * @notice Gets the current commitment count for a mailing address ID.
   */
  function getMailingAddressCount(uint256 mailingAddressId) external view returns (uint256) {
    return _mailingAddressCounts[mailingAddressId];
  }

  /**
   * @dev Validates a signature which corresponds to one signed with the
   * https://eips.ethereum.org/EIPS/eip-712[`eth_signTypedData`] method as part of EIP-712.
   */
  function _validateSignature(
    address to,
    bytes32 commitment,
    bytes32 hashedMailingAddress,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) private view returns (address) {
    bytes32 domainSeparator = keccak256(
      abi.encode(
        DOMAIN_TYPEHASH,
        keccak256(bytes(name())),
        keccak256(bytes(VERSION)),
        block.chainid,
        address(this)
      )
    );
    bytes32 structHash = keccak256(
      abi.encode(COMMITMENT_TYPEHASH, to, commitment, hashedMailingAddress)
    );
    bytes32 digest = keccak256(abi.encodePacked('\x19\x01', domainSeparator, structHash));
    address signatory = ecrecover(digest, v, r, s);

    return signatory;
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
