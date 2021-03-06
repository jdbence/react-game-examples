import { SvgIconProps } from "@material-ui/core";
import { Move } from "games/Checkers/models/Game";

export enum GameStatus {
  WIN = "WIN",
  TIE = "TIE",
  PLAYING = "PLAYING",
  WAITING = "WAITING"
}

export interface Team {
  team: number;
  score: number;
  name: string;
}

export interface GameState<T> {
  teams: Array<Team>;
  currentTeam: number;
  gameActions: Array<GameAction<T>>;
  gameStatus: GameStatus;
  grid: Array<number>;
  selectedCheckerIndex?: number;
  possibleMoves?: Array<Move>;
}

export interface GameAction<T> {
  type: GameFlowAction;
  payload?: T;
}

export enum GameFlowAction {
  GAME_RESET = "GAME_RESET",
  GAME_START = "GAME_START",
  GAME_TURN_CHANGE = "GAME_TURN_CHANGE",
  PLAYER_CONNECT = "PLAYER_CONNECT",
  PLAYER_DISCONNECT = "PLAYER_DISCONNECT",
  PLAYER_MESSAGE = "PLAYER_MESSAGE",
  GAME_END = "GAME_END",
  GAME_WIN = "GAME_WIN",
  GAME_TIE = "GAME_TIE"
}

export interface PlayerSelectIndex {
  index: number;
}

export interface PlayerConnect {
  index: number;
}

export interface GameWin {
  index: number;
}

export type allGameFlowDispatches = PlayerSelectIndex | PlayerConnect | GameWin;

export type GridBoxIcons = {
  [team: number]: {
    icon: (props: SvgIconProps) => JSX.Element;
    color: string;
  };
};
