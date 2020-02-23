import React, { FunctionComponent } from "react";

interface BoxProps {
  x?: number;
  y?: number;
  width: number;
  height: number;
  fill: string;
  onClick?: (e: any) => void;
}

export const Box: FunctionComponent<BoxProps> = ({
  x = 0,
  y = 0,
  width,
  height,
  fill,
  onClick
}) => (
  <rect
    x={x}
    y={y}
    width={width}
    height={height}
    fill={fill}
    onClick={onClick}
  />
);
