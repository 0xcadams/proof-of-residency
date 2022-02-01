// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

/**
 * @title ERC721 Non-Transferable Token
 * @custom:security-contact security@proofofresidency.xyz
 * @dev A non-transferable, burnable, enumerable ERC721 token.
 *
 * This does not override functions like {approve} or {setApprovalForAll}, since
 * other modules like ERC721Burnable use these to manage burning permissions.
 * Internal functions will be optimized out by the compiler.
 */
abstract contract ERC721NonTransferable is ERC721, ERC721Burnable, ERC721Enumerable {
  constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

  function transferFrom(
    address,
    address,
    uint256
  ) public pure override {
    revert('ERC721NonTransferable: transferFrom not allowed');
  }

  function safeTransferFrom(
    address,
    address,
    uint256
  ) public pure override {
    revert('ERC721NonTransferable: safeTransferFrom not allowed');
  }

  function safeTransferFrom(
    address,
    address,
    uint256,
    bytes memory
  ) public pure override {
    revert('ERC721NonTransferable: safeTransferFrom not allowed');
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  // The following functions are overrides required by Solidity.

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
