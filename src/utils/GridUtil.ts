import { GRID_COLUMNS } from "../contants/GameSettings";

interface Point {
  x: number;
  y: number;
}

export const indexToPoint = (index: number): Point => {
  return {
    y: Math.floor(index / GRID_COLUMNS),
    x: index % GRID_COLUMNS
  };
};

export const pointToIndex = (p: Point): number => {
  return p.y * GRID_COLUMNS + p.x;
};
