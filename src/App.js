import React, {
  useReducer,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

// COMPONENTS
import LogInView from "./views/Auth";
import SignUpView from "./views/Registration";
import HomeView from "./views/Home";
import NotesView from "./views/Notes";
import NavBar from "./navigation/NavBar";
import AccountView from "./views/Account";

// LOGIN CONTEXT
export const AuthContext = createContext();
// NOTES LIST CONTEXT
export const ListContext = createContext();

// This state is basically for deciding when the user isn't logged in
const initialState = JSON.parse(localStorage.getItem("authData"));

const reducer = (state, action) => {
  let loginState = null;
  let logoutState = null;
  switch (action.type) {
    case "LOGIN":
      loginState = {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        userID: action.payload.userID,
      };
      localStorage.setItem("authData", JSON.stringify(loginState));
      return loginState;
    case "LOGOUT":
      logoutState = {
        ...state,
        isAuthenticated: false,
        token: null,
        userID: null,
      };
      localStorage.setItem("authData", JSON.stringify(logoutState));
      return logoutState;
    default:
      return {
        ...state,
      };
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hasChanged, setHasChanged] = useState(0);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <AuthContext.Provider value={{ state: state, dispatch: dispatch }}>
          <ListContext.Provider
            value={{ hasChanged: hasChanged, setHasChanged: setHasChanged }}
          >
            <NavBar />
            <main>
              <Switch>
                {state.isAuthenticated ? (
                  <>
                    <Redirect from="/login" to="/notes" exact />

                    <Route path="/notes" component={NotesView} />

                    <Route path="/account" component={AccountView} />
                  </>
                ) : (
                  <>
                    <Redirect from="/notes" to="/login" exact />
                    <Redirect from="/" to="/home" exact />
                    <Route path="/login" component={LogInView} />
                    <Route path="/signup" component={SignUpView} />
                    <Route path="/home" component={HomeView} />
                  </>
                )}
              </Switch>
            </main>
          </ListContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

render(<App />, document.getElementById("root"));
