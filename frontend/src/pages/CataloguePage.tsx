import React, { useState, useEffect } from "react";
import { useTigerCoreContract } from "../hooks/useContract";
import { TigerGrid } from "../components/TigerGrid/TigerGrid";
import { Header } from "../components/Header/Header";

interface CataloguePageProps {
  children?: React.ReactNode;
}

export const CataloguePage = ({ children }: CataloguePageProps) => {
  const [totalSupply, setTotalSupply] = useState(0);
  const tigerCore = useTigerCoreContract();

  // Load tigers
  useEffect(() => {
    if (!tigerCore) {
      return;
    }

    const loadTigers = async () => {
      const totalSupply = await tigerCore.totalSupply();
      const totalSupplyNumber = totalSupply.toNumber();
      setTotalSupply(totalSupplyNumber);
    };

    loadTigers();
  }, [tigerCore]);

  const ids = [...Array(totalSupply)].map((_, i) => i);
  return (
    <div>
      <Header title="Catalogue" subTitle="A list of all the cryptotigers" />

      <TigerGrid ids={ids} />
    </div>
  );
};
