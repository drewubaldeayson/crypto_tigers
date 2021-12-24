import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { TigerChip } from "./TigerChip";
import { Tooltip } from "@material-ui/core";
import { tigerConfig } from "../../config/tigerConfig";
import { getColorName, getEyeName } from "../../utils/getAttributeName";
import { TigerConfig } from "../Tiger/Tiger";

interface EyeChipProps {
  tigerConfig: TigerConfig;
}

export const EyeChip = ({ tigerConfig }: EyeChipProps) => {
  const { eyeColor, eyes } = tigerConfig;

  const colorHex = tigerConfig.properties.eyeColor.variations[eyeColor];
  const colorName = getColorName(colorHex);
  const eyeName = getEyeName(eyes);

  let label: string;
  if ([4, 6, 7].includes(eyes)) {
    label = `${eyeName} Eyes`;
  } else {
    label = `${colorName} ${eyeName} Eyes`;
  }

  return (
    <Tooltip title={`Eyes type: ${eyeName}. Color: ${colorName}`}>
      <TigerChip
        icon={<FontAwesomeIcon icon={faEye} fixedWidth />}
        label={label}
      />
    </Tooltip>
  );
};
