// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol';

/// @author The Proof of Residency Team
/// @title Proof of Residency NFT
/// @custom:security-contact security@proofofresidency.xyz
contract ProofOfResidency is ERC721, ERC721URIStorage, Pausable, Ownable, ERC721Burnable {
  constructor() ERC721('ProofOfResidency', 'POR') {}

  function _baseURI() internal pure override returns (string memory) {
    return 'ipfs://bafybeifzeyr3akxwvj35fvqenzezkl3ecmyuewkdojvflltnc7omr7k5c4/';
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function safeMint(
    address to,
    uint256 tokenId,
    string memory uri
  ) public onlyOwner {
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override whenNotPaused {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  // The following functions are overrides required by Solidity.

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }
}
