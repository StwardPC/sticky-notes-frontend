import React from "react";
import { render } from "react-dom";

function App() {
  return (
    <React.StrictMode>
      <div>
        <h1>It is working, dude!</h1>
      </div>
    </React.StrictMode>
  );
}

render(<App />, document.getElementById("root"));
