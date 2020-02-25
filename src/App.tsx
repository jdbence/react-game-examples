import React from "react";
import { useGameState } from "./hooks/useGameState";
import { CommandPanel } from "./components/CommandPanel";
import { AppLayout } from "./components/AppLayout";
import { TicTacToe } from "./components/games/TicTacToe";

export default function App() {
  const [state, dispatch] = useGameState();

  return (
    <AppLayout>
      <CommandPanel dispatch={dispatch} state={state} />
      <TicTacToe dispatch={dispatch} state={state} />
    </AppLayout>
  );
}
