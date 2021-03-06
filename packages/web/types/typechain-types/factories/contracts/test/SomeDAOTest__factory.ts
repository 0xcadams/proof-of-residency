/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  SomeDAOTest,
  SomeDAOTestInterface,
} from "../../../contracts/test/SomeDAOTest";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "proofOfResidencyAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "joinDao",
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
];

const _bytecode =
  "0x60a060405234801561001057600080fd5b506040516102fd3803806102fd83398101604081905261002f91610044565b60601b6001600160601b031916608052610074565b60006020828403121561005657600080fd5b81516001600160a01b038116811461006d57600080fd5b9392505050565b60805160601c6102656100986000396000818160ce015261016601526102656000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063dd61fc8914610030575b600080fd5b61003861004c565b604051901515815260200160405180910390f35b60006100566100ac565b8015610067575061006561014e565b155b6100a65760405162461bcd60e51b815260206004820152600c60248201526b4e6f7420616c6c6f7765642160a01b604482015260640160405180910390fd5b50600190565b6040516370a0823160e01b815233600482015260009081906001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906370a082319060240160206040518083038186803b15801561011057600080fd5b505afa158015610124573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101489190610216565b11905090565b604051632e449a6960e11b81523360048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690635c8934d29060240160206040518083038186803b1580156101b057600080fd5b505afa1580156101c4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101e891906101ed565b905090565b6000602082840312156101ff57600080fd5b8151801515811461020f57600080fd5b9392505050565b60006020828403121561022857600080fd5b505191905056fea264697066735822122030a95912bc4bcef32a7dbc3070fce44f17faade3827ffbf078a75f9e172a3b3a64736f6c63430008070033";

type SomeDAOTestConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SomeDAOTestConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SomeDAOTest__factory extends ContractFactory {
  constructor(...args: SomeDAOTestConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    proofOfResidencyAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<SomeDAOTest> {
    return super.deploy(
      proofOfResidencyAddress,
      overrides || {}
    ) as Promise<SomeDAOTest>;
  }
  override getDeployTransaction(
    proofOfResidencyAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(proofOfResidencyAddress, overrides || {});
  }
  override attach(address: string): SomeDAOTest {
    return super.attach(address) as SomeDAOTest;
  }
  override connect(signer: Signer): SomeDAOTest__factory {
    return super.connect(signer) as SomeDAOTest__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SomeDAOTestInterface {
    return new utils.Interface(_abi) as SomeDAOTestInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SomeDAOTest {
    return new Contract(address, _abi, signerOrProvider) as SomeDAOTest;
  }
}
