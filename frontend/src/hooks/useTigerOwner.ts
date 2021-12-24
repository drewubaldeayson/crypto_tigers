import { useState, useCallback, useEffect } from "react";
import { useTigerCoreContract } from "./useContract";
import { Contract } from "@ethersproject/contracts";

// TODO: Combine with useFetch
export const useTigerOwner = (id: number) => {
  const [isFetching, setIsFetching] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [owner, setOwner] = useState<string | null>(null);
  const tigerCore = useTigerCoreContract();

  const fetchOwner = useCallback(
    async (tigerCore: Contract | null) => {
      setHasError(false);
      setIsFetching(true);

      if (!tigerCore) {
        setHasError(true);
        return;
      }

      try {
        const response = await tigerCore.ownerOf(id);
        setOwner(response);
      } catch (error) {
        console.error("Error in fetchOwner", error);
        setHasError(true);
      } finally {
        setIsFetching(false);
      }
    },
    [id]
  );

  useEffect(() => {
    fetchOwner(tigerCore);
  }, [tigerCore, id]);

  return { isFetching, hasError, owner, fetchOwner };
};
