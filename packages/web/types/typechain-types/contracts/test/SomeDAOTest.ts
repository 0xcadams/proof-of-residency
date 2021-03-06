/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface SomeDAOTestInterface extends utils.Interface {
  functions: {
    "joinDao()": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "joinDao"): FunctionFragment;

  encodeFunctionData(functionFragment: "joinDao", values?: undefined): string;

  decodeFunctionResult(functionFragment: "joinDao", data: BytesLike): Result;

  events: {};
}

export interface SomeDAOTest extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SomeDAOTestInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    joinDao(overrides?: CallOverrides): Promise<[boolean]>;
  };

  joinDao(overrides?: CallOverrides): Promise<boolean>;

  callStatic: {
    joinDao(overrides?: CallOverrides): Promise<boolean>;
  };

  filters: {};

  estimateGas: {
    joinDao(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    joinDao(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
