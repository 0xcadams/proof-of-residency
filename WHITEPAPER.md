# Proof of Residency Whitepaper

_Last updated: Feb 3, 2022_

## Motivation

The web3 ecosystem has benefited from the anonymity and transparency of the underlying smart contracts. This has allowed for blockchains to support complex systems like finance and governance without the need for identity. A system which is always anonymous naturally has another property - vulnerability to Sybil attacks from malicious actors who subvert the service's reputation system. If an actor is always anonymous, with no distinguishing identifiers, there is no distinction between many people and one person creating many pseudonymous identities. Some form of identity is crucial to the evolution of blockchain applications, particularly governance systems like DAOs, to be resistant to attack. The governance projects which have not incorporated identity have leaned on [coin voting governance](https://vitalik.ca/general/2021/08/16/voting3.html), which has been widely criticized for misaligned incentives and conflicts of interest.

There have been some great attempts at identity, or more generally "proof of personhood" protocols, on the blockchain. This [recent review](https://arxiv.org/abs/2008.05300) lists some of them - among the most discussed are [Proof of Humanity](https://www.proofofhumanity.id/) and [BrightID](https://www.brightid.org/). Many of these projects have chosen to link Ethereum addresses to unique identities based on real names and social media profiles. However, the adoption of either of these public goods forces all participants to permanently link their Ethereum address to their real-world identity. For some users, this undermines the purpose of the blockchain; if identity is added to a transparent system, then privacy is completely removed.

Proof of Residency is a solution to proof of personhood which allows its participants to remain anonymous while proving they are unique. It is based on sending physical mail with a secret phrase and using a **commit-reveal scheme** to ensure that the recipient resides at the provided address. The physical address is kept private and names are not requested. The ERC-721 tokens which are minted are non-transferable, only burnable. Incentive structures are in place to ensure that participants are honest and minimize the chance of Sybil attacks.

## Proof of Residency

![Outline](./outline-whitepaper.png)

### Step One: Commitment

First, in order to verify that a user resides at an address, we use geolocation to reduce fraud (however, this could be easily bypassed). The user must input an address which they would like to prove residency at. They must then allow the dapp to request geolocation using the browser. This will provide the dapp with a longitude/latitude, which must be within 10 kilometers of the address which they input.

The mailing address is sent to a Committer, which validates with the Mail Service that it is a deliverable address and signs a payload with all of the address components (`SIGNED_MAILING_ADD`). The user then has a chance to review any corrections made to the address they input.

They then enter a password (this password will be used under the hood as a "seed extension" for a BIP39 mnemonic phrase). The password is hashed (with their wallet address as a salt) and this `hashedPassword` is signed by the user alongside the user's wallet address and a nonce (to create `SIGNED_PASSWORD`). The nonce prevents any replay attacks from another user who manages to steal a `SIGNED_PASSWORD` from another user.

```typescript
// wallet address is the salt for hashing the password
const hashedPassword = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes(`${walletAddress}${password}`)
);
const passwordPayload: SubmitAddressPasswordPayload = {
  hashedPassword,
  walletAddress,
  nonce
};
const signedPassword = await signPasswordEip712(passwordPayload);
```

The original `SIGNED_MAILING_ADD` payload and `SIGNED_PASSWORD` are passed to the Committer, who validates that the mailing address signer is a Committer and derives the `walletAddress` from the signed password payload. This prevents a user from fraudulently sending random addresses to a Committer which have not been verified as "deliverable".

The Committer then generates a securely random BIP39 mnemonic and uses the password as the BIP39 passphrase to create a public/private keypair.

```typescript
// generates a random mnemonic based on crypto.randomBytes
const mnemonic: string = bip39.generateMnemonic();
// uses the mnemonic and the hashed password to generate a seed for a public/private key
const seedBuffer: Buffer = await bip39.mnemonicToSeed(mnemonic, hashedPassword);
const { publicKey, privateKey } = bip32.fromSeed(seedBuffer);
```

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

The commitment hash is signed by the Committer (to create `SIGNED_COMMITMENT`), which has the credentials for a trusted EOA which has been granted the role of Committer in the smart contract.

The `mnemonic` (without the `password`) is sent to a Mail Service (in the initial system this is [Lob](https://www.lob.com/)) and physical mail is sent. The password ensures that the Mail Service does not have enough information to be able to recreate the private/public key. In addition, the Committer does not record the user's password, so there is no way to verify the user's original request if they forget their password.

> Lob is a centralized API which allows physical mail to be sent from an API call. We use this initially as a core piece to our proofs, but acknowledge that the exposure to this service should be reduced. We take steps to mitigate risk and plan to reduce dependency on this service by eventually scaling out the [Committer Pool](#committer-pool).

Also, the mailing address components are hashed and stored in a temporary Redis database, with the key as the hashed mailing address and value as the current timestamp. See [Known Attack Vectors](#known-attack-vectorstradeoffs) for more information on why we do this.

```typescript
const hashedMailingAddress = ethers.utils.keccak256(
  ethers.utils.defaultAbiCoder.encode(
    ['string', 'string', 'string', 'string', 'string', 'string'],
    [
      body.addressPayload.addressLine1,
      body.addressPayload.addressLine2,
      body.addressPayload.city,
      body.addressPayload.state,
      body.addressPayload.postal,
      body.addressPayload.country
    ]
  )
);
await sendLetter(body.addressPayload, keygen.mnemonic, requesterAddress);
await setRedis(hashedMailingAddress, Date.now());
```

The commitment hash is then returned to the dApp, which can then send the signed payload to the smart contract. The contract verifies that the trusted EOA signed the commitment and stores the commitment on-chain. A `nonce` is included in the signature which is always updated from the smart contract upon every state change.

```solidity
function commitAddress(
  address to,
  bytes32 commitment,
  uint8 v,
  bytes32 r,
  bytes32 s
) external payable whenNotPaused nonReentrant {
  bytes32 structHash = keccak256(abi.encode(COMMITMENT_TYPEHASH, to, commitment, nonces[to]));
  bytes32 digest = keccak256(abi.encodePacked('\x19\x01', _domainSeparator, structHash));
  address signatory = ecrecover(digest, v, r, s);

  // require that the signatory is actually a committer
  require(_committers[signatory], 'Signatory non-committer');
  ...
}
```

The requester pays the gas fee as well as a minimal ETH amount to cover the [costs of sending the letter](https://www.lob.com/pricing/print-mail) and development costs of the platform (a variable cost set by the owner/eventual DAO, ideally as low as possible). This also acts as a deterrent to fraud/general laziness, as the user must pay this amount each time they request a commitment.

### Step Two: Reveal

Once the user receives the letter with the mnemonic, they now have all of the information they need to prove that they reside at the address they requested. In the letter, are instructed to return back to the website and re-enter their country and the remaining BIP39 words (alongside their password which they definitely didn't forget) to regenerate the public key. The public key and country ID are then sent to the smart contract. **There is a required time delay of one week between requesting and minting, for security of the system.** The user is instructed to return if it has not been one week. See [Known Attack Vectors](#known-attack-vectorstradeoffs) for more information.

The inputs are used to reconstruct the original commitment and it is verified to ensure that the public key (`commitment`) is the same as the original value.

```solidity
function mint(uint16 country, string memory commitment) external whenNotPaused nonReentrant {
  // requires the requester to have no tokens - they cannot transfer, but may have burned a previous token
  require(balanceOf(_msgSender()) == 0, 'Already owns token');
  Commitment memory existingCommitment = _commitments[msg.sender];

  require(
    existingCommitment.commitment ==
      keccak256(abi.encode(msg.sender, country, commitment, nonces[msg.sender])),
    'Commitment incorrect'
  );
  ...
}
```

If the commitment is valid, a few things happen:

- A **non-transferable ERC-721 token** is minted with the country information. The requester pays only the gas fees for minting. The metadata is returned by an API, with plans to move to IPFS. The structure of this metadata follows [OpenSea's standards](https://docs.opensea.io/docs/metadata-standards), but is subject to change.
- The Committer's "contributions" amount is increased by the value originally paid by the requester. **They can withdraw this amount (minus fees) after the timelock expires in one week.**

The requester now has an ERC-721 associated with their account, with only the country ID as identifiable information! They can now participate in decentralized communities and other downstream projects with increased trust.

## Protocol Maintenance API

There are some ancillary functions which can only be performed by the contract owner. The owner will initially be a Gnosis wallet with the Proof of Residency founding team and will migrate to be a DAO with community support.

### Adding/Removing Committers

Eventually, when the DAO is created, this will allow the community to scale the commit-reveal scheme. These functions will be used to add/remove from the [Committer Pool](#committer-pool). Until then, this mapping will only contain the original Committer EOA account which is controlled by the founding team.

#### Adding a Committer

The contract has functionality to add trusted Committers from the project. They can then sign commitments which can be used to mint tokens.

```solidity
function addCommitter(address newCommitter, address newTreasury) external onlyOwner { ... }
```

#### Removing a Committer

Committers can also be removed by the owner. There is a `forceReclaim` boolean which allows the owner to opt-in to forcing the funds to be moved to the project treasury. This would be used in extreme cases, where a Committer was found to be dishonest.

```solidity
function removeCommitter(address removedCommitter, bool forceReclaim) external onlyOwner { ... }
```

### Challenging Tokens

The contract has the ability to issue "challenges" for a given set of wallet addresses. The challenge process will work in a similar way to the original token request - a token ID will be flagged as "challenged" and the requester would have to re-request their proof of residency.

```solidity
function challenge(address[] memory addresses) external onlyOwner { ... }
```

If the token owner does not re-validate their proof, their token will be eligible for burning by the owner after 6 weeks.

```solidity
function burnFailedChallenges(address[] memory addresses) external onlyOwner {
  for (uint256 i = 0; i < addresses.length; i++) {
    require(tokenChallengeExpired(addresses[i]), 'Challenge not expired');
    ...
    _burn(tokenId);
  }
}
```

This **burns all tokens corresponding to addresses which are input**. This would require every legitimate tokenholder to re-request and pay again - not an ideal scenario. However, it allows fraud to be reversed and maintains the integrity of the system.

There are also public functions for retrieving if a challenge exists or is expired for a given wallet address.

```solidity
function tokenChallengeExists(address owner) public view returns (bool) { ... }

function tokenChallengeExpired(address owner) public view returns (bool) { ... }
```

This function, as well as the included ERC-721 API, allows a downstream project to know if there is an outstanding challenge for a given user. See the [README](./README.md) for an example DAO using these functions.

### Reclaiming Failed Commitment Funds

The owner of the contract is able to reclaim failed commitment funds, in the case of the requester never acting on/receiving their commitment letter (or, in the worst case, a Committer not following through at all with sending a letter to a requester). This allows the treasury to withdraw the funds without them being locked in the contract forever. They can only be withdrawn **after the commitment has expired.**

```solidity
function reclaimExpiredContributions(address[] memory unclaimedAddresses) external onlyOwner { ... }
```

### Price Setting

There is an ability to set the price of the token. This is to allow the cost paid by the requester to scale up/down with the cost to the Committer, to continue to incentivize honest commitments.

```solidity
function setPrice(uint256 newPrice) external onlyOwner { ... }
```

## Committer Pool Member API

See [Future Goals](#future-goals) for more details on Committer Pools.

### Withdrawing

A Committer can withdraw their "contributions" amount, after the timelock expires for their earned funds (one week after their latest successful contribution - this could be a long time, and would essentially require a Committer to be inactive to withdraw). Their withdrawal is deducted by the amount of fees associated with payments to the protocol and donations to charity.

```solidity
function withdraw() external nonReentrant { ... }
```

## Known Attack Vectors/Tradeoffs

1. The Committers are initially comprised of only one EOA account, which requires trust in the maintainers of this project to continue to operate honestly when making commitments on-chain. If the EOA account is compromised or otherwise behaves in a detrimental way to the community, it could provide false commitments which could subsequently result in fraudulent Proof of Residency tokens. This could have massive, negative downstream effects for any project using the protocol. This is partially addressed by the required time delay of one week between commitment and minting. Also, the maintainers of this project are publicly listed on GitHub and easily tied to real-world identities for accountability. This is more fully addressed below in [Future Goals](#future-goals).

2. A significant amount of trust is initially placed in Lob's mailing service, and while they aren't given all of the information to be able to generate the `commitment`, they could look at API logs and tie API requests to wallet addresses which interacted with the contract based on timestamps. See [Future Goals](#future-goals) for a solution to this.

3. A single malicious actor could hypothetically generate `x` requests for `x` wallets with the same physical address (their own). Or, they could even use a family member's/friend's address. They would receive each of these letters and be able to mint `x` Proof of Residency tokens. We do not store mailing addresses on-chain due to security concerns. However, this is mitigated by rate limiting off-chain - the mailing addresses are hashed before being stored in Redis, and requests for signed commitments are initially limited to one every four weeks per mailing address. This can be monitored and evolve off-chain. See [Future Goals](#future-goals) for a solution to this.

4. A malicious actor could verify a wallet address with a proof of residency, and then sell this account to the highest bidder (since the NFTs themselves are non-transferable). However, this would mean that the seller is also in possession of a private key for the account, which would allow them to burn the token at any time and undermines the benefit. Also, the tokens could be challenged at any time, disincentivizing this behavior.

5. A requester can leave the website after requesting a Committer signs a commitment and sends a letter. The Committer would lose the cost associated with the mail, and the requester would receive invalid mail. This is initially mitigated by the cost of requesting, since it is initially higher than the actual cost of project maintenance. See [Future Goals](#future-goals) for a solution to this.

6.

## Future Goals

### Event-Based Letter Sending

In order to mitigate #5 in [Known Attack Vectors/Tradeoffs](#known-attack-vectorstradeoffs), the sending of letters can be abstracted into an event-based service. It could be as simple as a Redis-based queue which clears after a certain threshold (2 hours) which has a key of requester's `to` address and value of `mnemonic`. The Committers can listen for the `CommitmentCreated(to, signatory, commitment)` event to be emitted, and send letters based on this. The `mnemonic` is not enough information to recreate the `publicKey` used in the commitment and can be safely stored temporarily in a DB, since there is a BIP39 password extension.

### Committer Pool

Since the commit-reveal process is performed off-chain, this allows for the project to scale proofs of residency **independent** of the on-chain code. A Committer Pool is a solution to scaling these proofs securely with community backing.

The proofs of residency would be performed by _randomly selected Committers in a pool_. The pool would be selected, curated, and voted on by the community, then stored on-chain. The Committers are responsible for physically mailing a letter **with/without depending on Lob**. This letter would include a mnemonic, similar to the current system. Once the recipient has received the letter and minted a Proof of Residency token, the Committer is rewarded with a portion of the reservation price paid by the requester.

This reduces the necessity of trust in a single Committer, since collusion between a random Committer and the requester would need to exist to issue false commitments. The likelihood of collusion would decrease substantially with the size of the Committer pool, and the desired pool size would be precalculated before launch of this initiative. If false commitments did begin appearing, there is a mechanism for the community to remove Committers and challenge tokens they've historically issued.

### DAO Governance

1. A DAO will be formed with all participants having a vote based on their ERC721 `PORP` token (and possibly an ERC-20 token).

2. The Committer Pool EOA accounts will be voted on by the DAO, and could be removed by the DAO if they behave poorly. There is a financial incentive for the Committer to continue to provide honest commitments.

3. The newly minted tokens and their corresponding hashed physical addresses would be monitored by the community. In cases of fraud, a vote by the DAO community would remove a Committer account and burn all of the tokens it issued. This is an extreme disincentive for a Committer to issue fraudulent commitments.

### Token Challenges

The community would be responsible for challenging tokens to ensure that the community is kept free of fraudulent activity. The challenge process is documented above.

### Metadata Hardening

The current metadata is returned by an API, which presents issues for longevity and trust in the protocol. We would like to move towards storing the metadata in IPFS as each token is minted.
