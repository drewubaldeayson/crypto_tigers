import React, { useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import {
  Card,
  Box,
  CardContent,
  Grid,
  Typography,
  Link,
  Button,
} from "@material-ui/core";
import { useFetchTiger } from "../hooks/useFetchTiger";
import { Tiger } from "../components/Tiger/Tiger";
import { BirthdayChip } from "../components/Chips/BirthdayChip";
import { GenChip } from "../components/Chips/GenChip";
import { AccountAddress } from "../components/AccountAddress/AccountAddress";
import { useTigerOwner } from "../hooks/useTigerOwner";
import { Link as RouterLink } from "react-router-dom";
import { FetchTigerCard } from "../components/FetchTigerCard/FetchTigerCard";
import { useChildrenTigers } from "../hooks/useChildrenTigers";
import { ColorChip } from "../components/Chips/ColorChip";
import { getConfigFromDna } from "../utils/getConfigFromDna";
import { PatternChip } from "../components/Chips/PatternChip";
import { EyeChip } from "../components/Chips/EyeChip";
import { DecorationChip } from "../components/Chips/DecorationChip";
import { getTigerName } from "../utils/getAttributeName";
import { useStore } from "../store/Store";
import { TigerSaleDialog } from "../components/TigerSaleDialog/TigerSaleDialog";
import { useTigerOffer } from "../hooks/useTigerOffer";
import { RemoveSaleDialog } from "../components/TigerSaleDialog/RemoveSaleDialog";
import { LoaderBox } from "../components/LoaderBox/LoaderBox";
import { TigerBuyDialog } from "../components/TigerSaleDialog/TigerBuyDialog";
import { useTigerCoreContract } from "../hooks/useContract";

export const TigerDetail = () => {
  let { id } = useParams();
  const { tigerData, isFetching, hasError } = useFetchTiger(Number(id));
  const { owner, fetchOwner } = useTigerOwner(id);
  const { children } = useChildrenTigers(id);
  const tigerCore = useTigerCoreContract();
  // Make sure to corresponding offer
  useTigerOffer(id);
  // But read data from the store because it can change when still being on this page
  const { account, offers } = useStore();
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [isRemoveSaleDialogOpen, setIsRemoveSaleDialogOpen] = useState(false);
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);

  if (hasError) {
    // For now handle all errors as 404 errors
    return <Redirect to="/404" />;
  }

  if (isFetching) {
    return <LoaderBox />;
  }

  if (!tigerData) {
    return null;
  }

  const offer = offers[id];

  const tigerConfig = getConfigFromDna(tigerData.genes);
  const name = getTigerName(tigerConfig, tigerData.id);
  const isOwner = account === owner;

  return (
    <>
      <Box>
        <Box mb={2}>
          <Card variant="outlined">
            <CardContent>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                py={4}
              >
                <Tiger dna={tigerData.genes} maxWidth={320} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <GenChip gen={tigerData.generation} />
        <BirthdayChip birthTime={tigerData.birthTime} />

        <Box maxWidth={800} mx="auto" mt={5}>
          <Grid container spacing={7}>
            <Grid item xs={12} sm={8}>
              <Typography variant="h3">{name}</Typography>
              <Typography variant="h4" color="textSecondary">
                # {tigerData.id}
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                mt={3}
              >
                <ColorChip tigerConfig={tigerConfig} />
                <PatternChip tigerConfig={tigerConfig} />
                <EyeChip tigerConfig={tigerConfig} />
                <DecorationChip tigerConfig={tigerConfig} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box mb={2}>
                <Typography variant="overline">Owner</Typography>
                <br />
                {owner ? (
                  <Link component={RouterLink} to={`/profile/${owner}`}>
                    <AccountAddress>{owner}</AccountAddress>
                  </Link>
                ) : (
                  "..."
                )}
              </Box>
              <Box>
                {isOwner && !offer?.active && (
                  <Button
                    color="secondary"
                    variant="contained"
                    fullWidth
                    onClick={() => setIsSaleDialogOpen(true)}
                  >
                    Sell
                  </Button>
                )}

                {isOwner && offer?.active && (
                  <>
                    <Typography paragraph>
                      {name} is currently on the marketplace for Ξ{offer.price}
                    </Typography>
                    <Button
                      color="secondary"
                      variant="contained"
                      fullWidth
                      onClick={() => setIsRemoveSaleDialogOpen(true)}
                    >
                      Remove from market
                    </Button>
                  </>
                )}

                {!isOwner && account && offer?.active && (
                  <>
                    <Typography paragraph>
                      {name} is currently on the marketplace for Ξ{offer.price}
                    </Typography>
                    <Button
                      color="secondary"
                      variant="contained"
                      fullWidth
                      onClick={() => setIsBuyDialogOpen(true)}
                    >
                      Buy for Ξ{offer.price}
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>

          {tigerData.momId || tigerData.dadId ? (
            <Box mt={9}>
              <Typography variant="h4" gutterBottom>
                Parents
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={6} sm={4}>
                  <Typography variant="h6">Mom</Typography>
                  <FetchTigerCard id={tigerData.momId} />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="h6">Dad</Typography>
                  <FetchTigerCard id={tigerData.dadId} />
                </Grid>
              </Grid>
            </Box>
          ) : null}

          {children.length > 0 && (
            <Box mt={9}>
              <Typography variant="h4" gutterBottom>
                Children
              </Typography>
              <Grid container spacing={4}>
                {children.map((childId) => (
                  <Grid item xs={6} sm={4} key={childId}>
                    <FetchTigerCard id={childId} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Box>
      {isSaleDialogOpen && (
        <TigerSaleDialog
          name={name}
          tigerData={tigerData}
          isOpen={isSaleDialogOpen}
          onClose={() => setIsSaleDialogOpen(false)}
          offer={offer}
        />
      )}
      {isRemoveSaleDialogOpen && (
        <RemoveSaleDialog
          name={name}
          tigerData={tigerData}
          isOpen={isRemoveSaleDialogOpen}
          onClose={() => setIsRemoveSaleDialogOpen(false)}
          offer={offer}
        />
      )}
      {isBuyDialogOpen && offer && (
        <TigerBuyDialog
          name={name}
          tigerData={tigerData}
          isOpen={isBuyDialogOpen}
          onClose={() => {
            fetchOwner(tigerCore);
            setIsBuyDialogOpen(false);
          }}
          offer={offer}
        />
      )}
    </>
  );
};
