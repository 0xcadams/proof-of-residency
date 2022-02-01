// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

import './ERC721NonTransferable.sol';

// import 'hardhat/console.sol';

/**
 * @title Proof of Residency
 * @custom:security-contact security@proofofresidency.xyz
 *
 * @notice An non-transferable ERC721 token for Proof of Personhood. Proves residency at a physical address
 * which is kept private.
 *
 * @dev Uses a commit-reveal scheme to commit to a country and have a token issued based on that commitment.
 */
contract ProofOfResidency is ERC721NonTransferable, Pausable, Ownable, ReentrancyGuard {
  /// @notice Reservation price for tokens to contribute to the protocol
  /// Incentivizes users to continue to mint after requesting a letter
  uint256 public reservePrice;

  /// @notice Project treasury to send tax + donation
  address public projectTreasury;

  /// @notice Token counts for a country
  /// @dev Uses uint16 for country ID (which will overflow at 65535)
  /// https://en.wikipedia.org/wiki/ISO_3166-1_numeric
  mapping(uint16 => uint256) public countryTokenCounts;

  /// @notice Committer addresses responsible for managing secret commitments to an address
  /// @dev Maps to treasury accounts for a committer for transferring out contributions
  mapping(address => address) private _committerTreasuries;
  /// @notice Total contributions for each committer
  mapping(address => uint256) private _committerContributions;

  /// @notice Commitments for a wallet address
  mapping(address => Commitment) private _commitments;

  /// @notice Expiration for challenges made for an address
  mapping(address => uint256) private _tokenChallengeExpirations;

  /// @notice The tax + donation percentages (15% to MAW, 5% to original team)
  uint256 private constant TAX_AND_DONATION_PERCENT = 20;
  /// @notice The waiting period before minting becomes available
  uint256 private constant COMMITMENT_WAITING_PERIOD = 1 weeks;
  /// @notice The period during which minting is available (after the preminting period)
  uint256 private constant COMMITMENT_PERIOD = 5 weeks;
  /// @notice Multiplier for country token IDs
  uint256 private constant LOCATION_MULTIPLIER = 1e15;

  /// @notice We include a nonce in every hashed message, and increment the nonce as part of a
  /// minting operation to prevent replay attacks
  mapping(address => uint256) public nonces;
  /// @notice The version of this contract
  string private constant VERSION = '1';
  /// @notice The EIP-712 typehash for the contract's domain
  bytes32 private constant DOMAIN_TYPEHASH =
    keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)');
  /// @notice The EIP-712 typehash for the commitment struct used by the contract
  bytes32 private constant COMMITMENT_TYPEHASH =
    keccak256('Commitment(address to,bytes32 commitment,uint256 nonce)');
  /// @notice The domain separator for EIP-712
  bytes32 private immutable _domainSeparator;

  /// @notice The baseURI for the metadata of this contract (extra underscore to avoid clashing with function)
  // slither-disable-next-line naming-convention
  string private __baseUri;

  /// @notice The struct to represent commitments to an address
  struct Commitment {
    uint256 validAt;
    bytes32 commitment;
    address committer;
    uint256 value;
  }

  /// @notice Event emitted when a commitment is made to an address
  event CommitmentCreated(address indexed to, address indexed committer, bytes32 commitment);

  /// @notice Event emitted when a committer is added
  event CommitterAdded(address indexed committer);
  /// @notice Event emitted when a committer is removed
  event CommitterRemoved(address indexed committer, uint256 fundsLost);

  /// @notice Event emitted when a token is challenged
  event TokenChallenged(address indexed owner, uint256 indexed tokenId);

  /// @notice Event emitted when the price is changed
  event PriceChanged(uint256 indexed newPrice);

  constructor(
    address initialCommitter,
    address initialTreasury,
    string memory initialBaseUri,
    uint256 initialPrice
  ) ERC721NonTransferable('Proof of Residency Protocol', 'PORP') {
    // slither-disable-next-line missing-zero-check
    projectTreasury = initialTreasury;
    reservePrice = initialPrice;

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
   * @notice Sets the main project treasury.
   */
  function setProjectTreasury(address newTreasury) external onlyOwner {
    require(newTreasury != address(0), 'Non-0 address');

    projectTreasury = newTreasury;
  }

  /**
   * @notice Adds a new committer address with their treasury.
   */
  function addCommitter(address newCommitter, address newTreasury) external onlyOwner {
    _committerTreasuries[newCommitter] = newTreasury;

    emit CommitterAdded(newCommitter);
  }

  /**
   * @notice Removes a committer address and sets their contributions to be owned
   * by the treasury.
   */
  function removeCommitter(address removedCommitter) external onlyOwner {
    delete _committerTreasuries[removedCommitter];

    uint256 fundsLost = _committerContributions[removedCommitter];

    _committerContributions[projectTreasury] = fundsLost;
    _committerContributions[removedCommitter] = 0;

    emit CommitterRemoved(removedCommitter, fundsLost);
  }

  /**
   * @notice Burns a list of token IDs. Only allowed after a token challenge has been
   * issued and subsequently expired.
   */
  function burnTokens(address[] memory addresses) external onlyOwner {
    for (uint256 i = 0; i < addresses.length; i++) {
      require(tokenChallengeExpired(addresses[i]), 'Challenge not expired');

      uint256 tokenId = tokenOfOwnerByIndex(addresses[i], 1);
      Commitment memory existingCommitment = _commitments[addresses[i]];

      // add the value to the committers successful commitments
      _committerContributions[existingCommitment.committer] += existingCommitment.value;

      _burn(tokenId);
    }
  }

  /**
   * @notice Initiates a challenge for a list of addresses. The user must re-request
   * a commitment and verify a mailing address again.
   */
  function challenge(address[] memory addresses) external onlyOwner {
    for (uint256 i = 0; i < addresses.length; i++) {
      uint256 tokenId = tokenOfOwnerByIndex(addresses[i], 1);

      _tokenChallengeExpirations[addresses[i]] =
        block.timestamp +
        COMMITMENT_WAITING_PERIOD +
        COMMITMENT_PERIOD;

      emit TokenChallenged(addresses[i], tokenId);
    }
  }

  /**
   * @notice Sets the value required to request an NFT. Deliberately as low as possible to
   * incentivize committers, this may be changed to be lower/higher.
   */
  function setPrice(uint256 newPrice) external onlyOwner {
    reservePrice = newPrice;

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
   * @notice Commits a wallet address to a physical address using signed data from a committer.
   * Signatures are used to prevent committers from paying gas fees for commitments.
   *
   * @dev Must be signed according to https://eips.ethereum.org/EIPS/eip-712
   */
  function commitAddress(
    address to,
    bytes32 commitment,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) external payable whenNotPaused nonReentrant {
    address signatory = _validateSignature(to, commitment, v, r, s);
    require(_committerTreasuries[signatory] != address(0), 'Signatory non-committer');

    require(msg.value == reservePrice, 'Incorrect value');

    Commitment storage existingCommitment = _commitments[to];

    // slither-disable-next-line timestamp
    require(
      existingCommitment.commitment == 0 ||
        block.timestamp > existingCommitment.validAt + COMMITMENT_PERIOD,
      'Existing commitment'
    );

    existingCommitment.committer = signatory;
    existingCommitment.validAt = block.timestamp + COMMITMENT_WAITING_PERIOD;
    existingCommitment.commitment = commitment;
    existingCommitment.value = msg.value;

    emit CommitmentCreated(to, signatory, commitment);
  }

  /**
   * @notice Mints a new token for the given country/commitment.
   */
  function mint(uint16 country, string memory commitment)
    external
    whenNotPaused
    nonReentrant
    returns (uint256)
  {
    // requires the requester to have no tokens - they cannot transfer, but may have burned a previous token
    require(balanceOf(_msgSender()) == 0, 'Already owns token');

    Commitment memory existingCommitment = _validateAndDeleteCommitment(country, commitment);

    // add the value to the committers successful commitments
    _committerContributions[existingCommitment.committer] += existingCommitment.value;

    countryTokenCounts[country] += 1; // increment before minting so count starts at 1
    uint256 tokenId = uint256(country) * LOCATION_MULTIPLIER + uint256(countryTokenCounts[country]);

    _safeMint(_msgSender(), tokenId);

    return tokenId;
  }

  /**
   * @notice Responds to a challenge with a token ID and corresponding country/commitment.
   */
  function respondToChallenge(
    uint256 tokenId,
    uint16 country,
    string memory commitment
  ) external whenNotPaused nonReentrant returns (bool) {
    // ensure that the country is the same as the current token ID
    require(tokenId / LOCATION_MULTIPLIER == country, 'Country not valid');

    Commitment memory existingCommitment = _validateAndDeleteCommitment(country, commitment);

    delete _tokenChallengeExpirations[_msgSender()];

    // slither-disable-next-line low-level-calls
    (bool success, ) = _msgSender().call{ value: existingCommitment.value }('');
    require(success, 'Unable to refund');

    return true;
  }

  /**
   * @notice Withdraws funds from the contract to the committer's treasury.
   *
   * Applies a tax to the withdrawal for the protocol and donations.
   */
  function withdraw() external nonReentrant {
    uint256 totalAmount = _committerContributions[_msgSender()];
    uint256 taxAndDonation = (totalAmount * TAX_AND_DONATION_PERCENT) / 100;
    require(taxAndDonation > 0, 'Tax not over 0');

    _committerContributions[_msgSender()] = 0;

    // slither-disable-next-line low-level-calls
    (bool success1, ) = projectTreasury.call{ value: taxAndDonation }('');
    require(success1, 'Unable to send project treasury');

    // slither-disable-next-line low-level-calls
    (bool success2, ) = _committerTreasuries[_msgSender()].call{
      value: totalAmount - taxAndDonation
    }('');
    require(success2, 'Unable to withdraw');
  }

  /**
   * @notice Gets if a commitment for the sender's address is upcoming.
   */
  function getCommitmentPeriodIsUpcoming() external view returns (bool) {
    Commitment memory existingCommitment = _commitments[_msgSender()];

    // slither-disable-next-line timestamp
    return block.timestamp <= existingCommitment.validAt;
  }

  /**
   * @notice Gets if the commitment for the sender's address is in the time window where they
   * are able to mint.
   */
  function getCommitmentPeriodIsValid() public view returns (bool) {
    Commitment memory existingCommitment = _commitments[_msgSender()];

    // slither-disable-next-line timestamp
    return
      block.timestamp >= existingCommitment.validAt &&
      block.timestamp <= existingCommitment.validAt + COMMITMENT_WAITING_PERIOD;
  }

  /**
   * @notice Gets if a token challenge for an address has expired (and becomes eligible for
   * burning/re-issuing).
   */
  function tokenChallengeExpired(address owner) public view returns (bool) {
    return _tokenChallengeExpirations[owner] >= block.timestamp;
  }

  /**
   * @notice Gets if a token challenge exists for an address. This can be used in
   * downstream projects to ensure that a user does not have any outstanding challenges.
   */
  function tokenChallengeExists(address owner) public view returns (bool) {
    return _tokenChallengeExpirations[owner] != 0;
  }

  /**
   * @dev Validates a commitment and deletes the Commitment from the mapping.
   */
  function _validateAndDeleteCommitment(uint16 country, string memory commitment)
    private
    returns (Commitment memory existingCommitment)
  {
    existingCommitment = _commitments[_msgSender()];

    require(
      existingCommitment.commitment ==
        keccak256(abi.encode(_msgSender(), country, commitment, nonces[_msgSender()])),
      'Commitment incorrect'
    );
    require(getCommitmentPeriodIsValid(), 'Commitment period invalid');

    // requires that the original committer is still valid
    require(_committerTreasuries[existingCommitment.committer] != address(0), 'Signatory removed');

    // increment the nonce for the sender
    nonces[_msgSender()] += 1;

    delete _commitments[_msgSender()];
  }

  /**
   * @dev Validates a signature which corresponds to one signed with the
   * https://eips.ethereum.org/EIPS/eip-712[`eth_signTypedData`] method as part of EIP-712.
   */
  function _validateSignature(
    address to,
    bytes32 commitment,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) private view returns (address) {
    bytes32 structHash = keccak256(abi.encode(COMMITMENT_TYPEHASH, to, commitment, nonces[to]));
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
