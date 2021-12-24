import { TigerConfig } from "../components/Tiger/Tiger";

export const shouldShowDecoration = (tigerConfig: TigerConfig) => {
  return tigerConfig.hidden1 > 5 && tigerConfig.decoration > 0;
};

export const shouldShowPattern = (tigerConfig: TigerConfig) => {
  return tigerConfig.hidden2 > 5 && tigerConfig.pattern > 0;
};