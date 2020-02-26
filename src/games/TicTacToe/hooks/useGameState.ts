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
import { TEAM_NAMES } from "games/TicTacToe/constants/GameSettings";

const EMPTY_CELL = -1;
const MAX_TEAMS = 2;

const resetState = {
  currentTeam: 0,
  gameActions: [],
  gameStatus: GameStatus.PLAYING,
  grid: [
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL
  ]
};

const initialState = {
  ...resetState,
  gameStatus: GameStatus.WAITING,
  teams: []
};

const isGameWon = (grid: Array<number>, team: number): boolean => {
  const g = grid;
  // top
  return (
    (team === g[0] && team === g[1] && team === g[2]) ||
    // middle
    (team === g[3] && team === g[4] && team === g[5]) ||
    // bottom
    (team === g[6] && team === g[7] && team === g[8]) ||
    // left
    (team === g[0] && team === g[3] && team === g[6]) ||
    // right
    (team === g[2] && team === g[5] && team === g[8]) ||
    // diagonal right
    (team === g[2] && team === g[4] && team === g[6]) ||
    // diagonal center
    (team === g[1] && team === g[4] && team === g[7]) ||
    // diagonal left
    (team === g[0] && team === g[4] && team === g[8])
  );
};

function onPlayerMessage(
  state: GameState<allGameFlowDispatches>,
  action: GameAction<PlayerSelectIndex>,
  dispatch: Dispatch<GameAction<allGameFlowDispatches>>
): GameState<allGameFlowDispatches> {
  const newGrid = [...state.grid];
  const payload = action && action.payload;

  if (payload && state.gameStatus === GameStatus.PLAYING) {
    // cell hasn't been filled
    if (newGrid[payload.index] === EMPTY_CELL) {
      newGrid[payload.index] = state.currentTeam;
      state.grid = newGrid;

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
      // is game tied
      else if (state.grid.filter(v => v === EMPTY_CELL).length === 0) {
        dispatch({
          type: GameFlowAction.GAME_TIE
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
  return state;
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
