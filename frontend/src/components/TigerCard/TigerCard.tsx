import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from "@material-ui/core";
import { Tiger } from "../Tiger/Tiger";
import { useHistory } from "react-router";
import { FetchedTiger } from "../../hooks/useFetchTiger";
import { GenChip } from "../Chips/GenChip";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../TigerGrid/TigerGrid";
import { primaryColor } from "../../theme/theme";
import { OfferChip } from "../Chips/OfferChip";
import { FetchedOffer } from "../../hooks/useTigerOffer";

interface TigerCardProps {
  tiger: FetchedTiger | null;
  offer: FetchedOffer | null;
  isFetching?: boolean;
  hasError?: boolean;
  isBreedable?: boolean;
  onBreed?: (tiger1: FetchedTiger, tiger2: FetchedTiger) => void;
}

const SkeletonCard = () => {
  return null;
};

const ErrorCard = () => {
  return null;
};

export const TigerCard = ({
  tiger,
  isFetching = false,
  hasError = false,
  isBreedable = false,
  onBreed,
  offer,
}: TigerCardProps) => {
  const history = useHistory();
  const [{ isDragging }, drag] = useDrag({
    canDrag: () => isBreedable,
    item: { type: ItemTypes.BREED_CARD, tiger },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.BREED_CARD,
    canDrop: () => isBreedable,
    drop:
      onBreed && !!tiger
        ? (item) => onBreed((item as any).tiger, tiger)
        : undefined,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleClick = () => {
    if (!tiger) {
      return;
    }

    history.push(`/tiger/${tiger.id}`);
  };

  if (isFetching) {
    return <SkeletonCard />;
  }

  if (hasError || !tiger) {
    return <ErrorCard />;
  }

  return (
    <div ref={drop}>
      <Card
        raised={isBreedable}
        innerRef={drag}
        style={{
          opacity: isDragging ? 0.2 : 1,
          cursor: "move",
          border: isOver ? `2px ${primaryColor} solid` : undefined,
        }}
      >
        <CardActionArea onClick={handleClick} focusRipple disableRipple>
          <CardContent>
            <Tiger dna={tiger.genes} />
            <Typography variant="h5" component="h2" gutterBottom>
              # {tiger.id}
            </Typography>
            <GenChip gen={tiger.generation} />
            {offer ? <OfferChip offer={offer} /> : null}
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
};
