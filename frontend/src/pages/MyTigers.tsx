import React, { useState } from "react";
import { Typography, Button, Box } from "@material-ui/core";
import { TigerGrid } from "../components/TigerGrid/TigerGrid";
import { useStore } from "../store/Store";
import { useOwnedTigers } from "../hooks/useOwnedTigers";
import { Redirect } from "react-router";
import { useTigerCoreContract } from "../hooks/useContract";
import { FetchedTiger } from "../hooks/useFetchTiger";
import { Tiger } from "../components/Tiger/Tiger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Header } from "../components/Header/Header";
import { useFunction } from "../hooks/useFunction";

export const MyTigers = () => {
  const { account } = useStore();
  const { tigers, hasError, loadTigerIds } = useOwnedTigers(account);
  const tigerCore = useTigerCoreContract();
  const breed = useFunction(tigerCore, "breed");
  const [breedTiger1, setBreedTiger1] = useState<null | FetchedTiger>(null);
  const [breedTiger2, setBreedTiger2] = useState<null | FetchedTiger>(null);

  if (hasError) {
    // For now handle all errors as 404 errors
    return <Redirect to="/404" />;
  }

  const handleBreed = async () => {
    if (breedTiger1 === null || breedTiger2 === null || tigers.length <= 1) {
      return;
    }

    breed.call({
      args: [breedTiger1.id, breedTiger2.id],
      afterResponse: () => {
        setBreedTiger1(null);
        setBreedTiger2(null);
      },
      afterConfirmation: loadTigerIds,
    });
  };

  return (
    <div>
      <Header title="My tigers" subTitle="The cutest of them all" />

      <Box my={4}>
        {breedTiger1 !== null && breedTiger2 !== null ? (
          <Box maxWidth={400} mx="auto" my={6} textAlign="center">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={2}
            >
              <Tiger dna={breedTiger1.genes} maxWidth={100} />
              <FontAwesomeIcon
                icon={faHeart}
                style={{ color: "#dd1a7c" }}
                size="lg"
              />
              <Tiger dna={breedTiger2.genes} maxWidth={100} />
            </Box>
            <Button onClick={handleBreed} color="primary" variant="contained">
              Give them some privacy
            </Button>
          </Box>
        ) : (
          <Typography variant="subtitle1" gutterBottom align="center">
            Drag 2 tigers on top of eachother to select them for breeding.
          </Typography>
        )}
      </Box>

      <TigerGrid
        ids={tigers}
        isBreedable
        onBreed={(tiger1, tiger2) => {
          setBreedTiger1(tiger1);
          setBreedTiger2(tiger2);
        }}
      />
    </div>
  );
};
