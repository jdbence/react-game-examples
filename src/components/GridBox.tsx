import React, { FunctionComponent } from "react";
import { motion } from "framer-motion";
import { GRID_CELL_WIDTH } from "../contants/GameSettings";
import { red, blue } from "@material-ui/core/colors";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import CloseIcon from "@material-ui/icons/Close";

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
  return (
    <motion.svg
      width={GRID_CELL_WIDTH}
      height={GRID_CELL_WIDTH}
      viewBox={`0 0 ${GRID_CELL_WIDTH} ${GRID_CELL_WIDTH}`}
      style={{
        position: "absolute",
        left: x * GRID_CELL_WIDTH,
        top: y * GRID_CELL_WIDTH
      }}
      transition={{ duration: 0.1 }}
      animate={team >= 0 ? "open" : "closed"}
      variants={variants}
    >
      {team === 1 && <RadioButtonUncheckedIcon style={{ color: blue[500] }} />}
      {team === 0 && <CloseIcon style={{ color: red[500] }} />}
      <rect
        width={GRID_CELL_WIDTH}
        height={GRID_CELL_WIDTH}
        fill="transparent"
      />
    </motion.svg>
  );
};
