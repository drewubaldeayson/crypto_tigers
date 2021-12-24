import React from "react";
import { FetchTigerCard } from "../FetchTigerCard/FetchTigerCard";
import { Grid } from "@material-ui/core";
import { FetchedTiger } from "../../hooks/useFetchTiger";

interface TigerGridProps {
  ids: number[];
  isBreedable?: boolean;
  onBreed?: (tiger1: FetchedTiger, tiger2: FetchedTiger) => void;
}

export const ItemTypes = {
  BREED_CARD: "BreedCard",
};

export const TigerGrid = ({ ids, isBreedable, onBreed }: TigerGridProps) => {
  // Assume the id is the index of the tigers (ie tigers are never deleted)
  return (
    <Grid container spacing={3}>
      {ids.map((id) => {
        return (
          <Grid item xs={6} sm={4} md={3} lg={2} xl={1} key={id}>
            <FetchTigerCard
              id={id}
              isBreedable={isBreedable}
              onBreed={onBreed}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
