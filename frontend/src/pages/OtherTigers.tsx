import React from "react";
import { Typography, Box } from "@material-ui/core";
import { TigerGrid } from "../components/TigerGrid/TigerGrid";
import { useOwnedTigers } from "../hooks/useOwnedTigers";
import { Redirect, useParams } from "react-router";
import { AccountAddress } from "../components/AccountAddress/AccountAddress";

export const OtherTigers = () => {
  let { address } = useParams();
  const { tigers, hasError } = useOwnedTigers(address);

  if (!address || hasError) {
    return <Redirect to="404" />;
  }

  return (
    <div>
      <Typography variant="h2" component="h1" gutterBottom>
        <Box display="inline-flex" alignItems="center">
          All tigers of
          <Box display="inline-flex" alignItems="center" ml={2}>
            <AccountAddress iconSize={72}>{address}</AccountAddress>
          </Box>
        </Box>
      </Typography>
      <TigerGrid ids={tigers} />
    </div>
  );
};
