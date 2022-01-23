/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ProofOfResidency,
  ProofOfResidencyInterface,
} from "../ProofOfResidency";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "initialCommitter",
        type: "address",
      },
      {
        internalType: "address",
        name: "initialTreasury",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "committer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "commitment",
        type: "bytes32",
      },
    ],
    name: "CommitmentCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "committer",
        type: "address",
      },
    ],
    name: "CommitterAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "committer",
        type: "address",
      },
    ],
    name: "CommitterRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "newPrice",
        type: "uint256",
      },
    ],
    name: "PriceChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "COMMITMENT_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DOMAIN_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "VERSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newCommitter",
        type: "address",
      },
      {
        internalType: "address",
        name: "newTreasury",
        type: "address",
      },
    ],
    name: "addCommitter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "commitment",
        type: "bytes32",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "commitAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contractURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCommitmentValidAt",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "country",
        type: "uint256",
      },
    ],
    name: "getCurrentCountryCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "country",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "publicKey",
        type: "string",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "mintPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "removedCommitter",
        type: "address",
      },
    ],
    name: "removeCommitter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newPrice",
        type: "uint256",
      },
    ],
    name: "setPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162002c5838038062002c5883398101604081905262000034916200022a565b604080518082018252601b81527f50726f6f66206f66205265736964656e63792050726f746f636f6c00000000006020808301918252835180850190945260048452630504f52560e41b90840152815191929183918391620000999160009162000167565b508051620000af90600190602084019062000167565b5050600a805460ff1916905550620000cb91503390506200010d565b6001600b556001600160a01b039182166000908152600d6020526040902080546001600160a01b03191691909216179055661c6bf526340000600c556200029f565b600a80546001600160a01b03838116610100818102610100600160a81b031985161790945560405193909204169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b828054620001759062000262565b90600052602060002090601f016020900481019282620001995760008555620001e4565b82601f10620001b457805160ff1916838001178555620001e4565b82800160010185558215620001e4579182015b82811115620001e4578251825591602001919060010190620001c7565b50620001f2929150620001f6565b5090565b5b80821115620001f25760008155600101620001f7565b80516001600160a01b03811681146200022557600080fd5b919050565b600080604083850312156200023e57600080fd5b62000249836200020d565b915062000259602084016200020d565b90509250929050565b600181811c908216806200027757607f821691505b602082108114156200029957634e487b7160e01b600052602260045260246000fd5b50919050565b6129a980620002af6000396000f3fe60806040526004361061020f5760003560e01c80636817c76c116101185780639a3c0212116100a0578063c87b56dd1161006f578063c87b56dd14610612578063e8a3d48514610632578063e985e9c514610647578063f2fde38b14610690578063ffa1ad74146106b057600080fd5b80639a3c021214610595578063a22cb465146105b7578063b52831e3146105d7578063b88d4fde146105f757600080fd5b806377097fc8116100e757806377097fc8146105155780638456cb59146105285780638da5cb5b1461053d57806391b7f5ed1461056057806395d89b411461058057600080fd5b80636817c76c146104aa57806370a08231146104c0578063715018a6146104e0578063752edb9d146104f557600080fd5b80632f745c591161019b57806342966c681161016a57806342966c68146104055780634b930201146104255780634f6ccce7146104525780635c975abb146104725780636352211e1461048a57600080fd5b80632f745c591461039057806334702f03146103b05780633f4ba83a146103d057806342842e0e146103e557600080fd5b8063095ea7b3116101e2578063095ea7b3146102e557806318160ddd1461030757806320606b701461031c57806323b872dd146103505780632e1a7d4d1461037057600080fd5b806301ffc9a71461021457806304f032731461024957806306fdde031461028b578063081812fc146102ad575b600080fd5b34801561022057600080fd5b5061023461022f36600461254a565b6106dd565b60405190151581526020015b60405180910390f35b34801561025557600080fd5b5061027d7f314da02917ab2dc1057a54f9281f1dd3e542e525b1252a0196a71db6e4f5493f81565b604051908152602001610240565b34801561029757600080fd5b506102a06106ee565b60405161024091906126ec565b3480156102b957600080fd5b506102cd6102c8366004612584565b610780565b6040516001600160a01b039091168152602001610240565b3480156102f157600080fd5b50610305610300366004612520565b61081a565b005b34801561031357600080fd5b5060085461027d565b34801561032857600080fd5b5061027d7f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81565b34801561035c57600080fd5b5061030561036b3660046123d6565b610930565b34801561037c57600080fd5b5061030561038b366004612584565b610989565b34801561039c57600080fd5b5061027d6103ab366004612520565b610b76565b3480156103bc57600080fd5b506103056103cb366004612388565b610c0c565b3480156103dc57600080fd5b50610305610c8b565b3480156103f157600080fd5b506103056104003660046123d6565b610cc5565b34801561041157600080fd5b50610305610420366004612584565b610d22565b34801561043157600080fd5b5061027d610440366004612584565b6000908152600f602052604090205490565b34801561045e57600080fd5b5061027d61046d366004612584565b610d9d565b34801561047e57600080fd5b50600a5460ff16610234565b34801561049657600080fd5b506102cd6104a5366004612584565b610e30565b3480156104b657600080fd5b5061027d600c5481565b3480156104cc57600080fd5b5061027d6104db366004612388565b610ea7565b3480156104ec57600080fd5b50610305610f2e565b34801561050157600080fd5b506103056105103660046123a3565b610f68565b61027d61052336600461259d565b610ff3565b34801561053457600080fd5b5061030561126c565b34801561054957600080fd5b50600a5461010090046001600160a01b03166102cd565b34801561056c57600080fd5b5061030561057b366004612584565b6112a4565b34801561058c57600080fd5b506102a0611307565b3480156105a157600080fd5b50336000908152600e602052604090205461027d565b3480156105c357600080fd5b506103056105d236600461248e565b611316565b3480156105e357600080fd5b506103056105f23660046124ca565b611325565b34801561060357600080fd5b50610305610400366004612412565b34801561061e57600080fd5b506102a061062d366004612584565b6114ca565b34801561063e57600080fd5b506102a06115a5565b34801561065357600080fd5b506102346106623660046123a3565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b34801561069c57600080fd5b506103056106ab366004612388565b6115d3565b3480156106bc57600080fd5b506102a0604051806040016040528060018152602001603160f81b81525081565b60006106e882611671565b92915050565b6060600080546106fd90612842565b80601f016020809104026020016040519081016040528092919081815260200182805461072990612842565b80156107765780601f1061074b57610100808354040283529160200191610776565b820191906000526020600020905b81548152906001019060200180831161075957829003601f168201915b5050505050905090565b6000818152600260205260408120546001600160a01b03166107fe5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600460205260409020546001600160a01b031690565b600061082582610e30565b9050806001600160a01b0316836001600160a01b031614156108935760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084016107f5565b336001600160a01b03821614806108af57506108af8133610662565b6109215760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c000000000000000060648201526084016107f5565b61092b8383611696565b505050565b60405162461bcd60e51b815260206004820152602860248201527f455243373231526561644f6e6c793a207472616e7366657246726f6d206e6f7460448201526708185b1b1bddd95960c21b60648201526084016107f5565b336000908152600d60205260409020546001600160a01b03166109ee5760405162461bcd60e51b815260206004820152601960248201527f43616c6c6572206973206e6f74206120636f6d6d69747465720000000000000060448201526064016107f5565b6002600b541415610a415760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016107f5565b6002600b5533600090815260106020526040902054811115610aa55760405162461bcd60e51b815260206004820152601f60248201527f5769746864726177616c20616d6f756e74206e6f7420617661696c61626c650060448201526064016107f5565b3360009081526010602052604081208054839290610ac49084906127fb565b9091555050336000908152600d60205260408082205490516001600160a01b039091169083908381818185875af1925050503d8060008114610b22576040519150601f19603f3d011682016040523d82523d6000602084013e610b27565b606091505b5050905080610b6d5760405162461bcd60e51b8152602060048201526012602482015271556e61626c6520746f20776974686472617760701b60448201526064016107f5565b50506001600b55565b6000610b8183610ea7565b8210610be35760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b60648201526084016107f5565b506001600160a01b03919091166000908152600660209081526040808320938352929052205490565b600a546001600160a01b03610100909104163314610c3c5760405162461bcd60e51b81526004016107f59061277b565b6001600160a01b0381166000818152600d602052604080822080546001600160a01b0319169055517f117c88ce0db1154655f2e289ef1695d90636689127cff2dd8090af544cf6c2b79190a250565b600a546001600160a01b03610100909104163314610cbb5760405162461bcd60e51b81526004016107f59061277b565b610cc3611704565b565b60405162461bcd60e51b815260206004820152602c60248201527f455243373231526561644f6e6c793a20736166655472616e7366657246726f6d60448201526b081b9bdd08185b1b1bddd95960a21b60648201526084016107f5565b610d2c3382611797565b610d915760405162461bcd60e51b815260206004820152603060248201527f4552433732314275726e61626c653a2063616c6c6572206973206e6f74206f7760448201526f1b995c881b9bdc88185c1c1c9bdd995960821b60648201526084016107f5565b610d9a8161188e565b50565b6000610da860085490565b8210610e0b5760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b60648201526084016107f5565b60088281548110610e1e57610e1e6128ee565b90600052602060002001549050919050565b6000818152600260205260408120546001600160a01b0316806106e85760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b60648201526084016107f5565b60006001600160a01b038216610f125760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b60648201526084016107f5565b506001600160a01b031660009081526003602052604090205490565b600a546001600160a01b03610100909104163314610f5e5760405162461bcd60e51b81526004016107f59061277b565b610cc36000611935565b600a546001600160a01b03610100909104163314610f985760405162461bcd60e51b81526004016107f59061277b565b6001600160a01b038281166000818152600d602052604080822080546001600160a01b03191694861694909417909355915190917f77b15bf1925eb6403cdcd3a6b7df1451a6e970b6c273dd573b3b5335fef5a7f991a25050565b6000611001600a5460ff1690565b1561101e5760405162461bcd60e51b81526004016107f590612751565b6002600b5414156110715760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016107f5565b6002600b55336000908152600e60205260409020600c5434146110cb5760405162461bcd60e51b8152602060048201526012602482015271125b98dbdc9c9958dd08115512081cd95b9d60721b60448201526064016107f5565b3384846040516020016110e0939291906126bc565b604051602081830303815290604052805190602001208160020154146111485760405162461bcd60e51b815260206004820152601760248201527f436f6d6d69746d656e7420697320696e636f727265637400000000000000000060448201526064016107f5565b805442101561118b5760405162461bcd60e51b815260206004820152600f60248201526e10d85b9b9bdd081b5a5b9d081e595d608a1b60448201526064016107f5565b80600101544211156111d45760405162461bcd60e51b815260206004820152601260248201527110dbdb5b5a5d1b595b9d08195e1c1a5c995960721b60448201526064016107f5565b60038101546001600160a01b0316600090815260106020526040812080543492906112009084906127b0565b90915550506000848152600f602052604081208054600192906112249084906127b0565b90915550506000848152600f602052604081205461124966038d7ea4c68000876127dc565b61125391906127b0565b905061125f338261198f565b6001600b55949350505050565b600a546001600160a01b0361010090910416331461129c5760405162461bcd60e51b81526004016107f59061277b565b610cc36119a9565b600a546001600160a01b036101009091041633146112d45760405162461bcd60e51b81526004016107f59061277b565b600c81905560405181907fa6dc15bdb68da224c66db4b3838d9a2b205138e8cff6774e57d0af91e196d62290600090a250565b6060600180546106fd90612842565b611321338383611a01565b5050565b600a5460ff16156113485760405162461bcd60e51b81526004016107f590612751565b60006113578686868686611ad0565b6001600160a01b038082166000908152600d6020526040902054919250166113c15760405162461bcd60e51b815260206004820152601c60248201527f5369676e61746f7279206973206e6f74206120636f6d6d69747465720000000060448201526064016107f5565b6001600160a01b0386166000908152600e60205260409020600281015415806113ed5750806001015442115b6114395760405162461bcd60e51b815260206004820152601f60248201527f4164647265737320686173206578697374696e6720636f6d6d69746d656e740060448201526064016107f5565b6003810180546001600160a01b0319166001600160a01b0384161790556114634262093a806127b0565b815561147242625c49006127b0565b6001820155600281018690556040518681526001600160a01b0383811691908916907fffaf5ade9a72747e20b851f075f08e02c2586f9e4aec537be3fad850c040e2679060200160405180910390a350505050505050565b6000818152600260205260409020546060906001600160a01b03166115495760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b60648201526084016107f5565b6000611553611c79565b90506000815111611573576040518060200160405280600081525061159e565b8061157d84611c99565b60405160200161158e929190612624565b6040516020818303038152906040525b9392505050565b60606115af611c79565b6040516020016115bf9190612653565b604051602081830303815290604052905090565b600a546001600160a01b036101009091041633146116035760405162461bcd60e51b81526004016107f59061277b565b6001600160a01b0381166116685760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016107f5565b610d9a81611935565b60006001600160e01b0319821663780e9d6360e01b14806106e857506106e882611d97565b600081815260046020526040902080546001600160a01b0319166001600160a01b03841690811790915581906116cb82610e30565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600a5460ff1661174d5760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b60448201526064016107f5565b600a805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6000818152600260205260408120546001600160a01b03166118105760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084016107f5565b600061181b83610e30565b9050806001600160a01b0316846001600160a01b031614806118565750836001600160a01b031661184b84610780565b6001600160a01b0316145b8061188657506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b949350505050565b600061189982610e30565b90506118a781600084611de7565b6118b2600083611696565b6001600160a01b03811660009081526003602052604081208054600192906118db9084906127fb565b909155505060008281526002602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b600a80546001600160a01b03838116610100818102610100600160a81b031985161790945560405193909204169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b611321828260405180602001604052806000815250611e15565b600a5460ff16156119cc5760405162461bcd60e51b81526004016107f590612751565b600a805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25861177a3390565b816001600160a01b0316836001600160a01b03161415611a635760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016107f5565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6000807f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f611afc6106ee565b805160209182012060408051808201825260018152603160f81b90840152805180840194909452838101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608401524660808401523060a0808501919091528151808503909101815260c0840182528051908301207f314da02917ab2dc1057a54f9281f1dd3e542e525b1252a0196a71db6e4f5493f60e08501526001600160a01b038b166101008501526101208085018b90528251808603909101815261014085019092528151919092012061190160f01b61016084015261016283018290526101828301819052909250906000906101a20160408051601f198184030181528282528051602091820120600080855291840180845281905260ff8b169284019290925260608301899052608083018890529092509060019060a0016020604051602081039080840390855afa158015611c60573d6000803e3d6000fd5b5050604051601f1901519b9a5050505050505050505050565b606060405180608001604052806043815260200161293160439139905090565b606081611cbd5750506040805180820190915260018152600360fc1b602082015290565b8160005b8115611ce75780611cd18161287d565b9150611ce09050600a836127c8565b9150611cc1565b60008167ffffffffffffffff811115611d0257611d02612904565b6040519080825280601f01601f191660200182016040528015611d2c576020820181803683370190505b5090505b841561188657611d416001836127fb565b9150611d4e600a86612898565b611d599060306127b0565b60f81b818381518110611d6e57611d6e6128ee565b60200101906001600160f81b031916908160001a905350611d90600a866127c8565b9450611d30565b60006001600160e01b031982166380ac58cd60e01b1480611dc857506001600160e01b03198216635b5e139f60e01b145b806106e857506301ffc9a760e01b6001600160e01b03198316146106e8565b600a5460ff1615611e0a5760405162461bcd60e51b81526004016107f590612751565b61092b838383611e48565b611e1f8383611e53565b611e2c6000848484611fa1565b61092b5760405162461bcd60e51b81526004016107f5906126ff565b61092b8383836120ae565b6001600160a01b038216611ea95760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f206164647265737360448201526064016107f5565b6000818152600260205260409020546001600160a01b031615611f0e5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016107f5565b611f1a60008383611de7565b6001600160a01b0382166000908152600360205260408120805460019290611f439084906127b0565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b60006001600160a01b0384163b156120a357604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290611fe590339089908890889060040161267f565b602060405180830381600087803b158015611fff57600080fd5b505af192505050801561202f575060408051601f3d908101601f1916820190925261202c91810190612567565b60015b612089573d80801561205d576040519150601f19603f3d011682016040523d82523d6000602084013e612062565b606091505b5080516120815760405162461bcd60e51b81526004016107f5906126ff565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050611886565b506001949350505050565b6001600160a01b0383166121095761210481600880546000838152600960205260408120829055600182018355919091527ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee30155565b61212c565b816001600160a01b0316836001600160a01b03161461212c5761212c8382612166565b6001600160a01b0382166121435761092b81612203565b826001600160a01b0316826001600160a01b03161461092b5761092b82826122b2565b6000600161217384610ea7565b61217d91906127fb565b6000838152600760205260409020549091508082146121d0576001600160a01b03841660009081526006602090815260408083208584528252808320548484528184208190558352600790915290208190555b5060009182526007602090815260408084208490556001600160a01b039094168352600681528383209183525290812055565b600854600090612215906001906127fb565b6000838152600960205260408120546008805493945090928490811061223d5761223d6128ee565b90600052602060002001549050806008838154811061225e5761225e6128ee565b6000918252602080832090910192909255828152600990915260408082208490558582528120556008805480612296576122966128d8565b6001900381819060005260206000200160009055905550505050565b60006122bd83610ea7565b6001600160a01b039093166000908152600660209081526040808320868452825280832085905593825260079052919091209190915550565b600067ffffffffffffffff8084111561231157612311612904565b604051601f8501601f19908116603f0116810190828211818310171561233957612339612904565b8160405280935085815286868601111561235257600080fd5b858560208301376000602087830101525050509392505050565b80356001600160a01b038116811461238357600080fd5b919050565b60006020828403121561239a57600080fd5b61159e8261236c565b600080604083850312156123b657600080fd5b6123bf8361236c565b91506123cd6020840161236c565b90509250929050565b6000806000606084860312156123eb57600080fd5b6123f48461236c565b92506124026020850161236c565b9150604084013590509250925092565b6000806000806080858703121561242857600080fd5b6124318561236c565b935061243f6020860161236c565b925060408501359150606085013567ffffffffffffffff81111561246257600080fd5b8501601f8101871361247357600080fd5b612482878235602084016122f6565b91505092959194509250565b600080604083850312156124a157600080fd5b6124aa8361236c565b9150602083013580151581146124bf57600080fd5b809150509250929050565b600080600080600060a086880312156124e257600080fd5b6124eb8661236c565b945060208601359350604086013560ff8116811461250857600080fd5b94979396509394606081013594506080013592915050565b6000806040838503121561253357600080fd5b61253c8361236c565b946020939093013593505050565b60006020828403121561255c57600080fd5b813561159e8161291a565b60006020828403121561257957600080fd5b815161159e8161291a565b60006020828403121561259657600080fd5b5035919050565b600080604083850312156125b057600080fd5b82359150602083013567ffffffffffffffff8111156125ce57600080fd5b8301601f810185136125df57600080fd5b6125ee858235602084016122f6565b9150509250929050565b60008151808452612610816020860160208601612812565b601f01601f19169290920160200192915050565b60008351612636818460208801612812565b83519083019061264a818360208801612812565b01949350505050565b60008251612665818460208701612812565b6718dbdb9d1c9858dd60c21b920191825250600801919050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906126b2908301846125f8565b9695505050505050565b60018060a01b03841681528260208201526060604082015260006126e360608301846125f8565b95945050505050565b60208152600061159e60208301846125f8565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60208082526010908201526f14185d5cd8589b194e881c185d5cd95960821b604082015260600190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b600082198211156127c3576127c36128ac565b500190565b6000826127d7576127d76128c2565b500490565b60008160001904831182151516156127f6576127f66128ac565b500290565b60008282101561280d5761280d6128ac565b500390565b60005b8381101561282d578181015183820152602001612815565b8381111561283c576000848401525b50505050565b600181811c9082168061285657607f821691505b6020821081141561287757634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415612891576128916128ac565b5060010190565b6000826128a7576128a76128c2565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b031981168114610d9a57600080fdfe697066733a2f2f62616679626569687262693667687278636b647a6c69747570776e787a69636f637266657571716f61766b747870376f727577326262656a6468752fa2646970667358221220236fc3a5a3adc0a44734dcb591078992a392700d16d4aad789f6ddd42fc5faf164736f6c63430008070033";

type ProofOfResidencyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ProofOfResidencyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ProofOfResidency__factory extends ContractFactory {
  constructor(...args: ProofOfResidencyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    initialCommitter: string,
    initialTreasury: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ProofOfResidency> {
    return super.deploy(
      initialCommitter,
      initialTreasury,
      overrides || {}
    ) as Promise<ProofOfResidency>;
  }
  getDeployTransaction(
    initialCommitter: string,
    initialTreasury: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      initialCommitter,
      initialTreasury,
      overrides || {}
    );
  }
  attach(address: string): ProofOfResidency {
    return super.attach(address) as ProofOfResidency;
  }
  connect(signer: Signer): ProofOfResidency__factory {
    return super.connect(signer) as ProofOfResidency__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ProofOfResidencyInterface {
    return new utils.Interface(_abi) as ProofOfResidencyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ProofOfResidency {
    return new Contract(address, _abi, signerOrProvider) as ProofOfResidency;
  }
}
