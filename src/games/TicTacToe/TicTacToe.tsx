import React, { Dispatch, FunctionComponent } from "react";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import TagFacesIcon from "@material-ui/icons/TagFaces";
import Typography from "@material-ui/core/Typography";
import { red, blue } from "@material-ui/core/colors";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { GridBoard } from "components/GridBoard";
import { pointToIndex } from "utils/GridUtil";
import {
  allGameFlowDispatches,
  GameAction,
  GameState,
  GameStatus
} from "models/Game";
import { playerSelectIndex } from "games/TicTacToe/hooks/useGameState";
import {
  GRID_CELL_WIDTH,
  GRID_WIDTH,
  GRID_COLUMNS
} from "games/TicTacToe/constants/GameSettings";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridBoard: {
      flex: 1
    },
    gridApp: {
      height: "100%"
    },
    gridTeams: {
      padding: 10,
      minHeight: 52
    }
  })
);

interface TicTacToeProps {
  dispatch: Dispatch<GameAction<allGameFlowDispatches>>;
  state: GameState<allGameFlowDispatches>;
}

export const TicTacToe: FunctionComponent<TicTacToeProps> = ({
  dispatch,
  state
}) => {
  const classes = useStyles();

  const handleBoxClick = (e: React.MouseEvent) => {
    e.persist();
    const x = Math.floor(e.nativeEvent.offsetX / GRID_CELL_WIDTH);
    const y = Math.floor(e.nativeEvent.offsetY / GRID_CELL_WIDTH);
    dispatch(playerSelectIndex(pointToIndex({ x, y }, GRID_COLUMNS)));
  };

  return (
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
              label={`${ts.name} Score: ${ts.score}`}
            />
          </Grid>
        ))}
      </Grid>
      <Grid container direction="row" justify="center" alignItems="center">
        <Typography variant="h5" gutterBottom>
          {state.gameStatus === GameStatus.PLAYING && state.teams.length > 0
            ? `${state.teams[state.currentTeam].name}'s Turn`
            : state.gameStatus === GameStatus.PLAYING
            ? "Add players"
            : state.gameStatus === GameStatus.WIN
            ? `${state.teams[state.currentTeam].name} Wins`
            : state.gameStatus}
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
          gridCellWidth={GRID_CELL_WIDTH}
          gridColumns={GRID_COLUMNS}
          width={GRID_WIDTH}
          height={GRID_WIDTH}
          onClick={handleBoxClick}
        />
      </Grid>
    </Grid>
  );
};
