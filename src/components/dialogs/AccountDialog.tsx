import React, { FunctionComponent } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import AccountLoginCard from "../cards/AccountLoginCard";
import { useAccount, accountLogout } from "../../hooks/useAccount/useAccount";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative"
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1
    },
    grid: {
      flex: 1
    }
  })
);

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

interface AccountDialogProps {
  open: boolean;
  onClose: () => void;
}

const AccountDialog: FunctionComponent<AccountDialogProps> = ({
  open,
  onClose
}) => {
  const classes = useStyles();
  const [account, accountDispatch] = useAccount();

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Profile
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid
        className={classes.grid}
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        {!account.isLoggedIn && (
          <AccountLoginCard accountDispatch={accountDispatch} />
        )}
        {account.isLoggedIn && (
          <div>
            <Typography variant="h6" className={classes.title}>
              Username: {account.username}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => accountLogout(accountDispatch)}
            >
              Logout
            </Button>
          </div>
        )}
      </Grid>
    </Dialog>
  );
};

export default AccountDialog;
