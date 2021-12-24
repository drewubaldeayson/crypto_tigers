import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBabyCarriage } from "@fortawesome/free-solid-svg-icons";
import { DateTime } from "luxon";
import { TigerChip } from "./TigerChip";
import { Tooltip } from "@material-ui/core";

interface BirthdayChipProps {
  // Birthtime in unix time
  birthTime: number;
}

export const BirthdayChip = ({ birthTime }: BirthdayChipProps) => {
  const relativeBornDate = DateTime.fromSeconds(birthTime).toRelative({});
  const dateFormatted = DateTime.fromSeconds(birthTime).toLocaleString({
    weekday: "long",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Tooltip title={`Birthday: ${dateFormatted}`}>
      <TigerChip
        icon={<FontAwesomeIcon icon={faBabyCarriage} fixedWidth />}
        label={relativeBornDate}
      />
    </Tooltip>
  );
};
