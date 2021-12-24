import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDna, faPalette } from "@fortawesome/free-solid-svg-icons";
import { TigerChip } from "./TigerChip";
import { Tooltip } from "@material-ui/core";
import { tigerConfig } from "../../config/tigerConfig";
import { getColorName } from "../../utils/getAttributeName";

interface SecondaryColorChipProps {
  colorIndex: number;
}

export const SecondaryColorChip = ({ colorIndex }: SecondaryColorChipProps) => {
  const colorHex = tigerConfig.properties.secondaryColor.variations[colorIndex];
  const colorName = getColorName(colorHex);

  return (
    <Tooltip title={`Secondary color: ${colorName}`}>
      <TigerChip
        icon={<FontAwesomeIcon icon={faPalette} fixedWidth />}
        label={colorName}
      />
    </Tooltip>
  );
};
