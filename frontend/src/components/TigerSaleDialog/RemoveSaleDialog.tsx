import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import { FetchedTiger } from "../../hooks/useFetchTiger";
import { useMarketPlaceContract } from "../../hooks/useContract";
import { useTigerOffer, FetchedOffer } from "../../hooks/useTigerOffer";
import { useFunction } from "../../hooks/useFunction";

interface RemoveSaleDialogProps {
  tigerData: FetchedTiger;
  name: string;
  isOpen: boolean;
  onClose: () => void;
  offer?: FetchedOffer;
}

export const RemoveSaleDialog = ({
  isOpen,
  onClose,
  tigerData,
  name,
  offer,
}: RemoveSaleDialogProps) => {
  const { loadOffer } = useTigerOffer(tigerData.id);
  const marketPlace = useMarketPlaceContract();
  const removeOffer = useFunction(marketPlace, "removeOffer");

  const handleRemove = async () => {
    removeOffer.call({
      args: [tigerData.id],
      afterResponse: onClose,
      afterConfirmation: () => loadOffer(marketPlace, true),
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        Remove {name} (#{tigerData.id}) from the market
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will remove the {name} from the marketplace. It is currently
          priced at Ξ{offer?.price}.
        </DialogContentText>
        {removeOffer.hasError && (
          <DialogContentText color="error">
            Could not remove the offer, an error occured.
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleRemove}>
          Remove from market
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
