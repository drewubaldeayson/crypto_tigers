import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHatWizard } from "@fortawesome/free-solid-svg-icons";
import { TigerChip } from "./TigerChip";
import { Tooltip } from "@material-ui/core";
import { getDecorationName } from "../../utils/getAttributeName";
import { TigerConfig } from "../Tiger/Tiger";
import { shouldShowDecoration } from "../../utils/tigerLogic";

interface DecorationChipProps {
  tigerPropConfig: TigerConfig;
}

export const DecorationChip = ({ tigerPropConfig }: DecorationChipProps) => {
  const { decoration } = tigerPropConfig;

  const decorationName = getDecorationName(decoration);

  if (!shouldShowDecoration(tigerPropConfig)) {
    return null;
  }

  const label = `With ${decorationName}`;

  return (
    <Tooltip title={`Decoration type: ${decorationName}`}>
      <TigerChip
        icon={<FontAwesomeIcon icon={faHatWizard} fixedWidth />}
        label={label}
      />
    </Tooltip>
  );
};
