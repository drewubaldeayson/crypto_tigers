import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@material-ui/core";
import { FetchedTiger } from "../../hooks/useFetchTiger";
import { useMarketPlaceContract } from "../../hooks/useContract";
import { useTigerOffer, FetchedOffer } from "../../hooks/useTigerOffer";
import { AccountAddress } from "../AccountAddress/AccountAddress";
import { useFunction } from "../../hooks/useFunction";

interface TigerBuyDialogProps {
  tigerData: FetchedTiger;
  name: string;
  isOpen: boolean;
  onClose: () => void;
  offer: FetchedOffer;
}

export const TigerBuyDialog = ({
  isOpen,
  onClose,
  tigerData,
  name,
  offer,
}: TigerBuyDialogProps) => {
  const { loadOffer } = useTigerOffer(tigerData.id);
  const marketPlace = useMarketPlaceContract();
  const buyTiger = useFunction(marketPlace, "buyTiger");

  const acceptOffer = async () => {
    await buyTiger.call({
      value: offer._rawPrice,
      args: [tigerData.id],
      afterResponse: onClose,
      afterConfirmation: () => loadOffer(marketPlace, true),
    });
    loadOffer(marketPlace, true);
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        Buy {name} (#{tigerData.id})
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can buy {name} from the marketplace. The price is Ξ {offer.price}.
        </DialogContentText>
        <Typography variant="overline">Current owner:</Typography>
        <br />
        <AccountAddress fullAddress>{offer.seller}</AccountAddress>
        {buyTiger.hasError && (
          <DialogContentText color="error">
            Could not accept the offer, an error occured.
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={acceptOffer}>
          Buy for Ξ{offer.price}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
