interface Point {
  x: number;
  y: number;
}

export const indexToPoint = (index: number, gridColumns: number): Point => {
  return {
    y: Math.floor(index / gridColumns),
    x: index % gridColumns
  };
};

export const pointToIndex = (p: Point, gridColumns: number): number => {
  return p.y * gridColumns + p.x;
};
