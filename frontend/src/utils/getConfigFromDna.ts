import { tigerConfig, TigerConfigProperties } from "../config/tigerConfig";
import { TigerConfig } from "../components/Tiger/Tiger";

export const getConfigFromDna = (dna: string) => {
  let dnaIndex = 0;

  // Account for dna that starts with leading zero(s)
  const validDna = dna.padStart(16);

  const config = Object.keys(tigerConfig.properties).reduce(
    (total, currentKey) => {
      let value;

      if (
        tigerConfig.properties[currentKey as TigerConfigProperties].variations
          .length > 10
      ) {
        value = validDna.substr(dnaIndex, 2);
        dnaIndex += 2;
      } else {
        value = validDna.substr(dnaIndex, 1);
        dnaIndex += 1;
      }

      // const value =
      return {
        ...total,
        [currentKey]: Number(value),
      };
    },
    {}
  );

  return config as TigerConfig;
};
