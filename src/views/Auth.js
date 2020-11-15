import React, { Component, useRef, useContext } from "react";
import {
  TextField,
  Button,
  CardActions,
  CardContent,
  Card,
  makeStyles,
  Box,
} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../App";

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
  },
});

function LogInView() {
  const classes = useStyles();

  // Input references for the TextFields in the form
  const emailInput = useRef();
  const passInput = useRef();

  const authContext = useContext(AuthContext);

  function submitHandler(event) {
    // For preventing a page reload
    event.preventDefault();
    const email = emailInput.current.value;
    const password = passInput.current.value;

    // console.log(username, password);

    const requestLogIn = {
      query: `
        query {
          login (
            email: "${email}",
            password: "${password}"
           ),
           {
            userID
            token
            tokenExpiration
           }
        }
      `,
    };

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestLogIn),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status != 200 && res.status != 201) {
          throw new Error("Something went wrong");
        } else {
          return res.json();
        }
      })
      .then((resObject) => {
        // resObject is basically that object that contains the login data
        if (resObject.data.login.token) {
          authContext.dispatch({
            type: "LOGIN",
            payload: resObject.data.login,
          });
        }
      })
      .catch(() => {
        throw new Error("This didn't work at all either");
      });
  }

  return (
    <Box display="flex" justifyContent="center" m={1} p={1}>
      <Card className={classes.root}>
        <form autoComplete="off" onSubmit={submitHandler}>
          <CardContent>
            <Box display="flex" justifyContent="center" m={1} p={1}>
              <TextField
                required
                label="Email"
                variant="outlined"
                inputRef={emailInput}
              />
            </Box>
            <Box display="flex" justifyContent="center" m={1} p={1}>
              <TextField
                required
                type="password"
                label="Password"
                variant="outlined"
                inputRef={passInput}
              />
            </Box>
          </CardContent>
          <CardActions>
            <Box display="flex" flexDirection="column" mx="auto" p="auto">
              <Button type="submit" variant="contained" color="primary">
                Log In
              </Button>
              <Button color="primary">Forgot password</Button>
              <Button color="primary" component={NavLink} to="signup">
                Sign Up
              </Button>
            </Box>
          </CardActions>
        </form>
      </Card>
    </Box>
  );
}

export default LogInView;
