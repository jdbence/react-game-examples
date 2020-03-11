import {
  GRID_COLUMNS,
  GRID_ROWS,
  EMPTY_CELL,
  TEAM_1
} from "games/Checkers/constants/GameSettings";
import { Move } from "games/Checkers/models/Game";

export interface Point {
  x: number;
  y: number;
}

export const indexToPoint = (index: number, gridColumns: number): Point => {
  return {
    y: Math.floor(index / gridColumns),
    x: index % gridColumns
  };
};

export const isIndexInMoves = (index: number, moves: Array<number>): boolean =>
  moves.findIndex(m => m === index) !== -1;

export const pointToIndex = (p: Point, gridColumns: number): number => {
  return p.y * gridColumns + p.x;
};

const isPointOutOfBounds = (p: Point) =>
  p.x < 0 || p.x >= GRID_COLUMNS || p.y >= GRID_ROWS || p.y < 0;

// TODO Move this to Checkers specific util
export const getMovesForIndex = (
  grid: Array<number>,
  index: number,
  value: number
): Array<Move> => {
  const point = indexToPoint(index, GRID_COLUMNS);
  const team = Math.floor(value);
  const xOffset = 1;
  const yOffset = value >= TEAM_1 ? -1 : 1;
  const isKing = value % 1 !== 0;
  console.log({ value, isKing });
  const basicMoves: Array<Point> = [
    { x: point.x - xOffset, y: point.y + yOffset },
    { x: point.x + xOffset, y: point.y + yOffset }
  ];
  const kingMoves: Array<Point> = isKing
    ? [
        { x: point.x - xOffset, y: point.y - yOffset },
        { x: point.x + xOffset, y: point.y - yOffset }
      ]
    : [];
  const leftJump = { x: point.x - xOffset * 2, y: point.y + yOffset * 2 };
  const rightJump = { x: point.x + xOffset * 2, y: point.y + yOffset * 2 };
  const backLeftJump = {
    x: point.x - xOffset * 2,
    y: point.y - yOffset * 2
  };
  const backRightJump = {
    x: point.x + xOffset * 2,
    y: point.y - yOffset * 2
  };
  const jumps = isKing
    ? [leftJump, rightJump, backLeftJump, backRightJump]
    : [leftJump, rightJump];
  const filteredJumps: Array<Point> = jumps.reduce(
    (km: Array<Point>, cm: Point) => {
      if (
        isMoveAJump(index, pointToIndex(cm, GRID_COLUMNS), grid, team).isJump
      ) {
        return km.concat(cm);
      }
      return km;
    },
    []
  );
  return [...basicMoves, ...kingMoves, ...filteredJumps].reduce(
    (m: Array<Move>, p: Point) => {
      const i = pointToIndex(p, GRID_COLUMNS);
      if (!isPointOutOfBounds(p)) {
        // Cell is empty. Move is good.
        if (grid[i] === EMPTY_CELL) {
          const { isJump, jumpedCellIndex } = isMoveAJump(index, i, grid, team);
          m.push({ index: i, isJump, jumpedCellIndex });
          return m;
        }
      }
      return m;
    },
    []
  );
};

/**
 *
 * @param ia Starting index
 * @param ib Destination index
 * @param grid Board state
 * @param team Should be whole numbers representing the current team's plain and kinged checkers
 */
export const isMoveAJump = (
  ia: number,
  ib: number,
  grid: Array<number>,
  team: number
) => {
  const pa = indexToPoint(ia, GRID_COLUMNS);
  const pb = indexToPoint(ib, GRID_COLUMNS);
  const pz = { x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2 };
  const jumpedCellIndex = pointToIndex(pz, GRID_COLUMNS);
  const isDistanceAJump = Math.abs(pa.x - pb.x) === 2;
  const isJumpedIndexEnemyCell =
    grid[jumpedCellIndex] !== EMPTY_CELL && grid[jumpedCellIndex] !== team;

  return {
    isJump: isDistanceAJump && isJumpedIndexEnemyCell,
    jumpedCellIndex
  };
};
