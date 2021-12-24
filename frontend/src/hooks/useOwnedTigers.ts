import { useState, useEffect } from "react";
import { useTigerCoreContract } from "./useContract";

export const useOwnedTigers = (accountAddress: string | null) => {
  const [isFetching, setIsFetching] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [tigers, setTigers] = useState<number[]>([]);
  const tigerCore = useTigerCoreContract();

  // TODO: Combine with useFetch
  const loadTigerIds = async () => {
    if (!tigerCore || !accountAddress) {
      return;
    }

    setHasError(false);
    setIsFetching(true);

    try {
      const fetchedTigers = await tigerCore.tokensOfOwner(accountAddress);
      setTigers(fetchedTigers.map((bn: any) => bn.toString()));
    } catch (error) {
      setHasError(true);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    loadTigerIds();
  }, [tigerCore, accountAddress]);

  return { isFetching, hasError, tigers, loadTigerIds };
};
