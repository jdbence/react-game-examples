import React, { Dispatch, FC, useState } from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  GameFlowAction,
  allGameFlowDispatches,
  GameState,
  GameAction
} from "../models/Game";
import CardActions from "@material-ui/core/CardActions";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    },
    card: {
      width: 275,
      position: "absolute",
      zIndex: 1000,
      right: 10,
      top: 10
    }
  })
);

interface CommandPanelProps {
  dispatch: Dispatch<GameAction<allGameFlowDispatches>>;
  state: GameState<allGameFlowDispatches>;
}
export const CommandPanel: FC<CommandPanelProps> = ({ dispatch, state }) => {
  const classes = useStyles();
  const allActions = Object.keys(GameFlowAction);
  const [action, setSelectedAction] = useState(allActions[0]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedAction(event.target.value as string);
  };

  const handleDispatch = (event: React.MouseEvent<{ value: unknown }>) => {
    if (action === GameFlowAction.PLAYER_DISCONNECT) {
      dispatch({
        type: action as GameFlowAction,
        payload: {
          index: state.teams.length - 1
        }
      });
    } else if (action === GameFlowAction.GAME_WIN) {
      dispatch({
        type: action as GameFlowAction,
        payload: {
          index: 1
        }
      });
    } else {
      dispatch({
        type: action as GameFlowAction
      });
    }
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <FormControl className={classes.formControl}>
          <InputLabel id="game-action-select-label">Game Action</InputLabel>
          <Select
            labelId="game-action-select-label"
            id="game-action-select"
            value={action}
            onChange={handleChange}
          >
            {allActions.map(k => (
              <MenuItem key={k} value={k}>
                {k}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={handleDispatch}>
          Dispatch
        </Button>
      </CardActions>
    </Card>
  );
};
