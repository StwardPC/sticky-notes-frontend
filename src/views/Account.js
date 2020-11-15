import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import { Button } from "@material-ui/core";

function AccountView() {
  // CURRENT USER'S ACCOUNT DATA STATE
  const [currentUserData, setCurrentUserData] = useState(null);

  // CURRENT USER'S LOGIN STATE
  const authContext = useContext(AuthContext);
  const { isAuthenticated, token, userID } = authContext.state;

  // REQUEST FOR GRAPHQL IN ORDER TO GET THE CURRENT USER'S DATA
  const getUserDataRequest = {
    query: `
      query {
        currentUser (_id: "${userID}") {
          fullName
          username
          email
        }
      }
    `,
  };

  const getCurrentUserData = () => {
    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(getUserDataRequest),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status != 200 && res.status != 201) {
          console.log("No 200 response for account data");
        } else {
          return res.json();
        }
      })
      .then((res) => {
        console.log(res);
        setCurrentUserData(res.data.currentUser);
      })
      .catch(() => {
        throw new Error("Cannot get account data atm");
      });
  };

  useEffect(() => {
    getCurrentUserData();
  }, []);

  return (
    <div>
      {currentUserData ? (
        <>
          <h1>{currentUserData.username}</h1>
          <h2>{currentUserData.fullName}</h2>
          <h2>{currentUserData.email}</h2>
          <Button variant="contained" color="secondary">
            Delete account
          </Button>
        </>
      ) : (
        <h1>No notes</h1>
      )}
    </div>
  );
}

export default AccountView;
