# Proof of Residency Whitepaper

## Motivation

The web3 ecosystem has benefited from the anonymity and transparency of the underlying smart contracts. Many of the current protocols being developed are moving towards integrating real-world identity into web3, while maintaining privacy of the participating users.

Over the course of the next few decades, we will start realizing the benefits of decentralized proof of ownership, particularly in the real estate space. This project is a first step towards "Proof of Residency" - an initial attempt at proving someone resides in a geographic location, without revealing their exact location, or enough information to allow an external party to identify where the person resides.

## Approach

We employ ZK proofs to prove to a web3 application that a person resides in a geographical region.

Lob is a centralized service which allows physical mail to be sent from an API call. We use this as a core piece of the proof of residency, but acknowledge that the service could be compromised. We take steps to mitigate risk with their services, and plan to reduce dependency on this service by eventually incorporating other Address Verification services.

### User Residency Proof

First, in order to verify that a user resides at a longitude/latitude, we use multiple redundant services, to ensure that compromising one does not pose a risk of fraud. The user must first connect their wallet to the dapp, and then input an address which they would like to prove residency at. They must then allow the dapp to request geolocation using the browser. This will provide the dapp with a longitude/latitude, which must be within 500m of the address which they input.

If they choose to continue to validate this physical address, they will be asked to input a password which will be hashed and used as a "seed extension" for a BIP39 mnemonic phrase.

This password is sent to the centralized backend API, which generates a BIP39 mnemonic and uses the user-provided password as the BIP39 passphrase. This BIP39 mnemonic (without the user-provided password) is sent to Lob, while the BIP39 mnemonic + user-provided password is used to create a public/private keypair. Neither the private key nor password is stored in the centralized database.

The public key is then added to a Merkle tree alongside the city/state returned by Lob. The Merkle root is then computed and committed on-chain.

```json
[
  {
    "publicKey": "0x123...",
    "city": "Phoenix",
    "state": "AZ",
    "country": "USA"
  },
  ...
]
```

#### Mail

Once the user receives the mail with the BIP39 mnemonic, they now have all of the information they need to prove that they reside at the address in question. They can now use the remaining BIP39 words alongside their password to regenerate the private/public keypair.

They are instructed to return back to the website and enter in their BIP39 phrase/password, which is then used to regenerate the public key. The public key is then sent to the backend

### NFT

An NFT is then created with the

###

https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
http://s2geometry.io/
https://www.lob.com/address-verification
