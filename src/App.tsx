import React from "react";
import { useGameState, playerSelectIndex } from "./hooks/useGameState";
import { CommandPanel } from "./components/CommandPanel";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import TagFacesIcon from "@material-ui/icons/TagFaces";
import Typography from "@material-ui/core/Typography";
import { red, blue } from "@material-ui/core/colors";
import { GRID_CELL_WIDTH, GRID_WIDTH } from "./contants/GameSettings";
import { GridBoard } from "./components/GridBoard";

import { pointToIndex } from "./utils/GridUtil";

import "./App.css";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridBoard: {
      flex: 1
    },
    gridApp: {
      height: "100%"
    },
    gridTeams: {
      padding: 10
    }
  })
);

export default function App() {
  const classes = useStyles();
  const [state, dispatch] = useGameState();

  const handleBoxClick = (e: React.MouseEvent) => {
    e.persist();
    const x = Math.floor(e.nativeEvent.offsetX / GRID_CELL_WIDTH);
    const y = Math.floor(e.nativeEvent.offsetY / GRID_CELL_WIDTH);
    dispatch(playerSelectIndex(pointToIndex({ x, y })));
  };

  return (
    <div className="App">
      <CommandPanel dispatch={dispatch} state={state} />
      <Grid container direction="column" className={classes.gridApp}>
        <Grid
          container
          direction="row"
          justify="space-evenly"
          alignItems="center"
          className={classes.gridTeams}
        >
          {state.teams.map(ts => (
            <Grid item key={ts.team}>
              <Chip
                avatar={
                  <TagFacesIcon
                    style={{ color: ts.team === 0 ? red[500] : blue[500] }}
                  />
                }
                label={`Team ${ts.team} Score: ${ts.score}`}
              />
            </Grid>
          ))}
        </Grid>
        <Grid container direction="row" justify="center" alignItems="center">
          <Typography variant="h5" gutterBottom>
            {state.gameStatus}
          </Typography>
        </Grid>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          className={classes.gridBoard}
        >
          <GridBoard
            grid={state.grid}
            width={GRID_WIDTH}
            height={GRID_WIDTH}
            onClick={handleBoxClick}
          />
        </Grid>
      </Grid>
    </div>
  );
}
