import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDna } from "@fortawesome/free-solid-svg-icons";
import { TigerChip } from "./TigerChip";
import { Tooltip } from "@material-ui/core";

interface GenChipProps {
  gen: number;
}

export const GenChip = ({ gen }: GenChipProps) => {
  return (
    <Tooltip title={`Generation ${gen}`}>
      <TigerChip
        icon={<FontAwesomeIcon icon={faDna} fixedWidth />}
        label={gen}
      />
    </Tooltip>
  );
};
