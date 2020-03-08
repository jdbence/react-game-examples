import {
  GRID_COLUMNS,
  GRID_ROWS,
  EMPTY_CELL,
  TEAM_0,
  TEAM_1
} from "games/Checkers/constants/GameSettings";

export interface Point {
  x: number;
  y: number;
}

enum Direction {
  up = "up",
  down = "down"
}

interface Move {
  index: number;
  isJump: boolean;
}

export const indexToPoint = (index: number, gridColumns: number): Point => {
  return {
    y: Math.floor(index / gridColumns),
    x: index % gridColumns
  };
};

export const isIndexInMoves = (index: number, moves: Array<Move>): boolean =>
  moves.findIndex(m => m.index === index) !== -1;

export const pointToIndex = (p: Point, gridColumns: number): number => {
  return p.y * gridColumns + p.x;
};

const isYCoordinateOutOfBounds = (yCoordinate: number, team: number) =>
  team === TEAM_0 ? yCoordinate >= GRID_ROWS : yCoordinate < 0;

export const getMovesForIndex = (
  grid: Array<number>,
  index: number,
  team: number
) => {
  const moves: Array<Move> = [];

  if (index >= 0) {
    const p0 = indexToPoint(index, GRID_COLUMNS);
    const xOffset = 1;
    const yOffset = team === TEAM_1 ? -1 : 1;

    const leftMove: Point = { x: p0.x - xOffset, y: p0.y + yOffset };
    const leftMoveIndex = pointToIndex(leftMove, GRID_COLUMNS);
    const rightMove: Point = { x: p0.x + xOffset, y: p0.y + yOffset };
    const rightMoveIndex = pointToIndex(rightMove, GRID_COLUMNS);

    if (
      leftMove.x >= 0 &&
      !isYCoordinateOutOfBounds(leftMove.y, team) &&
      grid[leftMoveIndex] === EMPTY_CELL
    ) {
      const isJump = isMoveAJump(leftMoveIndex, index).isJump;
      moves.push({ index: leftMoveIndex, isJump });
    } else if (
      grid[leftMoveIndex] !== EMPTY_CELL &&
      grid[leftMoveIndex] !== team
    ) {
      const leftJumpMove: Point = {
        x: leftMove.x - xOffset,
        y: leftMove.y + yOffset
      };
      const leftJumpMoveIndex = pointToIndex(leftJumpMove, GRID_COLUMNS);
      if (
        leftJumpMove.x >= 0 &&
        !isYCoordinateOutOfBounds(leftJumpMove.y, team) &&
        grid[leftJumpMoveIndex] === EMPTY_CELL
      ) {
        const isJump = isMoveAJump(leftJumpMoveIndex, index).isJump;
        moves.push({ index: leftJumpMoveIndex, isJump });
      }
    }

    if (
      rightMove.x < GRID_COLUMNS &&
      !isYCoordinateOutOfBounds(rightMove.y, team) &&
      grid[rightMoveIndex] === EMPTY_CELL
    ) {
      const isJump = isMoveAJump(rightMoveIndex, index).isJump;
      moves.push({ index: rightMoveIndex, isJump });
    } else if (
      grid[rightMoveIndex] !== EMPTY_CELL &&
      grid[rightMoveIndex] !== team
    ) {
      const rightJumpMove: Point = {
        x: rightMove.x + xOffset,
        y: rightMove.y + yOffset
      };
      const rightJumpMoveIndex = pointToIndex(rightJumpMove, GRID_COLUMNS);
      if (
        rightJumpMove.x < GRID_COLUMNS &&
        !isYCoordinateOutOfBounds(rightJumpMove.y, team) &&
        grid[rightJumpMoveIndex] === EMPTY_CELL
      ) {
        const isJump = isMoveAJump(rightJumpMoveIndex, index).isJump;
        moves.push({ index: rightJumpMoveIndex, isJump });
      }
    }
  }

  return moves;
};

export const isMoveAJump = (ia: number, ib: number) => {
  const pa = indexToPoint(ia, GRID_COLUMNS);
  const pb = indexToPoint(ib, GRID_COLUMNS);
  const pz = { x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2 };
  return {
    isJump: Math.abs(pa.x - pb.x) === 2,
    jumpIndex: pointToIndex(pz, GRID_COLUMNS)
  };
};
