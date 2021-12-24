import React from "react";
import { useAllOffers } from "../hooks/useAllOffers";
import { TigerGrid } from "../components/TigerGrid/TigerGrid";
import { Header } from "../components/Header/Header";

interface MarketPlaceProps {
  children?: React.ReactNode;
}

export const MarketPlace = ({ children }: MarketPlaceProps) => {
  const { offeredTigerIds } = useAllOffers();

  return (
    <div>
      <Header title="MarketPlace" subTitle="You break it, you buy it" />
      <TigerGrid ids={offeredTigerIds} />
    </div>
  );
};
