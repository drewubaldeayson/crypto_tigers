import React from "react";
import { Tiger } from "../components/Tiger/Tiger";
import { TigerPreset } from "../config/presetTigers";
import { Box, Typography, Link } from "@material-ui/core";

export const Home = () => {
  return (
    <div>
      <Typography variant="h1" align="center">
        Crypto Tigers
      </Typography>
      <Typography variant="h4" align="center" color="secondary" gutterBottom>
        Buy. Breed. Adore. Sell
      </Typography>

      <Typography variant="subtitle1" align="center">
        An{" "}
        <Link href="" target="_blank" rel="noopener">
          Ayson Corporation
        </Link>{" "}
        project, made by{" "}
        <Link href="https://github.com/drewubaldeayson/" target="_blank" rel="noopener">
          Andrew Ayson
        </Link>
      </Typography>
      <Box mx="auto" maxWidth={640} my={7}>
        <Typography align="center">
          In CryptoTigers, users collect and breed the oh-so-adorable creatures
          that we call CryptoTigers! Each tiger has a unique genome that
          defines its appearance and traits. Players can breed their tigers to
          create new furry friends and unlock rare tiger attributes. ‘Blockchain’ is the
          technology that makes things like Bitcoin possible. While
          CryptoTigers isn’t a digital currency, it does offer the same
          security: each CryptoTiger is one-of-a-kind and 100% owned by you. It
          cannot be replicated, taken away, or destroyed.
        </Typography>

        <Box sx={{display: 'flex'}} mt={10}>
          <Tiger dna={TigerPreset.CuteTiger} />
          <Tiger dna={TigerPreset.CoolTiger} />
          <Tiger dna={TigerPreset.FancyTiger} />
          <Tiger dna={TigerPreset.SpaceTiger} />
          <Tiger dna={TigerPreset.GirlyTiger} />
          <Tiger dna={TigerPreset.WeirdTiger} />
        </Box>
      </Box>
    </div>
  );
};
