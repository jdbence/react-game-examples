import React, {
  FunctionComponent,
  useState,
  useCallback,
  Dispatch
} from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import { accountLogin } from "../../hooks/useAccount/useAccount";
import {
  AccountAction,
  AccountActionPayload
} from "../../hooks/useAccount/models";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 275,
      maxWidth: 400,
      "& .MuiTextField-root": {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
      }
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)"
    },
    title: {
      fontSize: 14
    },
    pos: {
      marginBottom: 12
    }
  })
);

interface AccountLoginCardProps {
  accountDispatch: Dispatch<AccountAction<AccountActionPayload>>;
}

const AccountLoginCard: FunctionComponent<AccountLoginCardProps> = ({
  accountDispatch
}) => {
  const classes = useStyles();
  const [state, setState] = useState({
    isLoginInProgress: false,
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const onLoginClick = useCallback(() => {
    if (
      !state.isLoginInProgress &&
      state.password.length > 0 &&
      state.username.length > 0
    ) {
      setState({
        ...state,
        isLoginInProgress: true
      });
      accountLogin(state.username, state.password, accountDispatch).catch(
        () => {
          setState({
            ...state,
            isLoginInProgress: false
          });
          setErrors({
            ...errors,
            password: "Incorrect Password"
          });
        }
      );
    }
  }, [state, errors, accountDispatch]);

  const onChangeField = useCallback(
    (field: string, value: string) => {
      if (!state.isLoginInProgress) {
        setState({
          ...state,
          [field]: value
        });
        setErrors({
          ...errors,
          [field]: undefined
        });
      }
    },
    [state, errors]
  );

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Profile Login
        </Typography>
        <div>
          <TextField
            label="Username"
            variant="outlined"
            size="small"
            value={state.username}
            onChange={e => onChangeField("username", e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
            error={errors["username"] !== undefined}
            helperText={errors["username"]}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            size="small"
            value={state.password}
            onChange={e => onChangeField("password", e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
            error={errors["password"] !== undefined}
            helperText={errors["password"]}
          />
        </div>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={onLoginClick}
          disabled={state.isLoginInProgress}
        >
          Login
        </Button>
      </CardActions>
    </Card>
  );
};
export default AccountLoginCard;
