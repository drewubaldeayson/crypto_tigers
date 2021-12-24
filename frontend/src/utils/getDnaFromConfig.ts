import { tigerConfig, TigerConfigProperties } from "../config/tigerConfig";
import { TigerConfig } from "../components/Tiger/Tiger";

export const getDnaFromConfig = (config: TigerConfig) => {
  const dna = Object.keys(tigerConfig.properties)
    .map((key) => {
      const value = config[key as TigerConfigProperties];

      if (
        tigerConfig.properties[key as TigerConfigProperties].variations.length > 10
      ) {
        return value.toString().padStart(2, "0");
      }
      return value.toString();
    })
    .join("");

  return dna;
};
