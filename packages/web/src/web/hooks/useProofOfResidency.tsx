import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { ProofOfResidency, ProofOfResidency__factory as ProofOfResidencyFactory } from 'types';

import { useWallet } from 'use-wallet';

// ethers.getDefaultProvider(
//   process.env.VERCEL_ENV === 'production' ? 'rinkeby' : 'localhost',
//   {
//     etherscan: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
//     infura: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
//     alchemy: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
//   }
// );

const useProofOfResidency = () => {
  const [proofOfResidency, setProofOfResidency] = useState<ProofOfResidency | null>(null);

  const wallet = useWallet();

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
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
    ) {
      const provider = new ethers.providers.Web3Provider(wallet.ethereum);
      const signer = provider.getSigner();

      const proofOfResidency = ProofOfResidencyFactory.connect(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        signer
      );

      setProofOfResidency(proofOfResidency);
    }
  }, [wallet.status]);

  return proofOfResidency;
};

export const useNetworkName = () => {
  const [network, setNetwork] = useState<string | null>(null);

  const proofOfResidency = useProofOfResidency();

  useEffect(() => {
    (async () => {
      const retrievedNetwork = await proofOfResidency?.provider.getNetwork();

      setNetwork(retrievedNetwork?.name ?? null);
    })();
  }, [proofOfResidency]);

  return network;
};

export const useGetCommitmentPeriodIsValid = () => {
  const [value, setValue] = useState<boolean | null>(null);

  const proofOfResidency = useProofOfResidency();

  useEffect(() => {
    (async () => {
      const response = await proofOfResidency?.getCommitmentPeriodIsValid();

      setValue(response ?? false);
    })();
  }, [proofOfResidency]);

  return value;
};

export const useGetCommitmentPeriodIsUpcoming = () => {
  const [value, setValue] = useState<boolean | null>(null);

  const proofOfResidency = useProofOfResidency();

  useEffect(() => {
    (async () => {
      const response = await proofOfResidency?.getCommitmentPeriodIsUpcoming();

      setValue(response ?? false);
    })();
  }, [proofOfResidency]);

  return value;
};

export const useWalletAddress = () => {
  const [value, setValue] = useState<string | null>(null);

  const proofOfResidency = useProofOfResidency();

  useEffect(() => {
    (async () => {
      const response = await proofOfResidency?.signer.getAddress();

      setValue(response ?? null);
    })();
  }, [proofOfResidency]);

  return value;
};

export const useSigner = () => {
  const proofOfResidency = useProofOfResidency();

  return proofOfResidency?.signer;
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

  return proofOfResidency?.mintPrice;
};

export const useMintedCount = async (countryId: BigNumber): Promise<BigNumber | undefined> => {
  const proofOfResidency = useProofOfResidency();

  return proofOfResidency?.getCountryCount(countryId);
};

// export type TokenOwner = { content: string; link: string | null };

// export const getOwnerOfToken = async (tokenId: BigNumber): Promise<TokenOwner> => {
//   // const count = await getMintedCount(tokenId.div(ethers.BigNumber.from(10).pow(15)));

//   try {
//     const { proofOfResidency } = getProofOfResidency();

//     // if (count.toNumber() >= tokenId.mod(1000)) {
//     const owner = await proofOfResidency.ownerOf(tokenId);

//     return {
//       content: owner?.slice(0, 8) || 'None',
//       link: owner ? `https://etherscan.io/address/${owner}` : null
//     };
//     // }
//   } catch (e) {}

//   return {
//     content: 'None',
//     link: null
//   };
// };
