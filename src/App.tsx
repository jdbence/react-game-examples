import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useTicTacToeGameState } from "./hooks/useTicTacToeGameState";
import { CommandPanel } from "./components/CommandPanel";
import { AppLayout } from "./components/AppLayout";
import { TicTacToe } from "./components/games/TicTacToe";

export default function App() {
  const [ticTacToeState, ticTacToeDispatch] = useTicTacToeGameState();

  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/"
          children={
            <AppLayout>
              Landing Page <span role="img">🐻</span>
            </AppLayout>
          }
        />
        <Route
          exact
          path="/profile"
          children={
            <AppLayout>
              Profile Page <span role="img">🐻</span>
            </AppLayout>
          }
        />
        <Route
          exact
          path="/library"
          children={
            <AppLayout>
              Library Page <span role="img">🐻</span>
            </AppLayout>
          }
        />
        <Route
          path="/library/tic-tac-toe"
          children={
            <AppLayout>
              <CommandPanel
                dispatch={ticTacToeDispatch}
                state={ticTacToeState}
              />
              <TicTacToe dispatch={ticTacToeDispatch} state={ticTacToeState} />
            </AppLayout>
          }
        />
      </Switch>
    </BrowserRouter>
  );
}
