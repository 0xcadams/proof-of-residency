import { useToast } from '@chakra-ui/react';
import { BigNumber, ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { ProofOfResidency, ProofOfResidency__factory as ProofOfResidencyFactory } from 'types';

import { useWallet, ChainUnsupportedError } from 'use-wallet';

const useProofOfResidency = () => {
  const [proofOfResidency, setProofOfResidency] = useState<{
    proofOfResidency: ProofOfResidency | null;
    signer: ethers.providers.JsonRpcSigner | null;
    provider: ethers.providers.Web3Provider | null;
  }>({
    proofOfResidency: null,
    signer: null,
    provider: null
  });

  const wallet = useWallet();

  const toast = useToast();

  useEffect(() => {
    if (
      wallet.error instanceof ChainUnsupportedError &&
      !toast.isActive('network-toast') &&
      process.env.NODE_ENV === 'development'
    ) {
      toast({
        id: 'network-toast',
        title: 'Error',
        description: `You must switch your network to use this app.`,
        status: 'error'
      });
    }
  }, [wallet.error]);

  useEffect(() => {
    (async () => {
      if (wallet.status !== 'connected') {
        await wallet.connect('injected');
      }
    })();
  }, []);

  useEffect(() => {
    if (
      wallet.status === 'connected' &&
      wallet.ethereum &&
      process.env.NEXT_PUBLIC_ETHEREUM_CONTRACT_ADDRESS
    ) {
      const provider = new ethers.providers.Web3Provider(wallet.ethereum);
      const signer = provider.getSigner();

      const proofOfResidency = ProofOfResidencyFactory.connect(
        process.env.NEXT_PUBLIC_ETHEREUM_CONTRACT_ADDRESS,
        signer
      );

      setProofOfResidency({ proofOfResidency, signer, provider });
    }
  }, [wallet.status]);

  return proofOfResidency;
};

export const useNetworkName = () => {
  const wallet = useWallet();

  return wallet.networkName;
};

export const useProviderExists = () => {
  const { signer } = useProofOfResidency();

  return Boolean(signer);
};

export const useGetCommitmentPeriodIsValid = () => {
  const [value, setValue] = useState<boolean | null>(null);

  const { proofOfResidency } = useProofOfResidency();

  useEffect(() => {
    (async () => {
      const response = await proofOfResidency?.commitmentPeriodIsValid();

      setValue(response ?? false);
    })();
  }, [proofOfResidency]);

  return value;
};

export const useGetCommitmentPeriodIsUpcoming = () => {
  const [value, setValue] = useState<boolean | null>(null);

  const { proofOfResidency } = useProofOfResidency();

  useEffect(() => {
    (async () => {
      const response = await proofOfResidency?.commitmentPeriodIsUpcoming();

      setValue(response ?? false);
    })();
  }, [proofOfResidency]);

  return value;
};

export const useHasTokenId = () => {
  const [value, setValue] = useState<string | null>(null);

  const { proofOfResidency } = useProofOfResidency();
  const walletAddress = useWalletAddress();

  useEffect(() => {
    (async () => {
      if (walletAddress && proofOfResidency) {
        const response = await proofOfResidency?.tokenOfOwnerByIndex(walletAddress, 0);

        setValue(response.toString());
      }
    })();
  }, [walletAddress, proofOfResidency]);

  return value;
};

export const useWalletAddress = () => {
  const [value, setValue] = useState<string | null>(null);

  const { signer } = useProofOfResidency();

  useEffect(() => {
    (async () => {
      const response = await signer?.getAddress();

      setValue(response ?? null);
    })();
  }, [signer]);

  return value;
};

export const useCurrentNonce = () => {
  const [value, setValue] = useState<BigNumber | null>(null);

  const { signer, proofOfResidency } = useProofOfResidency();

  useEffect(() => {
    (async () => {
      const response = await signer?.getAddress();

      if (response) {
        const nonce = await proofOfResidency?.nonces(response);

        setValue(nonce ?? null);
      }
    })();
  }, [signer, proofOfResidency]);

  return value;
};

export const useSigner = () => {
  const { signer } = useProofOfResidency();

  return signer;
};

export const useCommitAddress = () => {
  const { proofOfResidency } = useProofOfResidency();

  return proofOfResidency?.commitAddress;
};

export const useMint = () => {
  const { proofOfResidency } = useProofOfResidency();

  return proofOfResidency?.mint;
};

export const useMintPrice = () => {
  const { proofOfResidency } = useProofOfResidency();

  return proofOfResidency?.reservePrice;
};

export const useMintedCount = async (countryId: BigNumber): Promise<BigNumber | undefined> => {
  const { proofOfResidency } = useProofOfResidency();

  return proofOfResidency?.countryTokenCounts(countryId);
};

const getEip712Domain = async (contractAddress: string, chainId: number) => ({
  name: 'Proof of Residency Protocol',
  version: '1',
  chainId,
  verifyingContract: contractAddress
});

const passwordTypes = {
  Password: [
    { name: 'password', type: 'string' },
    { name: 'walletAddress', type: 'string' },
    { name: 'nonce', type: 'uint256' }
  ]
};

export const useSignPasswordEip712 = () => {
  const { signer } = useProofOfResidency();

  return useCallback(
    async (walletAddress: string, password: string, nonce: BigNumber) => {
      const chainId = await signer?.getChainId();

      if (chainId && signer) {
        const domain = await getEip712Domain(
          process.env.NEXT_PUBLIC_ETHEREUM_CONTRACT_ADDRESS ?? '',
          chainId
        );

        const signature = await signer._signTypedData(domain, passwordTypes, {
          password,
          walletAddress,
          nonce
        });

        return signature;
      }

      console.error('Chain ID or signer is not available');

      return null;
    },
    [signer]
  );
};
