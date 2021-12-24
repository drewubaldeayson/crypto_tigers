import { useState, useCallback, useEffect } from "react";
import { useStore } from "../store/Store";
import { useTigerCoreContract } from "./useContract";
import { Contract } from "@ethersproject/contracts";

export interface FetchedTiger {
  id: number;
  genes: string;
  birthTime: number;
  dadId: number;
  momId: number;
  generation: number;
}

// TODO: Combine with useFetch
export const useFetchTiger = (id: number) => {
  const [isFetching, setIsFetching] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [tigerData, setTigerData] = useState<FetchedTiger | null>(null);
  const { addTiger, tigers } = useStore();
  const tigerCore = useTigerCoreContract();

  const loadTiger = useCallback(
    async (tigerCore: Contract | null, reFetch?: boolean) => {
      setHasError(false);
      setIsFetching(true);

      if (tigers[id] && !reFetch) {
        // Tiger already has been loaded, so lets use the value from the store
        setTigerData(tigers[id]);
        setIsFetching(false);
        return;
      }

      if (!tigerCore) {
        setIsFetching(false);
        return;
      }

      try {
        const response = await tigerCore.getTiger(id);

        const newTigerData = {
          id,
          genes: response.genes.toString(),
          birthTime: response.birthTime.toNumber(),
          dadId: response.dadId.toNumber(),
          momId: response.momId.toNumber(),
          generation: response.generation.toNumber(),
        };

        setTigerData(newTigerData);
        addTiger(newTigerData);
      } catch (error) {
        console.error(error);

        setHasError(true);
      } finally {
        setIsFetching(false);
      }
    },
    [id, tigers, tigerCore, addTiger]
  );

  useEffect(() => {
    loadTiger(tigerCore);
  }, [id, tigerCore]);

  return { isFetching, hasError, tigerData };
};
