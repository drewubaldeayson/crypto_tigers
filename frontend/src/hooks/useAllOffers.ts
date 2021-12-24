import { useState, useEffect } from "react";
import { useMarketPlaceContract } from "./useContract";

// TODO: Combine with useFetch
export const useAllOffers = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [offeredTigerIds, setOfferedTigerIds] = useState<number[]>([]);
  const marketPlace = useMarketPlaceContract();

  const loadOfferIds = async () => {
    if (!marketPlace) {
      return;
    }

    setHasError(false);
    setIsFetching(true);

    try {
      const fetchedOffers = await marketPlace.getAllTokenOnSale();
      setOfferedTigerIds(fetchedOffers.map((bn: any) => bn.toString()));
    } catch (error) {
      setHasError(true);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    loadOfferIds();
  }, [marketPlace]);

  return { isFetching, hasError, offeredTigerIds, loadOfferIds };
};
