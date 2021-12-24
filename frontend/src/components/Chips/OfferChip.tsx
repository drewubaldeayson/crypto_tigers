import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import { TigerChip } from "./TigerChip";
import { Tooltip } from "@material-ui/core";
import { FetchedOffer } from "../../hooks/useTigerOffer";

interface OfferChipProps {
  offer: FetchedOffer;
}

export const OfferChip = ({ offer }: OfferChipProps) => {
  if (!offer.active) {
    return null;
  }

  return (
    <Tooltip
      title={`On the marketplace for Ξ ${offer.price} by ${offer.seller}`}
    >
      <TigerChip
        icon={<FontAwesomeIcon icon={faStore} fixedWidth />}
        label={`Ξ  ${offer.price}`}
        color="primary"
      />
    </Tooltip>
  );
};
