import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette } from "@fortawesome/free-solid-svg-icons";
import { TigerChip } from "./TigerChip";
import { Tooltip } from "@material-ui/core";
import { tigerConfig } from "../../config/tigerConfig";
import { getColorName } from "../../utils/getAttributeName";
import { TigerConfig } from "../Tiger/Tiger";

interface ColorChipProps {
  tigerPropConfig: TigerConfig;
}

export const ColorChip = ({ tigerPropConfig }: ColorChipProps) => {
  const { mainColor: color1, secondaryColor: color2 } = tigerPropConfig;

  const color1Hex = tigerConfig.properties.mainColor.variations[color1];
  const color2Hex = tigerConfig.properties.secondaryColor.variations[color2];
  const color1Name = getColorName(color1Hex);
  const color2Name = getColorName(color2Hex);

  const label =
    color1Name === color2Name ? color1Name : `${color1Name} ${color2Name}`;
  return (
    <Tooltip
      title={`Primary color: ${color1Name}. Secondary color: ${color2Name} `}
    >
      <TigerChip
        icon={<FontAwesomeIcon icon={faPalette} fixedWidth />}
        label={label}
      />
    </Tooltip>
  );
};
