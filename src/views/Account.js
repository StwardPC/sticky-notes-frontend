import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import { Button } from "@material-ui/core";
import ConfirmationModal from "../components/ConfirmationModal";

function AccountView() {
  // CURRENT USER'S ACCOUNT DATA STATE
  const [currentUserData, setCurrentUserData] = useState(null);
  const [confirm, setConfirm] = useState(false);

  // CURRENT USER'S LOGIN STATE
  const authContext = useContext(AuthContext);
  const { isAuthenticated, token, userID } = authContext.state;

  // HANDLERS
  const openConfirmHandler = () => {
    setConfirm(true);
  };
  const closeConfirmHandler = () => {
    setConfirm(false);
  };

  const logoutHandler = () => {
    authContext.dispatch({
      type: "LOGOUT",
    });
  };

  // REQUEST FOR GRAPHQL IN ORDER TO GET THE CURRENT USER'S DATA
  const getCurrentUserData = (cancelSignal) => {
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

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(getUserDataRequest),
      headers: {
        "Content-Type": "application/json",
      },
      signal: cancelSignal,
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

  // REQUEST FOR DELETING ACCOUNT
  const deleteAccount = () => {
    const deleteAccountRequest = {
      query: `
        mutation {
          deleteUser (_id: "${userID}") {
            _id
            username
            email
          }
        }
      `,
    };

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(deleteAccountRequest),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status != 200 && res.status != 201) {
          console.log("no 200 response for deleting account");
        } else {
          return res.json();
        }
      })
      .then((res) => {
        console.log(res);
        closeConfirmHandler();
        logoutHandler();
      })
      .catch(() => {
        throw new Error("Cannot delete account atm");
      });
  };

  useEffect(() => {
    // AbortController FOR CANCELING THE getCurrentUserData'S FETCH
    const abortController = new AbortController();
    const signal = abortController.signal;

    getCurrentUserData(signal);

    // CANCEL
    return () => {
      abortController.abort();
    };
  }, []);

  const alertmsg = "Are you sure that you want to delete your account forever?";

  return (
    <div>
      {currentUserData ? (
        <>
          <h1>{currentUserData.username}</h1>
          <h2>{currentUserData.fullName}</h2>
          <h2>{currentUserData.email}</h2>
          <Button
            variant="contained"
            color="secondary"
            onClick={openConfirmHandler}
          >
            Delete account
          </Button>
          <ConfirmationModal
            open={confirm}
            onClose={closeConfirmHandler}
            msg={alertmsg}
            onConfirm={deleteAccount}
          />
        </>
      ) : (
        <h1>No user data</h1>
      )}
    </div>
  );
}

export default AccountView;
