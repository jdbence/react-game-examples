import React, { FunctionComponent } from "react";
import { GridBox } from "components/GridBox";
import { Box } from "components/Box";
import { indexToPoint } from "utils/GridUtil";
import { GridBoxIcons } from "models/Game";
import {
  GRID_COLUMNS,
  GRID_CELL_WIDTH
} from "games/Checkers/constants/GameSettings";

interface GridBoardProps {
  width: number;
  height: number;
  fill?: string;
  grid: Array<number>;
  gridColumns: number;
  gridCellWidth: number;
  gridBoxIcons: GridBoxIcons;
  highlightedCells?: Array<number>;
  onClick?: (e: any) => void;
}

const CheckerdBoard = ({
  width,
  height,
  fill,
  highlightedCells
}: {
  fill: string;
  width: number;
  height: number;
  highlightedCells: Array<number>;
}) => {
  const highlightFill = "lemonchiffon";
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <pattern
        id="pattern-checkers"
        x="0"
        y="0"
        width="200"
        height="200"
        patternUnits="userSpaceOnUse"
      >
        <rect fill={fill} x="0" width="100" height="100" y="0" />
        <rect fill={fill} x="100" width="100" height="100" y="100" />
      </pattern>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="url(#pattern-checkers)"
      />
      {highlightedCells.map(hc => {
        const p = indexToPoint(hc, GRID_COLUMNS);
        return (
          <rect
            key={`hc-${p.x}-${p.y}`}
            fill={highlightFill}
            x={p.x * GRID_CELL_WIDTH}
            width={GRID_CELL_WIDTH}
            height={GRID_CELL_WIDTH}
            y={p.y * GRID_CELL_WIDTH}
            opacity={0.65}
          />
        );
      })}
    </svg>
  );
};

export const GridBoard: FunctionComponent<GridBoardProps> = ({
  width,
  height,
  fill = "lightgrey",
  grid,
  gridCellWidth,
  gridColumns,
  gridBoxIcons,
  highlightedCells = [],
  onClick
}) => (
  <div style={{ width: width, height: height, position: "relative" }}>
    <CheckerdBoard
      fill={fill}
      width={width}
      height={height}
      highlightedCells={highlightedCells}
    />
    {grid.map((cell, i) => {
      const p = indexToPoint(i, gridColumns);
      return (
        <GridBox
          key={i}
          x={p.x}
          y={p.y}
          team={cell}
          gridCellWidth={gridCellWidth}
          gridBoxIcons={gridBoxIcons}
        />
      );
    })}
    <Box
      fill="transparent"
      width={width}
      height={height}
      onClick={onClick}
      svgProps={{ style: { position: "absolute", top: 0, left: 0 } }}
    />
  </div>
);
