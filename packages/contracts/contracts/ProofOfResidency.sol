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
  /// @notice Mint price for tokens to contribute to the protocol
  uint256 public mintPrice;

  /// @notice Commitments for each mailing address ID
  mapping(uint256 => uint256) public mailingAddressCounts;
  /// @notice Token counts for a country
  mapping(uint256 => uint256) public countryTokenCounts;

  /// @notice Committer addresses responsible for managing secret commitments to an address
  /// @dev Maps to treasury accounts for a committer for transferring out contributions
  mapping(address => address) private _committerTreasuries;
  /// @notice Total contributions for each committer
  mapping(address => uint256) private _committerContributions;

  /// @notice Commitments for a wallet address
  mapping(address => Commitment) private _commitments;

  /// @notice Blacklist for mailing address IDs
  mapping(uint256 => bool) private _mailingAddressBlacklist;

  /// @notice The waiting period before minting becomes available
  uint256 private constant PREMINTING_WAITING_PERIOD_TIME = 1 weeks;
  /// @notice The period during which minting is available (after the preminting period)
  uint256 private constant MINTING_PERIOD_TIME = 5 weeks;
  /// @notice Multiplier for country token IDs
  uint256 private constant LOCATION_MULTIPLIER = 1e15;

  /// @notice The version of this contract
  string private constant VERSION = '1';
  /// @notice The EIP-712 typehash for the contract's domain
  bytes32 private constant DOMAIN_TYPEHASH =
    keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)');
  /// @notice The EIP-712 typehash for the commitment struct used by the contract
  bytes32 private constant COMMITMENT_TYPEHASH =
    keccak256('Commitment(address to,bytes32 commitment,bytes32 hashedMailingAddress)');
  /// @notice The domain separator for EIP-712
  bytes32 private immutable _domainSeparator;

  /// @notice The baseURI for the metadata of this contract (extra underscore to avoid clashing with function)
  string private __baseUri;

  /// @notice The struct to represent commitments to an address
  struct Commitment {
    uint256 validAt;
    uint256 invalidAt;
    bytes32 commitment;
    address committer;
  }

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

  /// @notice Event emitted when a mailing address is blacklisted
  event MailingAddressBlacklisted(uint256 indexed blacklistedAddress);

  /// @notice Event emitted when the price is changed
  event PriceChanged(uint256 indexed newPrice);

  constructor(
    address initialCommitter,
    address initialTreasury,
    string memory initialBaseUri,
    uint256 initialPrice
  ) ERC721NonTransferable('Proof of Residency Protocol', 'PORP') {
    mintPrice = initialPrice;
    __baseUri = initialBaseUri;

    _committerTreasuries[initialCommitter] = initialTreasury;

    _domainSeparator = keccak256(
      abi.encode(
        DOMAIN_TYPEHASH,
        keccak256(bytes(name())),
        keccak256(bytes(VERSION)),
        block.chainid,
        address(this)
      )
    );
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
    return __baseUri;
  }

  /**
   * @notice Sets the base URI for the metadata.
   */
  function setBaseURI(string memory newBaseUri) external onlyOwner {
    __baseUri = newBaseUri;
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

    require(msg.value == mintPrice, 'Incorrect value');
    require(
      existingCommitment.commitment == keccak256(abi.encode(_msgSender(), country, publicKey)),
      'Commitment incorrect'
    );
    // requires the requester to have no tokens - they cannot transfer, but may have burned a previous token
    // TODO can this be reached?
    require(balanceOf(_msgSender()) == 0, 'Already owns token');
    // slither-disable-next-line timestamp
    require(block.timestamp >= existingCommitment.validAt, 'Cannot mint yet');
    // slither-disable-next-line timestamp
    require(block.timestamp <= existingCommitment.invalidAt, 'Expired');

    _committerContributions[existingCommitment.committer] += msg.value;

    countryTokenCounts[country] += 1; // increment before minting so count starts at 1
    uint256 tokenId = country * LOCATION_MULTIPLIER + countryTokenCounts[country];

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
    require(_committerTreasuries[signatory] != address(0), 'Signatory non-committer');

    // requires the requester to have no tokens - they cannot transfer, but may have burned a previous token
    require(balanceOf(to) == 0, 'Non-0 token');

    uint256 mailingAddressId = uint256(hashedMailingAddress);
    require(!_mailingAddressBlacklist[mailingAddressId], 'Mailing address blacklisted');

    mailingAddressCounts[mailingAddressId] += 1;

    Commitment storage existingCommitment = _commitments[to];

    // slither-disable-next-line timestamp
    require(
      existingCommitment.commitment == 0 || block.timestamp > existingCommitment.invalidAt,
      'Existing commitment'
    );

    existingCommitment.committer = signatory;
    existingCommitment.validAt = block.timestamp + PREMINTING_WAITING_PERIOD_TIME;
    existingCommitment.invalidAt = block.timestamp + MINTING_PERIOD_TIME;
    existingCommitment.commitment = commitment;

    emit CommitmentCreated(to, signatory, mailingAddressId, commitment);
  }

  /**
   * @notice Withdraws a specified amount of funds from the contract to the committer's treasury.
   */
  function withdraw(uint256 amount) external nonReentrant {
    require(_committerContributions[_msgSender()] >= amount, 'Not available');

    _committerContributions[_msgSender()] -= amount;

    // slither-disable-next-line low-level-calls
    (bool success, ) = _committerTreasuries[_msgSender()].call{ value: amount }('');
    require(success, 'Unable to withdraw');
  }

  /**
   * @notice Gets if a commitment for the sender's address is upcoming.
   */
  function getCommitmentPeriodIsUpcoming() external view returns (bool) {
    Commitment storage existingCommitment = _commitments[_msgSender()];

    // slither-disable-next-line timestamp
    return existingCommitment.validAt != 0 && block.timestamp <= existingCommitment.invalidAt;
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
    bytes32 structHash = keccak256(
      abi.encode(COMMITMENT_TYPEHASH, to, commitment, hashedMailingAddress)
    );
    bytes32 digest = keccak256(abi.encodePacked('\x19\x01', _domainSeparator, structHash));
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
