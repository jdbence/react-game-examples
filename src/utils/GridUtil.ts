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

export const midPoint = (p1: Point, p2: Point): Point => {
  return {
    y: (p1.y + p2.y) / 2,
    x: (p1.x + p2.x) / 2
  };
};
