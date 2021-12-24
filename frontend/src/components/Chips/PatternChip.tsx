import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSplotch } from "@fortawesome/free-solid-svg-icons";
import { TigerChip } from "./TigerChip";
import { Tooltip } from "@material-ui/core";
import { tigerConfig } from "../../config/tigerConfig";
import { getColorName, getPatternName } from "../../utils/getAttributeName";
import { TigerConfig } from "../Tiger/Tiger";
import { shouldShowPattern } from "../../utils/tigerLogic";

interface PatternChipProps {
  tigerConfig: TigerConfig;
}

export const PatternChip = ({ tigerConfig }: PatternChipProps) => {
  const { patternColor, pattern } = tigerConfig;

  const colorHex = tigerConfig.properties.mainColor.variations[patternColor];
  const colorName = getColorName(colorHex);
  const patternName = getPatternName(pattern);

  if (!shouldShowPattern(tigerConfig)) {
    return null;
  }

  const label = `${colorName} ${patternName} Pattern`;

  return (
    <Tooltip title={`Pattern type: ${patternName}. Color: ${colorName}`}>
      <TigerChip
        icon={<FontAwesomeIcon icon={faSplotch} fixedWidth />}
        label={label}
      />
    </Tooltip>
  );
};
