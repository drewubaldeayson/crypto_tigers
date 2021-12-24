import React from "react";
import { TigerCard } from "../TigerCard/TigerCard";
import { useFetchTiger, FetchedTiger } from "../../hooks/useFetchTiger";
import { useTigerOffer } from "../../hooks/useTigerOffer";

interface FetchTigerCardProps {
  id: number;
  isBreedable?: boolean;
  onBreed?: (tiger1: FetchedTiger, tiger2: FetchedTiger) => void;
}

export const FetchTigerCard = ({ id, ...rest }: FetchTigerCardProps) => {
  const { isFetching, hasError, tigerData } = useFetchTiger(id);
  const { offer } = useTigerOffer(id);

  return (
    <TigerCard
      tiger={tigerData}
      isFetching={isFetching}
      hasError={hasError}
      offer={offer}
      {...rest}
    />
  );
};
