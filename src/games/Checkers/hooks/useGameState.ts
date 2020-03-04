import { Dispatch, useReducer, Reducer, useCallback } from "react";
import {
  GameState,
  GameAction,
  GameStatus,
  GameFlowAction,
  GameWin,
  PlayerConnect,
  PlayerSelectIndex,
  allGameFlowDispatches
} from "models/Game";
import {
  TEAM_NAMES,
  GRID_COLUMNS,
  GRID_ROWS
} from "games/Checkers/constants/GameSettings";
import { indexToPoint, midPoint, pointToIndex, Point } from "utils/GridUtil";

const EMPTY_CELL = -1;
const TEAM_0 = 0;
const TEAM_1 = 1;
const MAX_TEAMS = 2;

/**
 * @param grid Grid to add to
 * @param index Starting index: where to begin adding checkers
 * @param count How many checkers to add
 * @param team Which team owns the checkers
 */
const placeCheckers = (
  grid: Array<number>,
  index: number,
  count: number,
  team: number
) => {
  let k = 0;
  while (k < count) {
    const p = indexToPoint(index, GRID_COLUMNS);
    if ((p.x + p.y) % 2 === 0) {
      grid.splice(index, 1, team);
      k++;
    }
    index++;
  }
};

/**
 * 64 squares on a checkerboard
 * Rows are set up with one player's pieces spanning 3 rows, then 2 empty rows, then 3 for the second player
 */
const genStartingGrid = () => {
  const CELL_COUNT = GRID_COLUMNS * GRID_ROWS;
  const g = new Array(CELL_COUNT).fill(-1);

  const CHECKER_COUNT = 12;
  placeCheckers(g, 0, CHECKER_COUNT, TEAM_0);
  placeCheckers(g, CELL_COUNT - CHECKER_COUNT * 2, CHECKER_COUNT, TEAM_1);

  return g;
};

const resetState = {
  currentTeam: 0,
  gameActions: [],
  gameStatus: GameStatus.PLAYING,
  grid: genStartingGrid(),
  possibleMoves: [],
  selectedCheckerIndex: -1
};

const initialState = {
  ...resetState,
  gameStatus: GameStatus.WAITING,
  teams: []
};

/**
 * Game is won if other team has no more pieces
 * @param grid Game board state
 * @param team Current team
 */
const isGameWon = (grid: Array<number>, team: number): boolean => {
  const g = grid;
  const otherTeam: number = team === TEAM_0 ? TEAM_1 : TEAM_0;
  return g.findIndex(cell => cell === otherTeam) === -1;
};

/**
 * Determine whether a player has a checker than can move to a certain square
 * @param grid Game board state
 * @param index Index of the desired move
 * @param team Current team
 */
const getCheckerToReachCell = (
  grid: Array<number>,
  index: number,
  team: number
): number => {
  const g = grid;
  const p1 = indexToPoint(index, GRID_COLUMNS);
  return g.findIndex((cell, i) => {
    if (cell !== team) {
      return false;
    }
    const p2 = indexToPoint(i, GRID_COLUMNS);
    const xOffset = Math.abs(p2.x - p1.x);
    const yOffset = team === TEAM_1 ? p2.y - p1.y : p1.y - p2.y;
    return xOffset === 1 && yOffset === 1;
  });
};

interface Move {
  activeCheckerIndex: number;
  jumpedCheckerIndex: number;
}
const isSquareReachableViaJump = (
  grid: Array<number>,
  index: number,
  team: number
): Move => {
  const g = grid;
  const p1 = indexToPoint(index, GRID_COLUMNS);
  const activeCheckerIndex = g.findIndex((cell, i) => {
    if (cell !== team) {
      return false;
    }
    const p2 = indexToPoint(i, GRID_COLUMNS);
    const xOffset = Math.abs(p2.x - p1.x);
    const yOffset = team === TEAM_1 ? p2.y - p1.y : p1.y - p2.y;
    return xOffset === 2 && yOffset === 2;
  });
  const midPointIndex =
    pointToIndex(
      midPoint(p1, indexToPoint(activeCheckerIndex, GRID_COLUMNS)),
      GRID_COLUMNS
    ) || -1;
  const otherTeam: number = team === TEAM_0 ? TEAM_1 : TEAM_0;
  const jumpedCheckerIndex =
    g[midPointIndex] === otherTeam ? midPointIndex : -1;
  return { activeCheckerIndex, jumpedCheckerIndex };
};

const isYCoordinateOutOfBounds = (yCoordinate: number, team: number) =>
  team === TEAM_0 ? yCoordinate >= GRID_ROWS : yCoordinate < 0;

const getMovesForIndex = (grid: Array<number>, index: number, team: number) => {
  const p0 = indexToPoint(index, GRID_COLUMNS);
  const xOffset = 1;
  const yOffset = team === TEAM_1 ? -1 : 1;
  const leftMove: Point = { x: p0.x - xOffset, y: p0.y + yOffset };
  const leftMoveIndex = pointToIndex(leftMove, GRID_COLUMNS);
  const rightMove: Point = { x: p0.x + xOffset, y: p0.y + yOffset };
  console.log({ leftMove, rightMove });
  const rightMoveIndex = pointToIndex(rightMove, GRID_COLUMNS);
  const moves: Array<number> = [];
  if (
    leftMove.x >= 0 &&
    !isYCoordinateOutOfBounds(leftMove.y, team) &&
    grid[leftMoveIndex] === EMPTY_CELL
  ) {
    moves.push(pointToIndex(leftMove, GRID_COLUMNS));
  }
  console.log(
    "!@#$R: ",
    rightMove.x < GRID_COLUMNS,
    !isYCoordinateOutOfBounds(rightMove.y, team),
    grid[rightMoveIndex] === EMPTY_CELL
  );
  if (
    rightMove.x < GRID_COLUMNS &&
    !isYCoordinateOutOfBounds(rightMove.y, team) &&
    grid[rightMoveIndex] === EMPTY_CELL
  ) {
    moves.push(rightMoveIndex);
  }
  return moves;
};

function onPlayerMessage(
  state: GameState<allGameFlowDispatches>,
  action: GameAction<PlayerSelectIndex>,
  dispatch: Dispatch<GameAction<allGameFlowDispatches>>
): GameState<allGameFlowDispatches> {
  const newGrid = [...state.grid];
  const payload = action && action.payload;

  // Player clicks their own checker
  if (
    payload &&
    state.gameStatus === GameStatus.PLAYING &&
    newGrid[payload.index] === state.currentTeam
  ) {
    const m = getMovesForIndex(newGrid, payload.index, state.currentTeam);

    // Highlight selected checker if that checker has moves available
    if (m.length > 0) {
      state.selectedCheckerIndex = payload.index;
      state.possibleMoves = m;
    }
    // Else, clear checker/move previews
    else {
      state.selectedCheckerIndex = -1;
      state.possibleMoves = [];
    }
  }

  if (
    payload &&
    state.gameStatus === GameStatus.PLAYING &&
    newGrid[payload.index] === EMPTY_CELL
  ) {
    // Cell can be reached without jumping
    const activeCheckerIndex = getCheckerToReachCell(
      newGrid,
      payload.index,
      state.currentTeam
    );
    const isCellInPossibleMoves =
      payload.index &&
      state.possibleMoves?.findIndex(pm => pm === payload.index) !== -1;
    if (isCellInPossibleMoves) {
      newGrid[activeCheckerIndex] = EMPTY_CELL;
      newGrid[payload.index] = state.currentTeam;
      state.grid = newGrid;
      state.selectedCheckerIndex = -1;
      state.possibleMoves = [];

      // did player win
      if (isGameWon(state.grid, state.currentTeam)) {
        dispatch({
          type: GameFlowAction.GAME_WIN,
          payload: {
            index: state.currentTeam
          }
        });
        setTimeout(() => {
          dispatch({
            type: GameFlowAction.GAME_RESET
          });
        }, 2000);
      }

      // next teams turn
      else {
        state.currentTeam = state.currentTeam === 0 ? 1 : 0;
      }
    } else {
      const {
        activeCheckerIndex,
        jumpedCheckerIndex
      } = isSquareReachableViaJump(
        state.grid,
        payload.index,
        state.currentTeam
      );
      // If there's a jump to be made... jump
      if (activeCheckerIndex !== -1 && jumpedCheckerIndex !== -1) {
        newGrid[activeCheckerIndex] = EMPTY_CELL;
        newGrid[jumpedCheckerIndex] = EMPTY_CELL;
        newGrid[payload.index] = state.currentTeam;
        state.grid = newGrid;
        state.selectedCheckerIndex = -1;
        state.possibleMoves = [];

        // did player win
        if (isGameWon(state.grid, state.currentTeam)) {
          dispatch({
            type: GameFlowAction.GAME_WIN,
            payload: {
              index: state.currentTeam
            }
          });
          setTimeout(() => {
            dispatch({
              type: GameFlowAction.GAME_RESET
            });
          }, 2000);
        }

        // next teams turn
        else {
          state.currentTeam = state.currentTeam === 0 ? 1 : 0;
        }
      }
    }
  }
  return state;
}

// function onCheckerSelect (
//   state: GameState<allGameFlowDispatches>,
//   action: GameAction<PlayerSelectIndex>,
//   dispatch: Dispatch<GameAction<allGameFlowDispatches>
// ) {
// }

function onPlayerConnect(
  state: GameState<allGameFlowDispatches>,
  action: GameAction<PlayerConnect>,
  dispatch: Dispatch<GameAction<allGameFlowDispatches>>
): GameState<allGameFlowDispatches> {
  if (state.teams.length < MAX_TEAMS) {
    state.teams.push({
      team: state.teams.length,
      score: 0,
      name: TEAM_NAMES[state.teams.length]
    });
    // autostart the game when all teams joined
    if (state.teams.length === MAX_TEAMS) {
      dispatch({
        type: GameFlowAction.GAME_START
      });
    }
  }
  return state;
}

function onPlayerDisconnect(
  state: GameState<allGameFlowDispatches>,
  action: GameAction<PlayerConnect>
): GameState<allGameFlowDispatches> {
  const payload = action && action.payload;
  if (payload) {
    state.teams = state.teams.filter((_, i) => i !== payload.index);
    state.gameStatus = GameStatus.WAITING;
  }
  return state;
}

function onGameWin(
  state: GameState<allGameFlowDispatches>,
  action: GameAction<GameWin>
): GameState<allGameFlowDispatches> {
  const payload = action && action.payload;
  if (payload) {
    state.gameStatus = GameStatus.WIN;
    state.teams = state.teams.map(ts => {
      if (ts.team === payload.index) {
        ts.score += 1;
      }
      return ts;
    });
  }
  return state;
}

function onGameTie(
  state: GameState<allGameFlowDispatches>
): GameState<allGameFlowDispatches> {
  state.gameStatus = GameStatus.TIE;
  return state;
}

function reducer(
  state: GameState<allGameFlowDispatches>,
  action: GameAction<allGameFlowDispatches>,
  dispatch: Dispatch<GameAction<allGameFlowDispatches>>
): GameState<allGameFlowDispatches> {
  const nextState = { ...state, gameActions: [...state.gameActions, action] };
  switch (action.type) {
    case GameFlowAction.GAME_START:
      return { ...nextState, gameStatus: GameStatus.PLAYING };
    case GameFlowAction.GAME_END:
      return { ...nextState };
    case GameFlowAction.GAME_RESET:
      return { ...nextState, ...resetState };
    case GameFlowAction.GAME_WIN:
      return onGameWin(nextState, action as GameAction<GameWin>);
    case GameFlowAction.GAME_TIE:
      return onGameTie(nextState);
    case GameFlowAction.PLAYER_MESSAGE:
      return onPlayerMessage(
        nextState,
        action as GameAction<PlayerSelectIndex>,
        dispatch
      );
    case GameFlowAction.PLAYER_CONNECT:
      return onPlayerConnect(
        nextState,
        action as GameAction<PlayerConnect>,
        dispatch
      );
    case GameFlowAction.PLAYER_DISCONNECT:
      return onPlayerDisconnect(nextState, action as GameAction<PlayerConnect>);
    default:
      return state;
    //throw new Error();
  }
}

export function useGameState(): [
  GameState<allGameFlowDispatches>,
  Dispatch<GameAction<allGameFlowDispatches>>
] {
  const asyncReducer = useCallback(
    (
      state: GameState<allGameFlowDispatches>,
      action: GameAction<allGameFlowDispatches>
    ): GameState<allGameFlowDispatches> => reducer(state, action, dispatch),
    []
  );

  const [state, dispatch] = useReducer<
    Reducer<GameState<allGameFlowDispatches>, GameAction<allGameFlowDispatches>>
  >(asyncReducer, initialState);

  return [state, dispatch];
}

export function playerSelectIndex(
  index: number
): GameAction<PlayerSelectIndex> {
  return {
    type: GameFlowAction.PLAYER_MESSAGE,
    payload: {
      index
    }
  };
}
