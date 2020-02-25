import React, { useCallback } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { useTicTacToeGameState } from "./hooks/useTicTacToeGameState";
import { CommandPanel } from "./components/CommandPanel";
import { AppLayout } from "./components/AppLayout";
import { TicTacToe } from "./components/games/TicTacToe";
import AccountDialog from "./components/dialogs/AccountDialog";
import LibraryDialog from "./components/dialogs/LibraryDialog";
import useQuery from "./hooks/useQuery";

const PROFILE = "profile";
const LIBRARY = "library";

export default function App() {
  const [ticTacToeState, ticTacToeDispatch] = useTicTacToeGameState();
  const history = useHistory();
  const query = useQuery();

  const onCloseDialog = useCallback(() => {
    if (query.get("dialog")) {
      query.delete("dialog");
      const q = query.toString();
      history.replace(
        `${history.location.pathname}${q.length > 0 ? `?${q}` : ""}`
      );
    }
  }, [history, query]);

  const dialog = query.get("dialog");

  return (
    <AppLayout>
      <Switch>
        <Redirect exact from="/play" to="/" />
        <Route
          exact
          path="/"
          children={
            <div>
              Landing Page{" "}
              <span role="img" aria-label="bear">
                🐻
              </span>
            </div>
          }
        />
        <Route
          path="/play/:id"
          children={
            <>
              <CommandPanel
                dispatch={ticTacToeDispatch}
                state={ticTacToeState}
              />
              <TicTacToe dispatch={ticTacToeDispatch} state={ticTacToeState} />
            </>
          }
        />
      </Switch>
      <AccountDialog open={dialog === PROFILE} onClose={onCloseDialog} />
      <LibraryDialog open={dialog === LIBRARY} onClose={onCloseDialog} />
    </AppLayout>
  );
}
