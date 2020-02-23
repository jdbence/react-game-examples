import React, { FunctionComponent } from "react";
import { GridBox } from "./GridBox";
import { Box } from "./Box";
import { indexToPoint } from "../utils/GridUtil";

interface GridBoardProps {
  width: number;
  height: number;
  fill?: string;
  grid: Array<number>;
  onClick?: (e: any) => void;
}

export const GridBoard: FunctionComponent<GridBoardProps> = ({
  width,
  height,
  fill = "pink",
  grid,
  onClick
}) => (
  <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
    <Box fill={fill} width={width} height={height} />
    {grid.map((cell, i) => {
      const p = indexToPoint(i);
      return <GridBox key={i} x={p.x} y={p.y} team={cell} />;
    })}
    <Box fill="transparent" width={width} height={height} onClick={onClick} />
  </svg>
);
