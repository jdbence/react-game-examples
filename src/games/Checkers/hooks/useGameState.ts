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
  GRID_ROWS,
  EMPTY_CELL,
  TEAM_0,
  // TEAM_0_KING,
  TEAM_1,
  MAX_TEAMS
} from "games/Checkers/constants/GameSettings";
import {
  indexToPoint,
  isIndexInMoves,
  isMoveAJump,
  getMovesForIndex
} from "utils/GridUtil";

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
  value: number
) => {
  let k = 0;
  while (k < count) {
    const p = indexToPoint(index, GRID_COLUMNS);
    if ((p.x + p.y) % 2 === 0) {
      grid.splice(index, 1, value);
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

function onPlayerMessage(
  state: GameState<allGameFlowDispatches>,
  action: GameAction<PlayerSelectIndex>,
  dispatch: Dispatch<GameAction<allGameFlowDispatches>>
): GameState<allGameFlowDispatches> {
  const newGrid = [...state.grid];
  const payload = action && action.payload;

  if (payload) {
    // Player clicks their own checker
    if (
      state.gameStatus === GameStatus.PLAYING &&
      newGrid[payload.index] === state.currentTeam
    ) {
      const clickedCheckerMoves = getMovesForIndex(
        newGrid,
        payload.index,
        state.currentTeam
      );

      console.log({ clickedCheckerMoves, payload });

      // Highlight selected checker if that checker has moves available
      if (clickedCheckerMoves.length > 0) {
        state.selectedCheckerIndex = payload.index;
        state.possibleMoves = clickedCheckerMoves;
      }
      // Else, clear checker/move previews
      else {
        state.selectedCheckerIndex = -1;
        state.possibleMoves = [];
      }
    }
    //
    // Player clicked an empty cell
    else if (
      state.gameStatus === GameStatus.PLAYING &&
      newGrid[payload.index] === EMPTY_CELL
    ) {
      const moves = getMovesForIndex(
        newGrid,
        state.selectedCheckerIndex || -1,
        state.currentTeam
      );
      const isCellInMoves = isIndexInMoves(payload.index, moves);

      // Move the selected checker to the clicked cell
      if (state.selectedCheckerIndex && isCellInMoves) {
        const { isJump, jumpIndex } = isMoveAJump(
          state.selectedCheckerIndex,
          payload.index,
          state.grid,
          state.currentTeam
        );
        newGrid[state.selectedCheckerIndex] = EMPTY_CELL;
        newGrid[payload.index] = state.currentTeam;

        if (isJump) {
          newGrid[jumpIndex] = EMPTY_CELL;
          state.grid = newGrid;

          const newMoves = getMovesForIndex(
            newGrid,
            payload.index,
            state.currentTeam
          );

          // Player has no more moves available
          if (newMoves.length === 0) {
            onTurnEnd(state, action, dispatch);
          }
          // Player has more moves to make
          // Update the grid and show updated list of moves
          else {
            state.selectedCheckerIndex = payload.index;
            state.possibleMoves = newMoves;
          }
        } else {
          state.grid = newGrid;
          // Did player win
          onTurnEnd(state, action, dispatch);
        }
      }
    }
  }

  return state;
}

function onTurnEnd(
  state: GameState<allGameFlowDispatches>,
  action: GameAction<PlayerSelectIndex>,
  dispatch: Dispatch<GameAction<allGameFlowDispatches>>
) {
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
  // Next team's turn
  else {
    dispatch({
      type: GameFlowAction.GAME_TURN_CHANGE
    });
  }
}

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

function onGameTurnChange(
  state: GameState<allGameFlowDispatches>
): GameState<allGameFlowDispatches> {
  state.selectedCheckerIndex = -1;
  state.possibleMoves = [];
  state.currentTeam = state.currentTeam === 0 ? 1 : 0;
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
    case GameFlowAction.GAME_TURN_CHANGE:
      return onGameTurnChange(nextState);
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
