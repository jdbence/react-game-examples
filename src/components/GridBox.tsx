import React, { FunctionComponent } from "react";
import { motion } from "framer-motion";
import { GRID_CELL_WIDTH } from "../contants/GameSettings";
import { red, blue } from "@material-ui/core/colors";

interface GridBoxProps {
  x: number;
  y: number;
  team: number;
}

export const GridBox: FunctionComponent<GridBoxProps> = ({
  x = 0,
  y = 0,
  team = 0
}) => {
  const variants = {
    open: {
      width: GRID_CELL_WIDTH,
      height: GRID_CELL_WIDTH,
      x: 0,
      y: 0
    },
    closed: {
      width: GRID_CELL_WIDTH * 0.5,
      height: GRID_CELL_WIDTH * 0.5,
      x: GRID_CELL_WIDTH * 0.25,
      y: GRID_CELL_WIDTH * 0.25
    }
  };
  const groupVariants = {
    open: {
      x: x * GRID_CELL_WIDTH,
      y: y * GRID_CELL_WIDTH
    },
    closed: {
      x: x * GRID_CELL_WIDTH,
      y: y * GRID_CELL_WIDTH
    }
  };
  return (
    <motion.g
      width={GRID_CELL_WIDTH}
      height={GRID_CELL_WIDTH}
      x={x * GRID_CELL_WIDTH}
      y={y * GRID_CELL_WIDTH}
      transition={{ duration: 0 }}
      animate={team >= 0 ? "open" : "closed"}
      variants={groupVariants}
    >
      <motion.rect
        width={0}
        height={0}
        x={0}
        y={0}
        fill={team === -1 ? "transparent" : team === 0 ? red[500] : blue[500]}
        transition={{ duration: 0.1 }}
        animate={team >= 0 ? "open" : "closed"}
        variants={variants}
      />
      <rect
        width={GRID_CELL_WIDTH}
        height={GRID_CELL_WIDTH}
        fill="transparent"
      />
    </motion.g>
  );
};
