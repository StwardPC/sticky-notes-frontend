import React, { Component, useRef } from "react";
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

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
  },
});

function SignUpView() {
  const classes = useStyles();
  // Input references for the TextFields in the form
  const fnInput = useRef();
  const userInput = useRef();
  const emailInput = useRef();
  const passInput = useRef();
  const rtPassInput = useRef();

  function submitHandler(event) {
    // For preventing a page reload
    event.preventDefault();
    const fullName = fnInput.current.value;
    const username = userInput.current.value;
    const email = emailInput.current.value;
    const password = passInput.current.value;
    const reTypePassword = rtPassInput.current.value;

    //console.log(fullName, username, email, password, reTypePassword);

    if (password != reTypePassword) {
      return;
    } else {
      const requestCreateUser = {
        query: `
        mutation{
          createUser(uInput: {
            username: "${username}",
            fullName: "${fullName}",
            email: "${email}",
            password: "${password}"
          }), {
            _id
            role
            username
            fullName
            email
            password
          }
        }
      `,
      };

      fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(requestCreateUser),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status != 200 && res.status != 201) {
            throw new Error("No 200 response");
          } else {
            return res.json();
          }
        })
        .then((resData) => {
          console.log(resData);
        })
        .catch(() => {
          throw new Error("It didn't work at all");
        });
    }
  }

  return (
    <Box display="flex" justifyContent="center" m={1} p={1}>
      <Card className={classes.root}>
        <form autoComplete="off" onSubmit={submitHandler}>
          <CardContent>
            <Box display="flex" justifyContent="center" m={1} p={1}>
              <TextField
                required
                label="Full Name"
                variant="outlined"
                inputRef={fnInput}
              />
            </Box>
            <Box display="flex" justifyContent="center" m={1} p={1}>
              <TextField
                required
                label="Username"
                variant="outlined"
                inputRef={userInput}
              />
            </Box>
            <Box display="flex" justifyContent="center" m={1} p={1}>
              <TextField
                required
                type="email"
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
            <Box display="flex" justifyContent="center" m={1} p={1}>
              <TextField
                required
                type="password"
                label="Re-type your password"
                variant="outlined"
                inputRef={rtPassInput}
              />
            </Box>
          </CardContent>
          <CardActions>
            <Box display="flex" flexDirection="column" mx="auto" p="auto">
              <Button type="submit" variant="contained" color="primary">
                Confirm
              </Button>

              <Button color="primary" component={NavLink} to="login">
                Already got an account?
              </Button>
            </Box>
          </CardActions>
        </form>
      </Card>
    </Box>
  );
}

export default SignUpView;
