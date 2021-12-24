import React from "react";
import { Typography, Grid } from "@material-ui/core";
import { Tiger } from "../components/Tiger/Tiger";
import { TigerPreset } from "../config/presetTigers";

export const Error401 = () => {
  return (
    <Grid container justify="center" alignItems="center" spacing={10}>
      <Grid item xs={12} sm={6}>
        <Tiger dna={TigerPreset.UnAuthorizedTiger} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          401 - Unauthorized
        </Typography>
        <Typography variant="subtitle1" align="center">
          You are not allowed to enter this page.
        </Typography>
      </Grid>
    </Grid>
  );
};
