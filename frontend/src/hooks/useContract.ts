import { useMemo } from "react";
import {
  abi as tigerCoreAbi,
  networks as tigerCoreNetworks,
} from "../assets/contracts/TigerCore.json";
import {
  abi as marketPlaceAbi,
  networks as marketPlaceNetworks,
} from "../assets/contracts/MarketPlace.json";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";

export const useContract = (
  address: string | null,
  abi: typeof tigerCoreAbi | typeof marketPlaceAbi
) => {
  const { library, account } = useWeb3React();

  return useMemo(() => {
    if (!account || !library || !address) {
      return null;
    }

    try {
      const signer = library.getSigner(account);

      const contract = new Contract(address, abi, signer);
      return contract;
    } catch (error) {
      throw new Error(`Failed to get contract: ${error.message}`);
    }
  }, [address, abi, library, account]);
};

export const useTigerCoreContract = () => {
  const { chainId } = useWeb3React();
  let address: string | null = null;

  // Get the network details.
  if (chainId === 1337) {
    // On local development, this is a random number under networksValues
    const networksValues = Object.values(tigerCoreNetworks);
    address = networksValues[networksValues.length - 1].address;
  } else if (chainId) {
    // On public chains this is the chainID
    // @ts-ignore
    address = tigerCoreNetworks[chainId.toString()].address;
  }

  return useContract(address, tigerCoreAbi);
};

export const useMarketPlaceContract = () => {
  const { chainId } = useWeb3React();
  let address: string | null = null;

  // Get the network details.
  if (chainId === 1337) {
    // On local development, this is a random number under networksValues
    const networksValues = Object.values(marketPlaceNetworks);
    address = networksValues[networksValues.length - 1].address;
  } else if (chainId) {
    // On public chains this is the chainID
    // @ts-ignore
    address = marketPlaceNetworks[chainId.toString()].address;
  }

  return useContract(address, marketPlaceAbi);
};
