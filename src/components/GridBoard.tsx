import React, { FunctionComponent } from "react";
import { GridBox } from "components/GridBox";
import { Box } from "components/Box";
import { indexToPoint } from "utils/GridUtil";

interface GridBoardProps {
  width: number;
  height: number;
  fill?: string;
  grid: Array<number>;
  gridColumns: number;
  gridCellWidth: number;
  onClick?: (e: any) => void;
}

const CheckerdBoard = ({
  width,
  height,
  fill
}: {
  fill: string;
  width: number;
  height: number;
}) => {
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
  onClick
}) => (
  <div style={{ width: width, height: height, position: "relative" }}>
    <CheckerdBoard fill={fill} width={width} height={height} />
    {grid.map((cell, i) => {
      const p = indexToPoint(i, gridColumns);
      return (
        <GridBox
          key={i}
          x={p.x}
          y={p.y}
          team={cell}
          gridCellWidth={gridCellWidth}
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
