import React, { useReducer, createContext } from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

// COMPONENTS
import LogInView from "./views/Auth";
import SignUpView from "./views/Registration";
import HomeView from "./views/Home";
import NotesView from "./views/Notes";
import NavBar from "./navigation/NavBar";
import AccountView from "./views/Account";

// Login
export const AuthContext = createContext();

// This state is basically for deciding when the user isn't logged in
const initialState = {
  isAuthenticated: false,
  token: null,
  userID: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        userID: action.payload.userID,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        userID: null,
      };
    default:
      return {
        ...state,
      };
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log("current state: ", state);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <AuthContext.Provider value={{ state: state, dispatch: dispatch }}>
          <NavBar />
          <main>
            <Switch>
              {!state.isAuthenticated ? (
                <>
                  <Redirect from="/notes" to="/login" exact />
                  <Redirect from="/" to="/home" exact />
                  <Route path="/login" component={LogInView} />
                  <Route path="/signup" component={SignUpView} />
                  <Route path="/home" component={HomeView} />
                </>
              ) : (
                <>
                  <Redirect from="/login" to="/notes" exact />
                  <Route path="/notes" component={NotesView} />
                  <Route path="/account" component={AccountView} />
                </>
              )}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

render(<App />, document.getElementById("root"));
