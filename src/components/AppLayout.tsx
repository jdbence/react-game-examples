import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import FolderOutlinedIcon from "@material-ui/icons/FolderOutlined";

const useStyles = makeStyles((theme: Theme) => {
  const drawerWidth = theme.spacing(7) + 1;
  return createStyles({
    root: {
      display: "flex"
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginRight: drawerWidth
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth,
      overflowX: "hidden"
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      position: "relative"
    }
  });
});

interface AppLayoutProps {
  children: any;
}

export const AppLayout: FunctionComponent<AppLayoutProps> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>{children}</main>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
        anchor="right"
      >
        <List>
          <ListItem button component={Link} to={"/profile"}>
            <ListItemIcon>
              <PersonOutlineOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={"Account"} />
          </ListItem>
          <ListItem button component={Link} to={"/library"}>
            <ListItemIcon>
              <FolderOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={"Library"} />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};
