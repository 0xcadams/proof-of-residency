import { useEffect } from 'react';
import { ethers } from 'ethers';

export const useEthers = () => {
  useEffect(() => {}, []);

  const provider = new ethers.providers.JsonRpcProvider();

  const signer = provider.getSigner();

  return { ethers, provider, signer };
};
