import { useState, useEffect } from "react";
import { useTigerCoreContract } from "./useContract";

export const useChildrenTigers = (tigerId: string | null) => {
  const [isFetching, setIsFetching] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [children, setChildren] = useState<number[]>([]);
  const tigerCore = useTigerCoreContract();

  // TODO: Combine with useFetch
  const loadChildrenIds = async () => {
    if (!tigerCore || tigerId == null) {
      return;
    }

    setHasError(false);
    setIsFetching(true);

    try {
      const children = await tigerCore.getChildren(tigerId);
      setChildren(children.map((bn: any) => bn.toString()));
    } catch (error) {
      console.error("Error in loadChildrenIds", error);
      setHasError(true);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    loadChildrenIds();
  }, [tigerCore, tigerId]);

  return { isFetching, hasError, children, loadChildrenIds };
};
