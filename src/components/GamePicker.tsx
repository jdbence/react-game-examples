import React, { FunctionComponent, useMemo } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "components/AppLayout";
import { CommandPanel } from "components/CommandPanel";
import { useGameState as useCheckersGameState } from "games/Checkers/hooks/useGameState";
import { useGameState as useTicTacToeGameState } from "games/TicTacToe/hooks/useGameState";
import { Checkers } from "games/Checkers/Checkers";
import { TicTacToe } from "games/TicTacToe/TicTacToe";
import { CHECKERS, TIC_TAC_TOE } from "constants/Games";

interface GamePickerProps {}

export const GamePicker: FunctionComponent<GamePickerProps> = () => {
  const { id } = useParams();
  const [checkersState, checkersDispatch] = useCheckersGameState();
  const [ticTacToeState, ticTacToeDispatch] = useTicTacToeGameState();

  const Game = useMemo(() => {
    if (id === TIC_TAC_TOE) {
      return (
        <>
          <CommandPanel dispatch={ticTacToeDispatch} state={ticTacToeState} />
          <TicTacToe dispatch={ticTacToeDispatch} state={ticTacToeState} />
        </>
      );
    } else if (id === CHECKERS) {
      return (
        <>
          <CommandPanel dispatch={checkersDispatch} state={checkersState} />
          <Checkers dispatch={checkersDispatch} state={checkersState} />
        </>
      );
    }
    return <></>;
  }, [ticTacToeState, ticTacToeDispatch, checkersState, checkersDispatch, id]);

  return <AppLayout>{Game}</AppLayout>;
};
