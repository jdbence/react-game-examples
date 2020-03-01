import React, { FunctionComponent, useMemo } from "react";
import { motion } from "framer-motion";
// import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
// import CloseIcon from "@material-ui/icons/Close";
import { GridBoxIcons } from "models/Game";

interface GridBoxProps {
  x: number;
  y: number;
  team: number;
  gridCellWidth: number;
  gridBoxIcons: GridBoxIcons;
}

export const GridBox: FunctionComponent<GridBoxProps> = ({
  x = 0,
  y = 0,
  team = 0,
  gridCellWidth,
  gridBoxIcons
}) => {
  const variants = {
    open: {
      width: gridCellWidth,
      height: gridCellWidth,
      x: 0,
      y: 0
    },
    closed: {
      width: gridCellWidth * 0.5,
      height: gridCellWidth * 0.5,
      x: gridCellWidth * 0.25,
      y: gridCellWidth * 0.25
    }
  };
  const Icon = useMemo(() => gridBoxIcons[team]?.icon, [gridBoxIcons, team]);
  return (
    <motion.svg
      width={gridCellWidth}
      height={gridCellWidth}
      viewBox={`0 0 ${gridCellWidth} ${gridCellWidth}`}
      style={{
        position: "absolute",
        left: x * gridCellWidth,
        top: y * gridCellWidth
      }}
      transition={{ duration: 0.1 }}
      animate={team >= 0 ? "open" : "closed"}
      variants={variants}
    >
      {Icon && <Icon style={{ color: gridBoxIcons[team].color }} />}
      <rect width={gridCellWidth} height={gridCellWidth} fill="transparent" />
    </motion.svg>
  );
};
