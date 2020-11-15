import React, { useContext } from "react";
import {
  IconButton,
  Button,
  Typography,
  Toolbar,
  AppBar,
  makeStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { NavLink } from "react-router-dom";

// For login
import { AuthContext } from "../App";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  removedLinkDecoration: {
    textDecoration: "none",
    color: "white",
  },
  newAppBarColor: {
    backgroundColor: "#212121",
  },
}));

function navBar(props) {
  const classes = useStyles();

  // Auth context about login
  const authContext = useContext(AuthContext);
  const { isAuthenticated } = authContext.state;

  // Function for handling the logout
  const logoutHandler = () => {
    authContext.dispatch({
      type: "LOGOUT",
    });
  };

  return (
    <AppBar position="static" className={classes.newAppBarColor}>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Mochis
        </Typography>

        {!isAuthenticated ? (
          <>
            <Button color="inherit">
              <NavLink to="/home" className={classes.removedLinkDecoration}>
                Home
              </NavLink>
            </Button>
            <Button color="inherit">
              <NavLink to="/login" className={classes.removedLinkDecoration}>
                Log In
              </NavLink>
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit">
              <NavLink to="/account" className={classes.removedLinkDecoration}>
                My account
              </NavLink>
            </Button>
            <Button color="inherit">
              <NavLink to="/notes" className={classes.removedLinkDecoration}>
                Notes
              </NavLink>
            </Button>
            <Button color="inherit" onClick={logoutHandler}>
              Log Out
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default navBar;
