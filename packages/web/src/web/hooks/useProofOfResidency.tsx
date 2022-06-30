import { useToast } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getContractAddressForChain, ProofOfResidencyNetwork } from 'src/contracts';
import { ProofOfResidency, ProofOfResidency__factory as ProofOfResidencyFactory } from 'types';
import {
  useAccount,
  useNetwork,
  useProvider,
  UserRejectedRequestError,
  useSigner,
  useSignTypedData
} from 'wagmi';

const useProofOfResidency = () => {
  const [proofOfResidency, setProofOfResidency] = useState<ProofOfResidency | null>(null);

  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  useEffect(() => {
    if (signer && chain?.id) {
      const proofOfResidency = ProofOfResidencyFactory.connect(
        getContractAddressForChain(chain.id as ProofOfResidencyNetwork),
        signer
      );

      setProofOfResidency(proofOfResidency);
    }
  }, [signer, chain]);

  return proofOfResidency;
};

//   useEffect(() => {
//     if (autoConnect) {
//       callback();
//     }
//   }, []);

//   return callback;
// };

export const useStatusAndChainUnsupported = () => {
  const { status, error } = useSigner();

  const toast = useToast();

  const connectionRejected = useMemo(() => error instanceof UserRejectedRequestError, [error]);

  // const noProvider = useMemo(
  //   () => wallet.error?.name === 'NoEthereumProviderError',
  //   [wallet.error]
  // );

  // const chainUnsupported = useMemo(
  //   () => wallet.error instanceof ChainUnsupportedError,
  //   [wallet.error]
  // );

  useEffect(() => {
    if (connectionRejected) {
      toast({
        title: 'Error',
        description: 'You must connect your wallet to use this app.',
        status: 'error'
      });
    }
  }, [connectionRejected]);

  // useEffect(() => {
  //   if (noProvider) {
  //     toast({
  //       title: 'Error',
  //       description: 'You must install Metamask to use this app.',
  //       status: 'error'
  //     });
  //   }
  // }, [noProvider]);

  // useEffect(() => {
  //   if (chainUnsupported) {
  //     toast({
  //       title: 'Error',
  //       description: 'Please switch your wallet network to Arbitrum and try again.',
  //       status: 'error'
  //     });
  //   }
  // }, [chainUnsupported]);

  return {
    status: status,
    connectionRejected
    // noProvider,
    // chainUnsupported
  };
};

export const useNetworkName = () => {
  const provider = useProvider();

  return provider?.network?.name;
};

export const useGetCommitmentPeriodIsValid = () => {
  const [value, setValue] = useState<boolean | null>(null);

  const proofOfResidency = useProofOfResidency();

  useEffect(() => {
    (async () => {
      try {
        const response = await proofOfResidency?.commitmentPeriodIsValid();

        setValue(response ?? false);
      } catch (e) {}
    })();
  }, [proofOfResidency]);

  return value;
};

export const useGetCommitmentPeriodIsUpcoming = () => {
  const [value, setValue] = useState<boolean | null>(null);

  const proofOfResidency = useProofOfResidency();

  useEffect(() => {
    (async () => {
      try {
        const response = await proofOfResidency?.commitmentPeriodIsUpcoming();

        setValue(response ?? false);
      } catch (e) {}
    })();
  }, [proofOfResidency]);

  return value;
};

export const useHasTokenId = () => {
  const [value, setValue] = useState<string | null>(null);

  const proofOfResidency = useProofOfResidency();
  const walletAddress = useWalletAddress();

  useEffect(() => {
    (async () => {
      if (walletAddress && proofOfResidency) {
        try {
          const response = await proofOfResidency?.tokenOfOwnerByIndex(walletAddress, 0);

          setValue(response.toString());
        } catch (e) {
          // fail silently
        }
      }
    })();
  }, [walletAddress, proofOfResidency]);

  return value;
};

export const useWalletAddress = () => {
  const { address } = useAccount();

  return address;
};

export const useCurrentNonce = () => {
  const [value, setValue] = useState<BigNumber | null>(null);

  const proofOfResidency = useProofOfResidency();

  const address = useWalletAddress();

  useEffect(() => {
    (async () => {
      try {
        if (address) {
          const nonce = await proofOfResidency?.nonces(address);

          setValue(nonce ?? null);
        }
      } catch (e) {}
    })();
  }, [address, proofOfResidency]);

  return value;
};

export const useCommitAddress = () => {
  const proofOfResidency = useProofOfResidency();

  return proofOfResidency?.commitAddress;
};

export const useMint = () => {
  const proofOfResidency = useProofOfResidency();

  return proofOfResidency?.mint;
};

export const useMintPrice = () => {
  const proofOfResidency = useProofOfResidency();

  return proofOfResidency?.reservePrice;
};

export const useMintedCount = async (countryId: BigNumber): Promise<BigNumber | undefined> => {
  const proofOfResidency = useProofOfResidency();

  return proofOfResidency?.countryTokenCounts(countryId);
};

export const useHasCommitment = (): boolean | null => {
  const [hasCommitment, setHasCommitment] = useState<boolean | null>(null);

  const proofOfResidency = useProofOfResidency();
  const walletAddress = useWalletAddress();

  useEffect(() => {
    (async () => {
      try {
        if (walletAddress) {
          const commitment = await proofOfResidency?.commitments(walletAddress);

          const isValueZero = commitment?.value?.isZero() ?? true;

          return setHasCommitment(!isValueZero);
        }
        return setHasCommitment(false);
      } catch (e) {
        return setHasCommitment(false);
      }
    })();
  }, [walletAddress, proofOfResidency]);

  return hasCommitment;
};

const getEip712Domain = (chainId: ProofOfResidencyNetwork) => ({
  name: 'Proof of Residency Protocol',
  version: '1',
  chainId,
  verifyingContract: getContractAddressForChain(chainId)
});

const passwordTypes = {
  Password: [
    { name: 'password', type: 'string' },
    { name: 'walletAddress', type: 'string' },
    { name: 'nonce', type: 'uint256' }
  ]
};

export const useSignPasswordEip712 = () => {
  const { chain } = useNetwork();
  const { data: signer } = useSigner();

  const { signTypedDataAsync } = useSignTypedData();

  return useCallback(
    async (walletAddress: string, password: string, nonce: BigNumber) => {
      const chainId = (chain?.id ?? 1) as ProofOfResidencyNetwork;

      if (chainId && signer) {
        const domain = getEip712Domain(chainId);

        const signature = await signTypedDataAsync({
          domain,
          types: passwordTypes,
          value: {
            password,
            walletAddress,
            nonce
          }
        });

        return signature;
      }

      console.error('Chain ID or signer is not available');

      return null;
    },
    [signer]
  );
};
