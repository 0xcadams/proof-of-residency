# Proof of Residency Whitepaper

## Motivation

The web3 ecosystem has benefited from the anonymity and transparency of the underlying smart contracts. This has allowed for blockchains to support complex systems like finance and governance without the need for identity. A system which is always anonymous naturally has another property - vulnerability to Sybil attacks from malicious actors who subvert the service's reputation system. If an actor is always anonymous, with no distinguishing identifiers, there is no distinction between many people and one person creating many pseudonymous identities. Some form of identity is crucial to the evolution of blockchain applications, particularly governance systems like DAOs, to be resistant to attack. The governance projects which have not incorporated identity have leaned on [coin voting governance](https://vitalik.ca/general/2021/08/16/voting3.html), which has been widely criticized for misaligned incentives and conflicts of interest.

There have been some great attempts at identity, or more generally "proof of personhood" protocols, on the blockchain. This [recent review](https://arxiv.org/abs/2008.05300) lists some of them - among the most discussed are [Proof of Humanity](https://www.proofofhumanity.id/) and [BrightID](https://www.brightid.org/). Many of these projects have chosen to link Ethereum addresses to unique identities based on real names and social media profiles. However, the adoption of either of these public goods forces all participants to permanently link their Ethereum address to their real-world identity. For some users, this undermines the purpose of the blockchain; if identity is added to a transparent system, then privacy is completely removed.

Proof of Residency is a solution to proof of personhood which allows its participants to remain anonymous while proving they are unique. It is based on sending physical mail with a secret phrase and using a **commit-reveal scheme** to ensure that the recipient resides at the provided address. The physical address is kept private and names are not requested. The ERC-721 tokens which are minted are non-transferable, only burnable. Incentive structures are in place to ensure that participants are honest and minimize the chance of Sybil attacks.

## Commit-Reveal

![Outline](./outline-whitepaper.png)

### Step One: Commitment

First, in order to verify that a user resides at an address, we use multiple data points to reduce fraud. The user must input an address which they would like to prove residency at. They must then allow the dapp to request geolocation using the browser. This will provide the dapp with a longitude/latitude, which must be within 2km of the address which they input.

Once they choose to validate this mailing address, they will be asked to input a password which will be used as a "seed extension" for a BIP39 mnemonic phrase.

The mailing address + password payload is signed by the user and sent to the backend, which generates a BIP39 mnemonic and uses the password as the BIP39 passphrase to create a public/private keypair.

```typescript
// wallet address is the salt for hashing the password
const hashedPassword = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes(`${walletAddress}${password}`)
);
// generates a random mnemonic based on crypto.randomBytes
const mnemonic: string = bip39.generateMnemonic();
// uses the mnemonic and the password to generate a seed for a public/private key
const seedBuffer: Buffer = await bip39.mnemonicToSeed(mnemonic, hashedPassword);
const { publicKey, privateKey } = bip32.fromSeed(seedBuffer);
```

The `mnemonic` (without the user-provided `password`) is sent to a mail service (in the initial system this is [Lob](https://www.lob.com/)) and physical mail is triggered. The password ensures that the mail service does not have enough information to be able to recreate the private/public key, since they are never aware of the password. In addition, the API does not record the user's password, so there is no way to verify the user's original request if they forget their password.

_Note: Lob is a centralized API which allows physical mail to be sent from an API call. We use this initially as a core piece to our proofs, but acknowledge that the exposure to this service should be reduced. We take steps to mitigate risk and plan to reduce dependency on this service by eventually scaling out the [Committer Pool](#committer-pool)._

The generated `publicKey` is hashed alongside the wallet address and country ID (as well as a nonce to prevent replay attacks).

```typescript
const walletAddress = ethers.utils.verifyMessage(payload, signature);

const hash = ethers.utils.keccak256(
  ethers.utils.defaultAbiCoder.encode(
    ['address', 'uint256', 'string', 'uint256'],
    [walletAddress, countryId, publicKey, nonce]
  )
);
```

The commitment hash is signed by the committer, which has the credentials for a trusted EOA which has been granted the role of committer in the smart contract. This is passed to the dApp, which sends the signed payload to the smart contract. The contract verifies that the trusted EOA signed the commitment and stores the commitment on-chain. A nonce is included in the signature which is always updated from the smart contract upon every state change.

```solidity
function commitAddress(
  address to,
  bytes32 commitment,
  uint8 v,
  bytes32 r,
  bytes32 s
) external payable whenNotPaused nonReentrant {
  address signatory = _validateSignature(to, commitment, v, r, s);
  ...
}
```

The requester pays the gas fee as well as a minimal ETH amount to cover the [costs of sending a letter](https://www.lob.com/pricing/print-mail) and development costs of the platform (this is a variable cost set by the owner of the contract, ideally as low as possible). This also acts as a deterrent to fraud, as the user must pay this amount each time they request a commitment.

### Step Two: Reveal

Once the user receives the letter with the mnemonic, they now have all of the information they need to prove that they reside at the address in question. In the letter, are instructed to return back to the website and re-enter their country and the remaining BIP39 words (alongside their remembered password) to regenerate the public key. The public key and country ID are then sent with the user's wallet address to the smart contract. **There is a required time delay of one week between requesting and minting, for security of the system.** The user is instructed to return if it has not been one week. See [Known Attack Vectors](#known-attack-vectorstradeoffs) for more information.

The inputs are used to reconstruct the original commitment and it is verified to ensure that the public key (`commitment`) is the same as the original value.

```solidity
function mint(uint16 country, string memory commitment) external {
  Commitment memory existingCommitment = _commitments[msg.sender];

  require(
    existingCommitment.commitment ==
      keccak256(abi.encode(msg.sender, country, commitment, nonces[msg.sender])),
    'Commitment incorrect'
  );
  ...
}
```

If the commitment is valid, then a **non-transferable ERC-721 token** is minted with the country information. The requester pays the gas fees for minting. An ERC-721 token is issued with the metadata returned by an API, with plans to move to IPFS. The structure of this metadata follows [OpenSea's standards](https://docs.opensea.io/docs/metadata-standards), but is subject to change.

## Protocol Maintenance

There are some ancillary functions which can only be performed by the contract owner. The owner will initially be the Proof of Residency founding team and will migrate to be a DAO with community support.

### Adding/Removing a Committer

The contract has functionality to add and remove trusted committers from the project.

```solidity
function addCommitter(address newCommitter, address newTreasury) external onlyOwner { ... }
function removeCommitter(address removedCommitter) external onlyOwner { ... }
```

Eventually, when the DAO is created, this will allow the community to scale the commit-reveal scheme. These functions would be used by the [Committer Pool](#committer-pool) in the future.

### Token Challenges

The contract has the ability to issue "challenges" for a given set of token IDs. The challenge process would work in a similar way to the original token request - a token ID would be flagged as "challenged" and the requester would have to revalidate their proof of residency.

```solidity
function challenge(address[] memory addresses) external onlyOwner { ... }
```

If the token owner does not validate their proof, their token will be eligible for burning after 6 weeks.

```solidity
function burnFailedChallenges(address[] memory addresses) external onlyOwner {
  for (uint256 i = 0; i < addresses.length; i++) {
    require(tokenChallengeExpired(addresses[i]), 'Challenge not expired');
    ...
    _burn(tokenId);
  }
}
```

This function **burns all tokens corresponding to addresses which are input**. This would require every legitimate tokenholder to re-request and pay again - not an ideal scenario. However, it allows all fraud to be reversed and maintains the integrity of a compromised system.

There is also a public function for retrieving if a challenge exists for a given address.

```solidity
function tokenChallengeExists(address owner) public view returns (bool) { ... }
```

This allows a downstream project to know if there is an outstanding challenge for a given user. This allows protocols to choose whether they want to disallow users with outstanding challenges to participate in voting/governance, while others may not. The risk appetite of each downstream project would be the determining factor.

### Price Setting

There is an ability to set the price of the token. This is to allow the cost paid by the requester to scale up/down with the cost to the committer.

```solidity
function setPrice(uint256 newPrice) external onlyOwner { ... }
```

## Known Attack Vectors/Tradeoffs

1. The backend API is initially centralized, which requires trust in the maintainers of this project to continue to operate honestly when making commitments on-chain. If the backend EOA account is compromised or otherwise behaves in a detrimental way to the community, it could provide false commitments which could subsequently result in fraudulent Proof of Residency tokens. This could have massive, negative downstream effects for any project using the protocol. This is partially addressed by the required time delay of one week between commitment and minting. Also, the maintainers of this project are publicly listed on GitHub and easily tied to real-world identities, with accountability in place in case of fraud. This is more fully addressed below in [Future Goals](#future-goals).

2. A significant amount of trust is placed in Lob's mailing service, and while they aren't given all of the information to be able to generate the `commitment`, they could look at API logs and tie API requests to wallet addresses which interacted with the blockchain based on timestamps. See [Future Goals](#future-goals) for a solution to this.

3. A single malicious actor could generate `x` requests for `x` wallets with the same physical address. They would receive each of these letters and be able to mint `x` Proof of Residency tokens within one week of the initial requests. This is mitigated by rate limiting off-chain - requests for letters will start as limited to one every 60 seconds per IP address and one every four weeks per mailing address. See [Future Goals](#future-goals) for a solution to this.

4. A malicious actor could verify a wallet address with a proof of residency, and then sell this account to the highest bidder (since the NFTs themselves are non-transferable). However, this would mean that the seller is also in possession of a private key for the account, which would allow them to burn the token at any time and undermines the benefit.

## Future Goals

### Committer Pool

Since the commit-reveal process is performed off-chain, this allows for the project to scale proofs of residency **independent** of the on-chain code. A Committer Pool is a solution to scaling these proofs securely with community backing.

The proofs of residency would be performed by _randomly selected committers in a pool_. The pool would be selected, curated, and voted on by the community, then stored on-chain. The committers are responsible for physically mailing a letter **with/without depending on Lob**. This letter would include a mnemonic, similar to the current system. Once the recipient has received the letter and minted a Proof of Residency token, the committer is rewarded with a portion of the reservation price paid by the requester.

This reduces the necessity of trust in a single committer, since collusion between a random committer and the requester would need to exist to issue false commitments. The likelihood of collusion would decrease substantially with the size of the committer pool, and the desired pool size would be precalculated before launch of this initiative. If false commitments did begin appearing, there is a mechanism for the community to remove committers and challenge tokens they've historically issued.

### Token Challenges

The community would be responsible for challenging tokens to ensure that the community is kept free of fraudulent activity. The challenge process would work in a similar way to the original token request - a token ID would be flagged as "challenged" and the requester would have to revalidate their

### DAO Governance

1. A DAO will be formed with all participants having a vote based on their ERC721 `PORP` token (and possibly an ERC-20 token).

2. The Committer Pool EOA accounts will be voted on by the DAO, and could be removed by the DAO if they behave poorly. There is a financial incentive for the committer to continue to provide honest commitments.

3. The newly minted tokens and their corresponding hashed physical addresses would be monitored by the community. In cases of fraud, a vote by the DAO community would remove a committer account and burn all of the tokens it issued. This is an extreme disincentive for a committer to issue fraudulent commitments.

### Metadata Hardening

The current metadata is returned by an API, which presents issues for longevity and trust in the protocol. We would like to move towards storing the metadata in IPFS as each token is minted.
